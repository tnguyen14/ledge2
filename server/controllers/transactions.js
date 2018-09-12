'use strict';

var db = require('../db');
var moment = require('moment-timezone');
var pick = require('lodash.pick');
var async = require('async');
var timezone = 'America/New_York';
var SEPARATOR = '!';

const merchants = require('./accounts/merchants');

const missingAccountName = new Error('Account name is required.');
missingAccountName.status = 404;

/** TRANSATIONS ACTIONS **/

function showAll(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	db.getRange(
		{
			gt: 'transaction!' + params.name + '!',
			lt: 'transaction!' + params.name + '!~'
		},
		function(err, items) {
			if (err) {
				return callback(err);
			}
			callback(
				null,
				items.map(function(item) {
					return Object.assign({}, item.value, {
						id: item.key.split('!').pop()
					});
				})
			);
		}
	);
}

function showWeekly(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	var weekOffset = params.offset || 0;
	var dayOffset = Number(weekOffset) * 7;

	// transactions are bound from this monday to before next monday
	// Monday is number 1 http://momentjs.com/docs/#/get-set/iso-weekday/
	var thisMonday = moment()
		.tz(timezone)
		.isoWeekday(1 + dayOffset)
		.startOf('day')
		.valueOf();
	var nextMonday = moment()
		.tz(timezone)
		.isoWeekday(8 + dayOffset)
		.startOf('day')
		.valueOf();
	db.getRange(
		{
			gte: 'transaction!' + params.name + '!' + thisMonday,
			lt: 'transaction!' + params.name + '!' + nextMonday
		},
		function(err, items) {
			if (err) {
				return callback(err);
			}
			callback(
				null,
				items.map(function(item) {
					return Object.assign({}, item.value, {
						id: item.key.split('!').pop()
					});
				})
			);
		}
	);
}

function showOne(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	db.get('transaction!' + params.name + '!' + params.id, function(
		err,
		transaction
	) {
		if (err) {
			if (err.notFound) {
				var transactionNotFound = new Error(
					'No such transaction was found.'
				);
				transactionNotFound.status = 404;
				callback(transactionNotFound);
			} else {
				callback(err);
			}
			return;
		}
		callback(null, transaction);
	});
}

function newTransaction(params, callback) {
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
				getUniqueTransactionId(date, params.name, function(err, res) {
					if (!err) {
						uniqueId = res;
					}
					cb(err);
				});
			},
			function(cb) {
				db.put(
					['transaction', params.name, uniqueId].join(SEPARATOR),
					{
						amount: parseInt(params.amount, 10),
						date: date.toDate(),
						description: params.description,
						merchant: params.merchant,
						status: params.status || 'POSTED',
						category: params.category || 'default',
						source: params.source
					},
					cb
				);
			},
			function(cb) {
				merchants.add(params.merchant, params.name, cb);
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
	var oldTransactionId = ['transaction', params.name, params.id].join(
		SEPARATOR
	);
	// opts is a conditional subset of params with some parsing
	var opts = {};
	var newTransaction,
		oldTransaction,
		uniqueId,
		newTransactionId,
		date,
		hasDateChange;
	if (params.date && params.time) {
		date = getTransactionDate(params.date, params.time);
		opts.date = date.toDate();
	}
	if (params.amount) {
		opts.amount = parseInt(params.amount, 10);
	}
	opts.updatedOn = Date.now();
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

	async.series(
		[
			// get the old transaction
			function(cb) {
				db.get(oldTransactionId, function(err, transaction) {
					oldTransaction = transaction;
					// check if date has changed
					if (date && !date.isSame(oldTransaction.date)) {
						hasDateChange = true;
					}
					cb(err);
				});
			},
			// set the new transaction id to a unique id if date has changed
			function(cb) {
				if (!hasDateChange) {
					newTransactionId = oldTransactionId;
					return cb(null);
				}
				getUniqueTransactionId(date, params.name, function(err, id) {
					if (!err) {
						uniqueId = id;
						newTransactionId = [
							'transaction',
							params.name,
							uniqueId
						].join(SEPARATOR);
					}
					cb(null);
				});
			},
			// write new transaction
			function(cb) {
				db.put(
					newTransactionId,
					Object.assign({}, oldTransaction, newTransaction),
					cb
				);
			},
			function(cb) {
				merchants.update(
					newTransaction.merchant,
					oldTransaction.merchant,
					params.name,
					cb
				);
			},
			// if date has changed, remove the old transaction
			function(cb) {
				if (!hasDateChange) {
					return cb(null);
				}
				deleteTransaction(
					{
						name: params.name,
						id: params.id
					},
					cb
				);
			}
		],
		function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				updated: true,
				id: hasDateChange ? uniqueId : params.id
			});
		}
	);
}

function deleteTransaction(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	var transactionId = 'transaction!' + params.name + '!' + params.id;
	async.waterfall(
		[
			async.apply(db.get.bind(db), transactionId),
			function(transaction, cb) {
				merchants.remove(transaction.merchant, params.name, cb);
			},
			async.apply(db.del.bind(db), transactionId)
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
 * @param {String} accountName account name
 * @param {Function} callback
 */
function getUniqueTransactionId(date, accountName, callback) {
	let id = date.valueOf();
	var notFound = false;
	async.until(
		function() {
			return notFound;
		},
		function(cb) {
			db.get(['transaction', accountName, id].join(SEPARATOR), function(
				err
			) {
				if (err && err.notFound) {
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

module.exports = {
	showAll: showAll,
	showWeekly: showWeekly,
	showOne: showOne,
	newTransaction: newTransaction,
	updateTransaction: updateTransaction,
	deleteTransaction: deleteTransaction
};
