const filter = require('lodash.filter');
const slugify = require('underscore.string/slugify');

const db = require('../../db');

/**
 * @description add a merchant to an account
 * @param {String} merchant name of merchant
 * @param {String} account name of account
 */
function addMerchant(merchant, account, callback) {
	db.get('account!' + account, function(err, acc) {
		if (err) {
			return callback(err);
		}
		db.put(
			'account!' + account,
			Object.assign({}, acc, {
				merchants_count: addMerchantToCounts(
					merchant,
					acc.merchants_count
				)
			}),
			function(err) {
				if (err) {
					return callback(err);
				}
				callback(null);
			}
		);
	});
}

/**
 * @description update a merchant, remove the old one if necessary
 * @param {String} newMerchant name of new merchant to be added
 * @param {String} oldMerchant name of old merchant to be removed
 * @param {String} account name of account
 */
function updateMerchant(newMerchant, oldMerchant, account, callback) {
	// if the new merchant is same as old, do nothing
	if (!newMerchant || newMerchant === oldMerchant) {
		return callback();
	}

	removeMerchant(oldMerchant, account, function(err) {
		if (err) {
			return callback(err);
		}
		addMerchant(newMerchant, account, callback);
	});
}

/**
 * @description remove a merchant from an account
 * @param {String} merchant name of merchant
 * @param {String} account name of account
 */
function removeMerchant(merchant, account, callback) {
	db.get('account!' + account, function(err, acc) {
		if (err) {
			return callback(err);
		}
		db.getRange(
			{
				gt: 'transaction!' + account + '!',
				lt: 'transaction!' + account + '!~'
			},
			function(err2, items) {
				if (err2) {
					return callback(err2);
				}
				var merchantCount = filter(items, { merchant: merchant })
					.length;
				db.put(
					'account!' + account,
					Object.assign({}, acc, {
						merchants_count: removeMerchantFromCounts(
							merchant,
							acc.merchants_count,
							merchantCount === 1 || merchantCount === 0
						)
					}),
					function(err) {
						if (err) {
							return callback(err);
						}
						callback(null);
					}
				);
			}
		);
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
 * @param {Boolean} removeValue whether the merchant should be removed from the values array
 */
function removeMerchantFromCounts(merchant, counts, removeValue) {
	var slug = slugify(merchant);
	var _counts = counts;
	// if the count doesn't exist, bail early
	if (!_counts[slug]) {
		return counts;
	}
	_counts[slug].count--;

	// if the count is 0, remove it
	if (_counts[slug].count === 0) {
		delete _counts[slug];
		// remove merchant from values array
	} else if (removeValue) {
		var merchantIndex = _counts[slug].values.indexOf(merchant);
		if (merchantIndex !== -1) {
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
