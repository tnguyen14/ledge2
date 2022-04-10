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
        data: meta
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
      data: merchants_count
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
      data: {
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
      data: {
        year,
        stat: stats[year]
      }
    });
  };
}
