import { createSelector } from 'reselect';
import { sum, average } from '../util/calculate';

const getWeeks = (state) => state.weeks;

const getTimeSpans = (state) => state.account.stats.averages.timespans;

const calculateWeeklyTotal = (week) => {
  if (!week || !week.transactions) {
    return 0;
  }
  return sum(
    week.transactions.filter((txn) => !txn.carriedOver).map((t) => t.amount)
  );
};

export const calculateWeeklyAverage = (weeks) => {
  return average(weeks.map((week) => calculateWeeklyTotal(week)));
};

export const getWeeklyAverages = createSelector(
  getWeeks,
  getTimeSpans,
  (weeks, timespans) => {
    return timespans.map((timespan, index) => {
      const numWeeksInSpan = timespan.start - timespan.end;
      const span = {
        ...timespan,
        numWeeks: numWeeksInSpan,
        loaded: false,
        weeks: []
      };

      span.weeks = Object.keys(weeks)
        .filter((weekIndex) => {
          return weekIndex <= timespan.start && weekIndex > timespan.end;
        })
        .map((weekIndex) => weeks[weekIndex]);

      span.weeklyAverage = calculateWeeklyAverage(span.weeks);

      if (span.weeks.length == numWeeksInSpan) {
        span.loaded = true;
      }
      return span;
    });
  }
);

const getTransactions = (state) => state.transactions;

const getCategories = (state) => state.categories;

export const getCategoriesTotalsStats = createSelector(
  getTransactions,
  getCategories,
  (transactions, categories) => {
    // calculate total for each category
    const totals = categories
      .map((cat) => {
        const categoryTransactions = transactions.filter(
          (t) => t.category == cat.slug
        );
        return {
          amount: sum(categoryTransactions.map((t) => t.amount / t.span)),
          label: cat.value,
          slug: cat.slug
        };
      })
      .filter((stat) => {
        return stat.amount > 0;
      })
      .sort((a, b) => {
        return b.amount - a.amount;
      });
    return totals;
  }
);
