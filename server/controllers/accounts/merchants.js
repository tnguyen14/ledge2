const cloneDeep = require('lodash.clonedeep');
const slugify = require('underscore.string/slugify');

const { accounts } = require('../../db');
const { noAccount } = require('./');

/**
 * @description add a merchant to an account
 * @param {String} merchant name of merchant
 * @param {String} userId
 * @param {String} accountName name of account
 */
function addMerchant(merchant, userId, accountName) {
	const acctRef = accounts.doc(`${userId}!${accountName}`);
	return acctRef.get().then(acctSnapshot => {
		if (!acctSnapshot.exists) {
			throw noAccount;
		}
		const acc = acctSnapshot.data();
		return acctRef.set(
			{
				merchants_count: addMerchantToCounts(
					merchant,
					acc.merchants_count
				)
			},
			{ merge: true }
		);
	});
}

/**
 * @description update a merchant, remove the old one if necessary
 * @param {String} newMerchant name of new merchant to be added
 * @param {String} oldMerchant name of old merchant to be removed
 * @param {String} userId
 * @param {String} accountName name of account
 */
function updateMerchant(newMerchant, oldMerchant, userId, accountName) {
	// if the new merchant is same as old, do nothing
	if (!newMerchant || newMerchant === oldMerchant) {
		return Promise.resolve();
	}

	return removeMerchant(oldMerchant, userId, accountName).then(() => {
		return addMerchant(newMerchant, userId, accountName);
	});
}

/**
 * @description remove a merchant from an account
 * @param {String} merchant name of merchant
 * @param {String} userId
 * @param {String} account name of account
 */
function removeMerchant(merchant, userId, accountName) {
	const acctRef = accounts.doc(`${userId}!${accountName}`);
	return acctRef.get().then(acctSnapshot => {
		if (!acctSnapshot.exists) {
			throw noAccount;
		}
		const acc = acctSnapshot.data();
		return acctRef
			.collection('transactions')
			.where('merchant', '==', merchant)
			.get()
			.then(transactionsSnapshot => {
				return transactionsSnapshot.size;
			})
			.then(merchantCount => {
				return acctRef.set(
					{
						merchants_count: removeMerchantFromCounts(
							merchant,
							acc.merchants_count,
							merchantCount
						)
					},
					{ merge: true }
				);
			});
	});
}

/**
 * @param {String} merchant name of merchant
 * @param {Object} counts the counts object
 */
function addMerchantToCounts(merchant, counts) {
	var slug = slugify(merchant);
	var _counts = counts || {};
	if (_counts[slug]) {
		_counts[slug].count++;
		// store the merchant name in an array, in case of variations of the same name
		if (_counts[slug].values.indexOf(merchant) === -1) {
			_counts[slug].values.push(merchant);
		}
	} else {
		_counts[slug] = {
			count: 1,
			values: [merchant]
		};
	}
	return _counts;
}

/**
 * @param {String} merchant name of merchant to be removed
 * @param {Object} counts the counts object
 * @param {Boolean} merchantCount the count of transaction with the exact merchant
 */
function removeMerchantFromCounts(merchant, counts, merchantCount) {
	const slug = slugify(merchant);
	let _counts = cloneDeep(counts);
	// if the count doesn't exist, bail early
	if (!_counts[slug]) {
		return _counts;
	}
	if (merchantCount > 0) {
		_counts[slug].count--;
	}
	if (_counts[slug].count === 0) {
		// delete _counts[slug];
		// set it to null because delete (setting it to `undefined`) doesn't
		// work with merge mode
		_counts[slug] = null;
		return _counts;
	}

	// remove merchant from values array
	// if it is the last one, or it no longer exists
	if (merchantCount === 0 || merchantCount === 1) {
		var merchantIndex = _counts[slug].values.indexOf(merchant);
		if (merchantIndex > -1) {
			_counts[slug].values.splice(merchantIndex, 1);
		}
	}
	return _counts;
}

module.exports = {
	add: addMerchant,
	update: updateMerchant,
	remove: removeMerchant
};
