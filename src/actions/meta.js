import { patchMeta } from '../util/api.js';
import { updateMerchantCountsSuccess } from '../slices/meta.js';

export function updateMerchantCounts(merchants_count) {
  return async function updateMerchantCountsAsync(dispatch) {
    await patchMeta({
      merchants_count
    });
    dispatch(updateMerchantCountsSuccess(merchants_count));
  };
}
