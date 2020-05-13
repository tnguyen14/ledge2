import { createSelector } from 'reselect';

const getWeeks = (state) => state.weeks;

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

export const calculateWeeklyAverages = createSelector(getWeeks, (weeks) => {
  const timeSpans = [4, 12, 24];
  return timeSpans.map((numWeeksInSpan, index) => {
    const span = {
      numWeeks: numWeeksInSpan,
      loaded: false,
      weeks: []
    };
    const pastWeeksIndices = Object.keys(weeks).filter((x) => x < 0);

    // loaded weeks of the span so far
    span.weeks = pastWeeksIndices
      .filter((weekIndex) => {
        return (
          Math.abs(weekIndex) <= numWeeksInSpan && weeks[weekIndex].hasLoaded
        );
      })
      .map((weekIndex) => weeks[weekIndex]);

    span.weeklyAverage = calculateWeeklyAverage(span.weeks);

    if (span.weeks.length == numWeeksInSpan) {
      span.loaded = true;
    }
    return span;
  });
});
