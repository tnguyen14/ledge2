import { getAccount, patchAccount, getTransactions } from '../util/api.js';
import { getYearStart, getYearEnd } from '../selectors/week.js';
import { calculateWeeklyAverages } from '../selectors/transactions.js';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function loadAccountAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();
    const state = getState();
    try {
      const account = await getAccount(token);
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
  return async function updateMerchantCountsAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();
    await patchAccount(token, {
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
    const {
      app: { token },
      account
    } = getState();
    dispatch({
      type: UPDATE_ACCOUNT_YEAR_STATS,
      data: {
        year
      }
    });
    const yearTransactions = (
      await getTransactions(token, getYearStart(year), getYearEnd(year))
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
    await patchAccount(token, {
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
