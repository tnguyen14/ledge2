'use strict';

var moment = require('moment-timezone');
var pick = require('lodash.pick');
var async = require('async');
var timezone = 'America/New_York';

const { accounts } = require('../db');
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
		.then(transactionsSnapshot => {
			callback(
				null,
				transactionsSnapshot.docs.map(txnSnapshot => txnSnapshot.data())
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
		.then(transactionsSnapshot => {
			callback(
				null,
				transactionsSnapshot.docs.map(txnSnapshot => txnSnapshot.data())
			);
		}, callback);
}

function showOne(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	getTransaction(params.userId, params.name, params.id, callback);
}

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
	var date = getTransactionDate(params.date, params.time);
	var uniqueId;

	async.series(
		[
			function(cb) {
				getUniqueTransactionId(
					date,
					params.userId,
					params.name,
					function(err, res) {
						if (!err) {
							uniqueId = res;
						}
						cb(err);
					}
				);
			},
			function(cb) {
				accounts
					.doc(`${params.userId}!${params.name}`)
					.collection('transactions')
					.doc(uniqueId)
					.set({
						amount: parseInt(params.amount, 10),
						date: date.toISOString(),
						description: params.description,
						merchant: params.merchant,
						status: params.status || 'POSTED',
						category: params.category || 'default',
						source: params.source
					})
					.then(() => {
						return merchants.add(
							params.merchant,
							params.userId,
							params.name
						);
					})
					.then(() => {
						cb(null);
					}, cb);
			}
		],
		function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				created: true,
				id: uniqueId
			});
		}
	);
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
	var opts = {};
	var newTransaction, oldTransaction, newTransactionId, date;
	if (params.date && params.time) {
		date = getTransactionDate(params.date, params.time);
		opts.date = date.toISOString();
	}
	if (params.amount) {
		opts.amount = parseInt(params.amount, 10);
	}
	opts.updatedOn = moment()
		.tz(timezone)
		.toISOString();
	newTransaction = Object.assign(
		{},
		pick(params, [
			// only update specified properties
			'amount',
			'date',
			'description',
			'merchant',
			'status',
			'category',
			'source'
		]),
		opts
	);

	async.waterfall(
		[
			// get the old transaction
			async.apply(getTransaction, params.userId, params.name, params.id),
			function(txn, cb) {
				oldTransaction = txn;
				// if date hasn't changed, just update the old transaction
				if (!date || date.isSame(oldTransaction.date)) {
					newTransactionId = params.id;
					return cb(null, false);
				}

				// set the new transaction id to a unique id if date has changed
				getUniqueTransactionId(
					date,
					params.userId,
					params.name,
					(err, uniqueId) => {
						if (err) {
							return cb(err);
						}
						newTransactionId = uniqueId;
						cb(null, true);
					}
				);
			},
			// write new transaction
			function(hasDateChange, cb) {
				accounts
					.doc(`${params.userId}!${params.name}`)
					.collection('transactions')
					.doc(newTransactionId)
					.set(newTransaction, { merge: true })
					// if date has changed, remove the old transaction
					.then(() => {
						if (!hasDateChange) {
							return cb(null);
						}
						deleteTransaction(params, cb);
					}, cb);
			},
			function(cb) {
				merchants
					.update(
						newTransaction.merchant,
						oldTransaction.merchant,
						params.userId,
						params.name
					)
					.then(() => {
						cb(null);
					}, cb);
			}
		],
		function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				updated: true,
				id: newTransactionId
			});
		}
	);
}

function deleteTransaction(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	async.waterfall(
		[
			async.apply(getTransaction, params.userId, params.name, params.id),
			function(transaction, cb) {
				merchants
					.remove(transaction.merchant, params.userId, params.name)
					.then(() => {
						cb(null);
					}, cb);
			},
			function(cb) {
				accounts
					.doc(`${params.userId}!${params.name}`)
					.collection('transactions')
					.doc(params.id)
					.delete()
					.then(() => {
						cb(null);
					}, cb);
			}
		],
		function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				deleted: true
			});
		}
	);
}

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {Object} moment object that represents the date and time of transaction
 * @param {String} userId the user ID
 * @param {String} accountName account name
 * @param {Function} callback
 */
function getUniqueTransactionId(date, userId, accountName, callback) {
	let id = date.valueOf();
	var notFound = false;
	async.until(
		function() {
			return notFound;
		},
		function(cb) {
			getTransaction(userId, accountName, id, err => {
				if (err) {
					if (err !== transactionNotFound) {
						return cb(err);
					}
					notFound = true;
				} else {
					id++;
				}
				cb(null, id);
			});
		},
		callback
	);
}

function getTransactionDate(date, time) {
	return moment.tz(`${date} ${time}`, timezone);
}

function getTransaction(userId, accountName, transactionId, cb) {
	accounts
		.doc(`${userId}!${accountName}`)
		.collection('transactions')
		.doc(transactionId)
		.get()
		.then(txnSnapshot => {
			if (!txnSnapshot.exists) {
				cb(transactionNotFound);
				return;
			}
			cb(null, txnSnapshot.data());
		}, cb);
}

module.exports = {
	showAll: showAll,
	showWeekly: showWeekly,
	showOne: showOne,
	createTransaction: createTransaction,
	updateTransaction: updateTransaction,
	deleteTransaction: deleteTransaction
};
