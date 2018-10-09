'use strict';

var level = require('level');

var db = level('./data', { valueEncoding: 'json' });

module.exports = db;
module.exports.getRange = function(options, callback) {
	var items = [];
	db.createReadStream(options)
		.on('data', function(item) {
			items.push(item);
		})
		.on('error', callback)
		.on('close', function() {
			callback(null, items);
		});
};

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: process.env.FIREBASE_PROJECT_ID,
	keyFilename: process.env.SERVICE_ACCOUNT_JSON
});

firestore.settings({
	timestampsInSnapshots: true
});

module.exports.firestore = firestore;

module.exports.accounts = firestore.collection('accounts');

const FIRESTORE_BATCH_SIZE = 500;

module.exports.firestore.batchSize = FIRESTORE_BATCH_SIZE;

// copied from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
// with modifications to:
// 1. use global firestore instance
// 2. fix the use of batchSize (which seems incorrect in the example
module.exports.firestore.deleteCollection = function deleteCollection(
	collectionPath
) {
	var collectionRef = firestore.collection(collectionPath);
	var query = collectionRef.orderBy('__name__');

	return new Promise((resolve, reject) => {
		deleteQueryBatch(query, resolve, reject);
	});
};

function deleteQueryBatch(query, resolve, reject) {
	query
		.limit(FIRESTORE_BATCH_SIZE)
		.get()
		.then(snapshot => {
			// When there are no documents left, we are done
			if (snapshot.size === 0) {
				return 0;
			}

			// Delete documents in a batch
			var batch = firestore.batch();
			snapshot.docs.forEach(doc => {
				batch.delete(doc.ref);
			});

			return batch.commit().then(() => {
				return snapshot.size;
			});
		})
		.then(numDeleted => {
			if (numDeleted === 0) {
				resolve();
				return;
			}

			// Recurse on the next process tick, to avoid
			// exploding the stack.
			process.nextTick(() => {
				deleteQueryBatch(query, resolve, reject);
			});
		})
		.catch(reject);
}
