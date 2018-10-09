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

const FIRESTORE_BATCH_SIZE = 500;

module.exports.firestore.batchSize = FIRESTORE_BATCH_SIZE;
