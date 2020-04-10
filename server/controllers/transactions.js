const moment = require('moment-timezone');
const pick = require('lodash.pick');
const async = require('async');
const timezone = 'America/New_York';

const firestore = require('@tridnguyen/firestore');
const accounts = firestore.collection('accounts');
const merchants = require('./accounts/merchants');

const missingAccountName = new Error('Account name is required.');
missingAccountName.status = 404;

const transactionNotFound = new Error('No such transaction was found');
transactionNotFound.status = 404;

/** TRANSATIONS ACTIONS **/

function showAll(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	// support range by date
	const before = moment
		.tz(params.before || new Date(), timezone)
		.toISOString();
	const after = moment
		.tz(params.after || new Date(0), timezone)
		.toISOString();
	const order = params.order || 'desc';
	const limit = Math.min(Number(params.limit) || 50, 1000);

	const transactionsRef = accounts
		.doc(`${params.userId}!${params.name}`)
		.collection('transactions');

	transactionsRef
		.where('date', '>', after)
		.where('date', '<', before)
		.orderBy('date', order)
		.limit(limit)
		.get()
		.then((transactionsSnapshot) => {
			callback(
				null,
				transactionsSnapshot.docs
					.map((txnSnapshot) => txnSnapshot.data())
					.map(hydrateTransaction)
			);
		}, callback);
}

function showWeekly(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	const weekOffset = params.offset || 0;
	const dayOffset = Number(weekOffset) * 7;

	// transactions are bound from this monday to before next monday
	// Monday is number 1 http://momentjs.com/docs/#/get-set/iso-weekday/
	const thisMonday = moment()
		.tz(timezone)
		.isoWeekday(1 + dayOffset)
		.startOf('day')
		.toISOString();
	const nextMonday = moment()
		.tz(timezone)
		.isoWeekday(8 + dayOffset)
		.startOf('day')
		.toISOString();

	const transactionsRef = accounts
		.doc(`${params.userId}!${params.name}`)
		.collection('transactions');

	transactionsRef
		.where('date', '>=', thisMonday)
		.where('date', '<', nextMonday)
		.orderBy('date', 'desc')
		.limit(1000) // heuristically set limit to 1000 transactions per week
		.get()
		.then((transactionsSnapshot) => {
			callback(
				null,
				transactionsSnapshot.docs
					.map((txnSnapshot) => txnSnapshot.data())
					.map(hydrateTransaction)
			);
		}, callback);
}

function showOne(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	getTransaction(params.userId, params.name, params.id).then(
		(transaction) => {
			callback(null, hydrateTransaction(transaction));
		},
		callback
	);
}

// params.date: 2018-10-24
// params.time: 22:03
function createTransaction(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	if (!params.amount) {
		let missingAmount = new Error(
			'Cannot add a transaction without amount'
		);
		missingAmount.status = 409;
		return callback(missingAmount);
	}
	if (!(params.date && params.time)) {
		let missingDateTime = new Error(
			'Cannot add a transaction without date and time'
		);
		return callback(missingDateTime);
	}
	const transaction = parseTransactionDetails(params);
	const defaultProps = {
		status: 'POSTED',
		category: 'default',
		span: 1
	};

	getUniqueTransactionId(moment(transaction.date), params.userId, params.name)
		.then((uniqueId) => {
			return accounts
				.doc(`${params.userId}!${params.name}`)
				.collection('transactions')
				.doc(uniqueId)
				.set({
					...defaultProps,
					...transaction,
					id: uniqueId
				})
				.then(() => {
					return merchants.add(
						params.merchant,
						params.userId,
						params.name
					);
				})
				.then(() => {
					callback(null, {
						created: true,
						id: uniqueId
					});
				});
		})
		.then(null, callback);
}

function updateTransaction(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	if (!params.id) {
		let missingID = new Error('Transaction ID is missing.');
		missingID.status = 409;
		return callback(missingID);
	}
	// opts is a conditional subset of params with some parsing
	let oldTransaction, newTransactionId;
	const newTransaction = parseTransactionDetails(params);

	getTransaction(params.userId, params.name, params.id)
		.then((txn) => {
			oldTransaction = txn;
			const newDate = moment(newTransaction.date);
			// if date hasn't changed, just update the old transaction
			if (!newTransaction.date || newDate.isSame(oldTransaction.date)) {
				newTransactionId = params.id;
				return false;
			}
			// set the new transaction id to a unique id if date has changed
			return getUniqueTransactionId(
				newDate,
				params.userId,
				params.name
			).then((uniqueId) => {
				newTransactionId = uniqueId;
				return true;
			});
		})
		.then((hasDateChange) => {
			return (
				accounts
					.doc(`${params.userId}!${params.name}`)
					.collection('transactions')
					.doc(newTransactionId)
					.set(
						{
							...newTransaction,
							updatedOn: moment().tz(timezone).toISOString(),
							id: newTransactionId
						},
						{ merge: true }
					)
					// if date has changed, remove the old transaction
					.then(() => {
						if (hasDateChange) {
							return removeTransaction(params);
						}
					})
			);
		})
		.then(() => {
			return merchants.update(
				newTransaction.merchant,
				oldTransaction.merchant,
				params.userId,
				params.name
			);
		})
		.then(() => {
			callback(null, {
				updated: true,
				id: newTransactionId
			});
		}, callback);
}

function removeTransaction(params) {
	let transaction;
	return getTransaction(params.userId, params.name, params.id)
		.then((txn) => {
			transaction = txn;
		})
		.then(() => {
			return accounts
				.doc(`${params.userId}!${params.name}`)
				.collection('transactions')
				.doc(params.id)
				.delete();
		})
		.then(() => {
			return merchants.remove(
				transaction.merchant,
				params.userId,
				params.name
			);
		});
}

function deleteTransaction(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	removeTransaction(params).then(() => {
		callback(null, { deleted: true });
	}, callback);
}

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {Object} moment object that represents the date and time of transaction
 * @param {String} userId the user ID
 * @param {String} accountName account name
 * @param {Function} callback
 */
function getUniqueTransactionId(date, userId, accountName) {
	let id = date.valueOf();
	var notFound = false;
	return new Promise((resolve, reject) => {
		async.until(
			function () {
				return notFound;
			},
			function (cb) {
				getTransaction(userId, accountName, String(id)).then(
					() => {
						id++;
						cb(null);
					},
					(err) => {
						if (err !== transactionNotFound) {
							return cb(err);
						}
						notFound = true;
						cb(null, id);
					}
				);
			},
			function (err, id) {
				if (err) {
					return reject(err);
				}
				resolve(String(id));
			}
		);
	});
}

function parseTransactionDetails(params) {
	const opts = {};
	if (params.date && params.time) {
		opts.date = moment
			.tz(`${params.date} ${params.time}`, timezone)
			.toISOString();
	}
	if (params.amount) {
		opts.amount = parseInt(params.amount, 10);
	}
	if (params.span) {
		opts.span = parseInt(params.span, 10);
	}
	return {
		...pick(params, [
			'description',
			'merchant',
			'status',
			'category',
			'source'
		]),
		...opts
	};
}

// massage transaction data to return
function hydrateTransaction(transaction) {
	return {
		...transaction,
		span: transaction.span || 1
	};
}

function getTransaction(userId, accountName, transactionId) {
	return accounts
		.doc(`${userId}!${accountName}`)
		.collection('transactions')
		.doc(transactionId)
		.get()
		.then((txnSnapshot) => {
			if (!txnSnapshot.exists) {
				throw transactionNotFound;
			}
			return txnSnapshot.data();
		});
}

function queryTransaction(userId, accountName, queries) {
	let transactions = accounts
		.doc(`${userId}!${accountName}`)
		.collection('transactions');
	// see https://firebase.google.com/docs/reference/js/firebase.firestore.Query#where
	queries.forEach((query) => {
		transactions = transactions.where(
			query.fieldPath,
			query.opStr,
			query.value
		);
	});
	return transactions.get().then((txnSnapshot) => {
		if (txnSnapshot.empty) {
			throw transactionNotFound;
		}
		const results = [];
		txnSnapshot.forEach((txn) => {
			results.push(txn.data());
		});
		return results;
	});
}

module.exports = {
	showAll: showAll,
	showWeekly: showWeekly,
	showOne: showOne,
	createTransaction: createTransaction,
	updateTransaction: updateTransaction,
	deleteTransaction: deleteTransaction,
	queryTransaction: queryTransaction
};
