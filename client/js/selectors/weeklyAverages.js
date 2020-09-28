import { createSelector } from 'reselect';

const getWeeks = (state) => state.weeks;

const getTimeSpans = (state) => state.account.stats.averages.timespans;

const calculateWeeklyTotal = (week) => {
  return week.transactions
    .filter((txn) => !txn.carriedOver)
    .reduce((subtotal, transaction) => {
      return subtotal + transaction.amount;
    }, 0);
};

const calculateWeeklyAverage = (weeks) => {
  return (
    weeks.reduce((subtotal, week) => {
      return subtotal + calculateWeeklyTotal(week);
    }, 0) / weeks.length
  );
};

export const calculateWeeklyAverages = createSelector(
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
