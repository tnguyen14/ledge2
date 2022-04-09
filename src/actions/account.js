import { getMeta, patchMeta, getTransactions } from '../util/api.js';
import { getYearStart, getYearEnd } from '../selectors/week.js';
import { calculateWeeklyAverages } from '../selectors/transactions.js';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function loadAccountAsync(dispatch) {
    try {
      const account = await getMeta();
      dispatch({
        type: LOAD_ACCOUNT_SUCCESS,
        data: account
      });
    } catch (e) {
      console.error(e);
    }
  };
}

// TODO update merchant counts in account reducer
const UPDATE_MERCHANT_COUNTS_SUCCESS = 'UPDATE_MERCHANT_COUNTS_SUCCESS';

export function updateMerchantCounts(merchants_count) {
  return async function updateMerchantCountsAsync(dispatch) {
    await patchMeta({
      merchants_count
    });
    dispatch({
      type: UPDATE_MERCHANT_COUNTS_SUCCESS,
      data: merchants_count
    });
  };
}

export const UPDATE_ACCOUNT_YEAR_STATS = 'UPDATE_ACCOUNT_YEAR_STATS';
export const UPDATE_ACCOUNT_YEAR_STATS_SUCCESS =
  'UPDATE_ACCOUNT_YEAR_STATS_SUCCESS';
export function recalculateYearStats(year) {
  return async function recalculateYearStatsAsync(dispatch, getState) {
    const { account } = getState();
    dispatch({
      type: UPDATE_ACCOUNT_YEAR_STATS,
      data: {
        year
      }
    });
    const yearTransactions = (
      await getTransactions(getYearStart(year), getYearEnd(year))
    ).map((tx) => {
      if (!tx.type) {
        tx.type = 'regular-expense';
      }
      return tx;
    });
    const stat = calculateWeeklyAverages({ transactions: yearTransactions });
    const stats = account.stats || {};
    if (!stats[year]) {
      stats[year] = {
        weeklyAverage: stat.weeklyAverage
      };
    } else {
      stats[year].weeklyAverage = stat.weeklyAverage;
    }
    await patchMeta({
      stats
    });
    dispatch({
      type: UPDATE_ACCOUNT_YEAR_STATS_SUCCESS,
      data: {
        year,
        stat: stats[year]
      }
    });
  };
}
