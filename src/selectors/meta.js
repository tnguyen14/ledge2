import { createSelector } from 'https://esm.sh/reselect@4';
import { DateTime } from 'https://esm.sh/luxon@3';
import { TIMEZONE } from '../util/constants.js';

const getRecurring = (state) => state.recurring;

export const getRecurringTransactions = createSelector(
  getRecurring,
  (recurring) => {
    const expired = [];
    const active = [];
    const now = DateTime.fromJSDate(new Date(), { zone: TIMEZONE });
    recurring.forEach((transaction) => {
      if (!transaction.recurrenceEndDate) {
        active.push(transaction);
        return;
      }
      // should we take into account end of week, instead?
      if (
        DateTime.fromJSDate(
          new Date(`${transaction.recurrenceEndDate} 00:00`),
          { zone: TIMEZONE }
        ).endOf('day') > now
      ) {
        active.push(transaction);
        return;
      }
      expired.push(transaction);
    });
    return {
      expired,
      active
    };
  }
);
