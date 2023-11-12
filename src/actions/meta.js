import produce from 'https://esm.sh/immer@9';
import { getMeta, patchMeta, getTransactions } from '../util/api.js';
import { getYearStart, getYearEnd } from '../selectors/week.js';
import { calculateWeeklyAverage } from '../selectors/transactions.js';
import {
  loadMetaSuccess,
  updateMerchantCountsSuccess,
  updateYearStats,
  updateYearStatsSuccess,
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure
} from '../slices/meta.js';

export function loadMeta() {
  return async function loadMetaAsync(dispatch) {
    try {
      const meta = await getMeta();
      dispatch(loadMetaSuccess(meta));
    } catch (e) {
      console.error(e);
    }
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

export function recalculateYearStats(year) {
  return async function recalculateYearStatsAsync(dispatch, getState) {
    const { meta } = getState();
    dispatch(updateYearStats(year));
    const yearTransactions = await getTransactions(
      getYearStart(year),
      getYearEnd(year)
    );
    const weeklyAverage = calculateWeeklyAverage({
      transactions: yearTransactions,
      numWeeks: 52
    });
    const stats = produce(meta.stats, (draft) => {
      if (!draft[year]) {
        draft[year] = {
          weeklyAverage
        };
      } else {
        draft[year].weeklyAverage = weeklyAverage;
      }
    });
    await patchMeta({
      stats
    });
    dispatch(
      updateYearStatsSuccess({
        year,
        stat: stats[year]
      })
    );
  };
}

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
    dispatch(updateUserSettings());
    try {
      await patchMeta({
        accounts: newAccounts,
        expenseCategories: newExpenseCategories
      });
      dispatch(
        updateUserSettingsSuccess({
          accounts: newAccounts,
          expenseCategories: newExpenseCategories
        })
      );
    } catch (e) {
      dispatch(updateUserSettingsFailure(e));
    }
  };
}
