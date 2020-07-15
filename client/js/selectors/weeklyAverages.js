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
  const timeSpans = [
    {
      start: 1,
      end: -3
    },
    {
      start: 0,
      end: -4
    },
    {
      start: -1,
      end: -5
    },
    {
      start: -1,
      end: -13
    },
    {
      start: -1,
      end: -25
    }
  ];
  return timeSpans.map((timespan, index) => {
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
});
