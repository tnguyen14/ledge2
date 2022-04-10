import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  getYear,
  differenceInCalendarWeeks
} from 'https://cdn.skypack.dev/date-fns@2';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0';
import { sum } from '../util/calculate.js';
import { TIMEZONE } from '../util/constants.js';
import { getWeekStart, getWeekEnd, getWeekId, getMonthId } from './week.js';

const getTransactions = (state) => state.transactions;

const getTransactionsByYears = createSelector(
  getTransactions,
  (transactions) => {
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
  }
);

export const getSortedTransactions = createSelector(
  getTransactions,
  (transactions) => {
    if (!transactions) {
      return;
    }
    return transactions.sort((a, b) => {
      // sort by id, which is the transaction timestamp
      return new Date(b.date).valueOf() - new Date(a.date).valueOf();
    });
  }
);

const getDateStart = (state) =>
  DateTime.fromISO(state.dateStart, { zone: TIMEZONE }).toJSDate();
const getDateEnd = (state) =>
  DateTime.fromISO(state.dateEnd, { zone: TIMEZONE }).toJSDate();

const getWeeksDifference = createSelector(
  getDateStart,
  getDateEnd,
  (dateStart, dateEnd) => {
    return differenceInCalendarWeeks(dateStart, dateEnd, { weekStartsOn: 1 });
  }
);

export const calculateWeeklyAverages = createSelector(
  getSortedTransactions,
  (transactions) => {
    const expenses = transactions.filter((tx) => tx.type == 'regular-expense');
    const numWeeks = getWeeksDifference({
      dateStart: expenses[0].date,
      dateEnd: expenses[expenses.length - 1].date
    });
    return {
      numWeeks,
      transactions: expenses,
      weeklyAverage: sum(expenses.map((t) => t.amount)) / numWeeks
    };
  }
);

export const getCurrentYearWeeklyAverage = createSelector(
  getTransactionsByYears,
  (years) => {
    const now = DateTime.fromJSDate(new Date(), { zone: TIMEZONE });
    return {
      ...calculateWeeklyAverages({ transactions: years[now.year] }),
      year: now.year
    };
  }
);

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
  getSortedTransactions,
  getSearch,
  (transactions, search) => {
    return transactions.filter((tx) =>
      Object.entries(search)
        .filter(([key, value]) => !!value)
        .every(([key, value]) =>
          String(tx[key]).toLowerCase().includes(String(value).toLowerCase())
        )
    );
  }
);
