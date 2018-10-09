require('dotenv').config();
const chunk = require('lodash.chunk');

const { firestore } = require('../');

const { getJson } = require('simple-fetch');

// migrating all old accounts/ transactions to this user
const user = process.env.AUTH0_USER;
const authToken = process.env.AUTH_TOKEN;
const serverUrl = process.env.SERVER_URL;

getJson(`${serverUrl}/accounts`, {
	headers: {
		Authorization: `Bearer ${authToken}`
	}
}).then(
	accts => {
		return Promise.all(
			accts.map(acct => {
				return writeAccount(acct).then(() => {
					return writeTransactionsInChunks(acct);
				});
			})
		).then(() => {
			console.log('Successfully migrated accounts');
		});
	},
	err => {
		console.error(err);
		process.exit(1);
	}
);

function writeAccount(acct) {
	const acctRef = firestore.doc(`accounts/${user}!${acct.id}`);
	return acctRef
		.set({
			...acct,
			user
		})
		.then(() => {
			console.log(
				`Successfully wrote account ${acct.id} for user ${user}`
			);
		});
}

function writeTransactionsInChunks(acct, callback) {
	return getJson(`${serverUrl}/accounts/${acct.id}/transactions`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	}).then(txns => {
		const txnChunks = chunk(txns, firestore.batchSize);

		return Promise.all(txnChunks.map(writeTransactions.bind(null, acct)));
	});
}

function writeTransactions(acct, txns) {
	const writeBatch = firestore.batch();

	// create write for each transaction
	txns.forEach(txn => {
		const txnRef = firestore.doc(
			`accounts/${user}!${acct.id}/transactions/${txn.id}`
		);
		writeBatch.set(txnRef, txn);
	});

	return writeBatch.commit().then(() => {
		console.log(`Wrote ${txns.length} transactions for ${acct.id}`);
	});
}
