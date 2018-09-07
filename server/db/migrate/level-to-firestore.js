require('dotenv').config();
const Firestore = require('@google-cloud/firestore');
const async = require('async');
const chunk = require('lodash.chunk');

const accounts = require('../../controllers/accounts');
const transactions = require('../../controllers/transactions');
//
// migrating all old accounts/ transactions to this user
const user = process.env.AUTH0_USER;

const firestore = new Firestore({
	projectId: process.env.FIREBASE_PROJECT_ID,
	keyFilename: process.env.SERVICE_ACCOUNT_JSON
});

firestore.settings({
	timestampsInSnapshots: true
});

// firestore batch call limit
const maxEntitiesPerBatch = 500;

async.waterfall(
	[
		accounts.showAll.bind(null, {}),
		(accts, callback) => {
			async.parallel(
				accts.map(acct => {
					return acctCallback => {
						async.series(
							[
								writeAccount.bind(null, acct),
								writeTransactionsInChunks.bind(null, acct)
							],
							acctCallback
						);
					};
				}),
				callback
			);
		}
	],
	err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log('Successfully migrated accounts');
	}
);

function writeAccount(acct, callback) {
	const acctRef = firestore.doc(`accounts/${user}!${acct.id}`);
	acctRef.set(acct).then(() => {
		console.log(`Successfully wrote account ${acct.id} for user ${user}`);
		callback(null);
	}, callback);
}

function writeTransactionsInChunks(acct, callback) {
	async.waterfall(
		[
			transactions.showAll.bind(null, {
				name: acct.id
			}),
			(txns, txnsCallback) => {
				const txnChunks = chunk(txns, maxEntitiesPerBatch);

				async.parallel(
					txnChunks.map(txnChunk => {
						return writeTransactions.bind(null, acct, txnChunk);
					}),
					txnsCallback
				);
			}
		],
		callback
	);
}

function writeTransactions(acct, txns, callback) {
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
		callback(null);
	}, callback);
}
