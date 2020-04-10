require('dotenv').config();
const chunk = require('lodash.chunk');
const moment = require('moment-timezone');

const firestore = require('@tridnguyen/firestore');
const accounts = require('../../controllers/accounts');

const { getJson } = require('simple-fetch');

// migrating all old accounts/ transactions to this user
const user = process.env.AUTH0_USER;
const authToken = process.env.AUTH_TOKEN;
const serverUrl = process.env.SYNC_FROM_SERVER_URL;

getJson(`${serverUrl}/accounts`, {
	headers: {
		Authorization: `Bearer ${authToken}`
	}
})
	.then((accts) => {
		console.log(`Syncing for user ${user}`);
		return Promise.all(
			accts.map((acct) => {
				console.log(`Syncing account ${acct.id}`);
				return new Promise((resolve, reject) => {
					accounts.deleteAccount(
						{
							userId: user,
							name: acct.id
						},
						(err) => {
							if (err) {
								return reject(err);
							}
							console.log(`Deleted old account ${acct.id}`);
							resolve();
						}
					);
				})
					.then(() => {
						return writeAccount(acct);
					})
					.then(() => {
						return writeTransactionsInChunks(acct);
					});
			})
		).then(() => {
			console.log('Successfully migrated accounts');
		});
	})
	.then(null, (err) => {
		console.error(err);
		process.exit(1);
	});

function writeAccount(acct) {
	const acctRef = firestore.doc(`accounts/${user}!${acct.id}`);
	return acctRef
		.set({
			...acct,
			user
		})
		.then(() => {
			console.log(
				`Successfully created account ${acct.id} for user ${user}`
			);
		});
}

function writeTransactionsInChunks(acct, before) {
	let url = `${serverUrl}/accounts/${acct.id}/transactions?limit=1000`;
	if (before) {
		url = `${url}&before=${before}`;
	}
	return getJson(url, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	}).then((txns) => {
		if (!txns.length) {
			return;
		}
		console.log(`Writing ${txns.length} transactions...`);
		const txnChunks = chunk(txns, firestore.batchSize);

		return Promise.all(
			txnChunks.map(writeTransactions.bind(null, acct))
		).then(() => {
			const lastTransaction = txns[txns.length - 1];
			// use id instead of date as it guarantees discreetness
			// id is from .valueOf() in milliseconds, .unix() is in seconds
			const lastTime = moment
				.unix(parseInt(lastTransaction.id, 10) / 1000)
				.toISOString();
			console.log(`Getting transactions before ${lastTime}`);
			return writeTransactionsInChunks(acct, lastTime);
		});
	});
}

function writeTransactions(acct, txns) {
	const writeBatch = firestore.batch();

	// create write for each transaction
	txns.forEach((txn) => {
		const txnRef = firestore.doc(
			`accounts/${user}!${acct.id}/transactions/${txn.id}`
		);
		writeBatch.set(txnRef, txn);
	});

	return writeBatch.commit().then(() => {
		console.log(`Wrote ${txns.length} transactions for ${acct.id}`);
	});
}
