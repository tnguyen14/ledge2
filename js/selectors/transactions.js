import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  getYear,
  differenceInCalendarWeeks
} from 'https://cdn.skypack.dev/date-fns@2';
import { sortTransactions } from '../util/transaction.js';
import { sum } from '../util/calculate.js';
import { getWeekStart, getWeekEnd, getWeekId } from './week.js';

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
  return Object.keys(years).map((year) => {
    const transactions = sortTransactions(years[year]);
    const numWeeks = differenceInCalendarWeeks(
      new Date(transactions[0].date),
      new Date(transactions[transactions.length - 1].date)
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
  if (!weeks[weekId]) {
    weeks[weekId] = {
      weekId,
      start: getWeekStart(state),
      end: getWeekEnd(state),
      transactions: [transaction]
    };
  } else {
    // TODO should this be dedup?
    weeks[weekId].transactions = weeks[weekId].transactions.concat(transaction);
  }
  return weeks;
}

export const getWeeks = createSelector(getTransactions, (transactions) => {
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
  (weeks, weekId) => weeks[weekId]
);
