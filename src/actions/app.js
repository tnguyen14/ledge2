import { DateTime } from 'https://esm.sh/luxon@3';
import { loadTransactions } from './transactions.js';
import { TIMEZONE } from '../util/constants.js';

import { getWeekStart, getWeekStartFromWeekId } from '../selectors/week.js';

export function loadPastYears(yearsToLoad) {
  return async function loadPastYearsAsync(dispatch) {
    const now = DateTime.now().setZone(TIMEZONE);
    const start = now.minus({
      years: yearsToLoad
    });
    const startMonday = start.startOf('week');
    const endMonday = now.startOf('week').plus({ weeks: 1 });
    await dispatch(loadTransactions(startMonday, endMonday));
  };
}

export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch) {
    dispatch(
      loadTransactions(
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }), offset: 1 })
      )
    );
  };
}
