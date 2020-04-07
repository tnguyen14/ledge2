'use strict';

var { firestore, accounts } = require('../../db');
var union = require('lodash.union');
var pick = require('lodash.pick');
const merchants = require('./merchants');

var noAccount = new Error('No such account was found');
noAccount.status = 404;
var missingAccountName = new Error('Account name is required.');
missingAccountName.status = 404;
var conflictAccountName = new Error('Account already exists');
conflictAccountName.status = 409;

function showAll(params, callback) {
	accounts
		.where('user', '==', params.userId)
		.get()
		.then((acctSnapshot) => {
			callback(
				null,
				acctSnapshot.docs.map((acctDoc) => acctDoc.data())
			);
		}, callback);
}

function showOne(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}
	const acctRef = accounts.doc(`${params.userId}!${params.name}`);
	acctRef.get().then((acctSnapshot) => {
		if (!acctSnapshot.exists) {
			callback(noAccount);
			return;
		}
		const account = acctSnapshot.data();
		// filter out `null` merchants
		account.merchants = merchants.processMerchants(account.merchants_count);
		callback(null, account);
	}, callback);
}

// starting_balance defaults to 0
// type defaults to BUDGET. Other values include: CHECKING.
function newAccount(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}

	const acctRef = accounts.doc(`${params.userId}!${params.name}`);
	acctRef.get().then((acctSnapshot) => {
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
	const acctRef = accounts.doc(`${params.userId}!${params.name}`);
	acctRef.get().then((acctSnapshot) => {
		if (!acctSnapshot.exists) {
			return callback(noAccount);
		}
		const account = acctSnapshot.data();
		const opts = {};
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
		acctRef
			.set(
				{
					...pick(params, [
						'type',
						'categories',
						'starting_balance',
						'period_length',
						'period_budget'
					]),
					...opts
				},
				{
					merge: true
				}
			)
			.then(() => {
				callback(null, { updated: true });
			}, callback);
	});
}

function deleteAccount(params, callback) {
	if (!params.name) {
		return callback(missingAccountName);
	}

	const acctRef = accounts.doc(`${params.userId}!${params.name}`);
	acctRef.get().then((acctSnapshot) => {
		if (!acctSnapshot.exists) {
			return callback(noAccount);
		}
		firestore
			.deleteCollection(
				`accounts/${params.userId}!${params.name}/transactions`
			)
			.then(() => {
				return acctRef.delete();
			})
			.then(() => {
				callback(null, {
					deleted: true
				});
			}, callback);
	});
}

module.exports = {
	showAll,
	showOne,
	newAccount,
	updateAccount,
	deleteAccount,
	noAccount
};
