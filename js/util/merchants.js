import slugify from 'https://cdn.skypack.dev/@tridnguyen/slugify@2';

/**
 * @param {String} merchant name of merchant
 * @param {Object} counts the counts object
 */
export function addMerchantToCounts(merchant, counts) {
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
export function removeMerchantFromCounts(merchant, counts, merchantCount) {
  const slug = slugify(merchant);
  let _counts = { ...counts };
  // if the count doesn't exist, bail early
  if (!_counts[slug]) {
    return _counts;
  }
  _counts[slug].count--;
  if (_counts[slug].count === 0) {
    // delete _counts[slug];
    // set it to null because delete (setting it to `undefined`) doesn't
    // work with merge mode
    _counts[slug] = null;
    return _counts;
  }

  // remove merchant from values array
  // if it was the last one (no longer exists)
  if (merchantCount === 0) {
    var merchantIndex = _counts[slug].values.indexOf(merchant);
    if (merchantIndex > -1) {
      _counts[slug].values.splice(merchantIndex, 1);
    }
  }
  return _counts;
}
