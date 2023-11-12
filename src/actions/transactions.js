import { getTransactions, patchMeta } from '../util/api.js';
import {
  loadingTransactions,
  loadTransactionsSuccess
} from '../slices/transactions.js';
import { updateMerchantCountsSuccess } from '../slices/meta.js';

export function loadTransactions(startDate, endDate) {
  return async function loadTransactionsAsync(dispatch) {
    dispatch(loadingTransactions());
    dispatch(
      loadTransactionsSuccess({
        start: startDate,
        end: endDate,
        transactions: await getTransactions(startDate, endDate)
      })
    );
  };
}

export function updateMerchantCounts(merchants_count) {
  return async function updateMerchantCountsAsync(dispatch) {
    await patchMeta({
      merchants_count
    });
    dispatch(updateMerchantCountsSuccess(merchants_count));
  };
}
