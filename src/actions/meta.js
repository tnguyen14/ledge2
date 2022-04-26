import { getMeta, patchMeta, getTransactions } from '../util/api.js';
import { getYearStart, getYearEnd } from '../selectors/week.js';
import { calculateWeeklyAverages } from '../selectors/transactions.js';

export const LOAD_META_SUCCESS = 'LOAD_META_SUCCESS';

export function loadMeta() {
  return async function loadMetaAsync(dispatch) {
    try {
      const meta = await getMeta();
      dispatch({
        type: LOAD_META_SUCCESS,
        payload: meta
      });
    } catch (e) {
      console.error(e);
    }
  };
}

// TODO update merchant counts in meta reducer
const UPDATE_MERCHANT_COUNTS_SUCCESS = 'UPDATE_MERCHANT_COUNTS_SUCCESS';

export function updateMerchantCounts(merchants_count) {
  return async function updateMerchantCountsAsync(dispatch) {
    await patchMeta({
      merchants_count
    });
    dispatch({
      type: UPDATE_MERCHANT_COUNTS_SUCCESS,
      payload: merchants_count
    });
  };
}

export const UPDATE_YEAR_STATS = 'UPDATE_YEAR_STATS';
export const UPDATE_YEAR_STATS_SUCCESS = 'UPDATE_YEAR_STATS_SUCCESS';
export function recalculateYearStats(year) {
  return async function recalculateYearStatsAsync(dispatch, getState) {
    const { meta } = getState();
    dispatch({
      type: UPDATE_YEAR_STATS,
      payload: {
        year
      }
    });
    const yearTransactions = await getTransactions(
      getYearStart(year),
      getYearEnd(year)
    );
    const stat = calculateWeeklyAverages({ transactions: yearTransactions });
    const stats = meta.stats || {};
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
      type: UPDATE_YEAR_STATS_SUCCESS,
      payload: {
        year,
        stat: stats[year]
      }
    });
  };
}

export const SAVE_USER_SETTINGS = 'SAVE_USER_SETTINGS';
export const SAVE_USER_SETTINGS_SUCCESS = 'SAVE_USER_SETTINGS_SUCCESS';
export const SAVE_USER_SETTINGS_FAILURE = 'SAVE_USER_SETTINGS_FAILURE';
export function saveUserSettings() {
  return async function saveUserSettingsAsync(dispatch, getState) {
    const {
      meta: { accounts, expenseCategories }
    } = getState();
    const newAccounts = accounts
      .filter((acct) => !acct.toBeRemoved && !acct.builtIn)
      .map((acct) => ({
        slug: acct.slug,
        value: acct.value
      }));
    const newExpenseCategories = expenseCategories
      .filter((cat) => !cat.toBeRemoved)
      .map((cat) => ({
        slug: cat.slug,
        value: cat.value
      }));
    dispatch({
      type: SAVE_USER_SETTINGS
    });
    try {
      await patchMeta({
        accounts: newAccounts,
        expenseCategories: newExpenseCategories
      });
      dispatch({
        type: SAVE_USER_SETTINGS_SUCCESS,
        payload: {
          accounts: newAccounts,
          expenseCategories: newExpenseCategories
        }
      });
    } catch (e) {
      dispatch({
        type: SAVE_USER_SETTINGS_FAILURE,
        payload: e
      });
    }
  };
}
