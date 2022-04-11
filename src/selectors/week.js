import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0';
import { differenceInCalendarWeeks } from 'https://cdn.skypack.dev/date-fns@2';
import { TIMEZONE } from '../util/constants.js';

export const getOffset = (state) => state.offset || 0;
export const getDate = (state) => {
  if (!state.date) {
    throw new Error('date is missing');
  }
  let dateStr = state.date;
  if (state.date instanceof Date) {
    dateStr = state.date.toISOString();
  }
  return DateTime.fromISO(dateStr, { zone: TIMEZONE });
};

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  date.startOf('week').plus({ weeks: offset })
);

export const getDayEnd = createSelector(getDate, (date) => date.endOf('day'));

export const getWeekEnd = createSelector(getOffset, getDate, (offset, date) =>
  date.endOf('week').plus({ weeks: offset })
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  weekStart.toISODate()
);

export const getWeekStartFromWeekId = (state) => {
  if (!state.weekId) {
    return;
  }
  return DateTime.fromISO(`${state.weekId}T00:00`, {
    zone: TIMEZONE
  })
    .startOf('week')
    .toJSDate();
};

const getNumWeeks = (state) => state.numWeeks;

export const getPastWeeksIds = createSelector(
  getWeekStartFromWeekId,
  getNumWeeks,
  (weekStart, numWeeks) => {
    if (!weekStart) {
      return [];
    }
    return [...Array(numWeeks).keys()].map((offset) =>
      getWeekId({ date: weekStart, offset: -offset })
    );
  }
);

export const getMonthStart = createSelector(
  getOffset,
  getDate,
  (offset, date) => date.startOf('month').plus({ months: offset })
);

export const getMonthEnd = createSelector(getOffset, getDate, (offset, date) =>
  date.endOf('month').plus({ months: offset })
);

export const getMonthId = createSelector(getMonthStart, (monthStart) =>
  monthStart.toFormat('yyyy-MM')
);

const getNumMonths = (state) => state.numMonths;

export const getPastMonthsIds = createSelector(
  getDate,
  getNumMonths,
  (date, numMonths) => {
    return [...Array(numMonths).keys()].map((offset) =>
      getMonthId({ date: date.toISO(), offset: -offset })
    );
  }
);

export const getYearStart = (year) => {
  return DateTime.fromISO(`${year}0101T00:00`, {
    zone: TIMEZONE
  });
};

export const getYearEnd = createSelector(getYearStart, (yearStart) =>
  yearStart.endOf('year')
);

const getDateStart = (state) =>
  DateTime.fromISO(state.dateStart, { zone: TIMEZONE }).toJSDate();
const getDateEnd = (state) =>
  DateTime.fromISO(state.dateEnd, { zone: TIMEZONE }).toJSDate();

export const getWeeksDifference = createSelector(
  getDateStart,
  getDateEnd,
  (dateStart, dateEnd) => {
    return differenceInCalendarWeeks(dateStart, dateEnd, { weekStartsOn: 1 });
  }
);
