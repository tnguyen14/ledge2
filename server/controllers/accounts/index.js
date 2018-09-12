'use strict';

var { firestore } = require('../../db');
var union = require('lodash.union');
var pick = require('lodash.pick');

var noAccount = new Error('No such account was found');
noAccount.status = 404;
var missingAccountName = new Error('Account name is required.');
missingAccountName.status = 404;
var conflictAccountName = new Error('Account already exists');
conflictAccountName.status = 409;

const accountsCol = firestore.collection('accounts');

function showAll(params, callback) {
	accountsCol
		.where('user', '==', params.userId)
		.get()
		.then(acctSnapshot => {
			callback(null, acctSnapshot.docs.map(acctDoc => acctDoc.data()));
		}, callback);
}

function showOne(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	const acctRef = accountsCol.doc(`${params.userId}!${params.name}`);
	acctRef.get().then(acctSnapshot => {
		if (!acctSnapshot.exists) {
			callback(noAccount);
			return;
		}
		callback(null, acctSnapshot.data());
	}, callback);
}

// starting_balance defaults to 0
// type defaults to BUDGET. Other values include: CHECKING.
function newAccount(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}

	const acctRef = accountsCol.doc(`${params.userId}!${params.name}`);
	acctRef.get().then(acctSnapshot => {
		if (acctSnapshot.exists) {
			return callback(conflictAccountName);
		}

		const newAccount = {
			starting_balance: params.starting_balance
				? Number(params.starting_balance)
				: 0,
			type: params.type || 'BUDGET',
			user: params.userId
		};

		// add default period length to 4 weeks
		if (newAccount.type === 'BUDGET') {
			newAccount.period_length = 4;
			newAccount.period_budget = 0;
		}

		acctRef.create(newAccount).then(() => {
			callback(null, {
				created: true
			});
		}, callback);
	});
}

function updateAccount(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	db.get('account!' + params.name, function(err, account) {
		if (err) {
			return callback(err);
		}
		var opts = {};
		if (
			params.categories &&
			params.categories[0] === '[' &&
			params.categories[-1] === ']'
		) {
			opts.categories = union(
				JSON.parse(params.categories),
				account.categories
			);
		}
		if (params.starting_balance) {
			opts.starting_balance = parseInt(params.starting_balance, 10);
		}
		db.put(
			'account!' + params.name,
			Object.assign(
				{},
				account,
				pick(params, [
					'type',
					'categories',
					'starting_balance',
					'period_length',
					'period_budget'
				]),
				opts
			),
			function(err) {
				if (err) {
					return callback(err);
				}
				callback(null, {
					updated: true
				});
			}
		);
	});
}

function deleteAccount(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	db.get('account!' + params.name, function(err, account) {
		if (err) {
			if (err.notFound) {
				callback(noAccount);
			} else {
				callback(err);
			}
			return;
		}
		// delete transactions associated with the account as well
		db.getRange(
			{
				gt: 'transaction!' + params.name + '!',
				lt: 'transaction!' + params.name + '!~'
			},
			function(err, transactions) {
				if (err) {
					return callback(err);
				}
				db.batch(
					transactions
						.map(function(tx) {
							return {
								type: 'del',
								key: tx.key
							};
						})
						.concat({
							type: 'del',
							key: 'account!' + params.name
						}),
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
		);
	});
}

module.exports = {
	showAll: showAll,
	showOne: showOne,
	newAccount: newAccount,
	updateAccount: updateAccount,
	deleteAccount: deleteAccount
};
