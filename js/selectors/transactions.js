import { createSelector } from 'reselect';
import { sortTransactions } from '../util/transaction';
import { sum } from '../util/calculate';
import moment from 'moment-timezone';

const getTransactions = (state) => state.transactions;

const getYears = createSelector(getTransactions, (transactions) => {
  const years = {};
  Object.keys(transactions).forEach((id) => {
    const transaction = transactions[id];
    const year = moment(new Date(transaction.date)).tz(TIMEZONE).year();
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
    const numWeeks = moment(new Date(transactions[0].date)).diff(
      moment(new Date(transactions[transactions.length - 1].date)),
      'weeks'
    );

    return {
      numWeeks,
      transactions,
      year,
      weeklyAverage: sum(transactions.map((t) => t.amount)) / numWeeks
    };
  });
});
