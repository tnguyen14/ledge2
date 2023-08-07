import slugify from 'https://esm.sh/@tridnguyen/slugify@2';
import produce from 'https://esm.sh/immer@9';

/**
 * @param {Object} counts the counts object
 * @param {String} merchant name of merchant
 */
export const addMerchantToCounts = produce((counts, merchant) => {
  const slug = slugify(merchant);
  if (counts[slug]) {
    counts[slug].count++;
    // store the merchant name in an array,
    // in case of variations of the same name
    if (!counts[slug].values.includes(merchant)) {
      counts[slug].values.push(merchant);
    }
  } else {
    counts[slug] = {
      count: 1,
      values: [merchant]
    };
  }
});

/**
 * @param {Object} counts the counts object
 * @param {String} merchant name of merchant to be removed
 * @param {Boolean} merchantCount the count of transaction with the exact merchant
 */
export const removeMerchantFromCounts = produce(
  (counts, merchant, merchantCount) => {
    const slug = slugify(merchant);
    // if the count doesn't exist, bail early
    if (!counts[slug]) {
      return;
    }
    counts[slug].count--;
    if (counts[slug].count === 0) {
      // delete _counts[slug];
      // set it to null because delete (setting it to `undefined`) doesn't
      // work with merge mode
      counts[slug] = null;
      return;
    }

    // remove merchant from values array
    // if it was the last one (no longer exists)
    if (merchantCount === 0) {
      var merchantIndex = counts[slug].values.indexOf(merchant);
      if (merchantIndex > -1) {
        counts[slug].values.splice(merchantIndex, 1);
      }
    }
  }
);
