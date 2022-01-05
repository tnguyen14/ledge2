import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  getYear,
  differenceInCalendarWeeks
} from 'https://cdn.skypack.dev/date-fns@2';
import { sortTransactions } from '../util/transaction.js';
import { sum } from '../util/calculate.js';
import { getWeekStart, getWeekEnd, getWeekId, getMonthId } from './week.js';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { TIMEZONE } from '../util/constants.js';

const getTransactions = (state) => state.transactions;

const getYears = createSelector(getTransactions, (transactions) => {
  const years = {};
  Object.keys(transactions).forEach(function processTransactionForYear(id) {
    const transaction = transactions[id];
    const year = getYear(new Date(transaction.date));
    if (!years[year]) {
      years[year] = [transaction];
    } else {
      years[year] = years[year].concat(transaction);
    }
  });
  return years;
});

export const getYearAverages = createSelector(getYears, (years) => {
  return Object.keys(years)
    .reverse()
    .map((year) => {
      const transactions = sortTransactions(years[year]).filter(
        (tx) => tx.type == 'regular-expense'
      );
      const numWeeks = differenceInCalendarWeeks(
        DateTime.fromISO(transactions[0].date, { zone: TIMEZONE }).toJSDate(),
        DateTime.fromISO(transactions[transactions.length - 1].date, {
          zone: TIMEZONE
        }).toJSDate(),
        { weekStartsOn: 1 }
      );

      return {
        numWeeks,
        transactions,
        year,
        weeklyAverage: sum(transactions.map((t) => t.amount)) / numWeeks
      };
    });
});

function addTransactionToWeek(weeks, transaction, offset) {
  const state = {
    offset,
    date: transaction.date
  };
  const weekId = getWeekId(state);
  const start = getWeekStart(state);
  const end = getWeekEnd(state);
  // console.log(`${state.date} ${state.offset}, ${start.toISOString()} - ${end.toISOString()}`)
  if (!weeks[weekId]) {
    weeks[weekId] = {
      weekId,
      start,
      end,
      transactions: [transaction]
    };
  } else {
    weeks[weekId].transactions = weeks[weekId].transactions.concat(transaction);
  }
  return weeks;
}

const getWeeks = createSelector(getTransactions, (transactions) => {
  const weeks = {};
  Object.keys(transactions).forEach(function processTransactionForWeek(id) {
    const transaction = transactions[id];
    addTransactionToWeek(weeks, transaction);
    // account for multi-week transaction
    for (let i = 1; i < transaction.span; i++) {
      addTransactionToWeek(
        weeks,
        {
          ...transaction,
          carriedOver: true
        },
        i
      );
    }
  });
  return weeks;
});

const getId = (state) => state.weekId;

export const getWeekById = createSelector(
  getWeeks,
  getId,
  (weeks, weekId) =>
    weeks[weekId] || {
      weekId,
      transactions: []
    }
);

export const getMonths = createSelector(getTransactions, (transactions) => {
  const months = {};
  Object.keys(transactions).forEach(function processTransactionForMonth(id) {
    const transaction = transactions[id];
    const monthId = getMonthId({
      date: transaction.date
    });
    if (!months[monthId]) {
      months[monthId] = [transaction];
    } else {
      months[monthId] = months[monthId].concat(transaction);
    }
  });
  return months;
});

const getSearch = (state) => state.search;
export const getSearchResult = createSelector(
  getTransactions,
  getSearch,
  (transactions, search) => {
    return Object.keys(transactions)
      .map((id) => transactions[id])
      .filter((tx) =>
        Object.entries(search)
          .filter(([key, value]) => !!value)
          .every(([key, value]) =>
            String(tx[key]).toLowerCase().includes(String(value).toLowerCase())
          )
      );
  }
);
