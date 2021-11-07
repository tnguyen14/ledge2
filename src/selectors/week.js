import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { setISODay, format } from 'https://cdn.skypack.dev/date-fns@2';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { TIMEZONE, DATE_FIELD_FORMAT } from '../util/constants.js';

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

export const getDayStart = createSelector(getDate, (date) =>
  DateTime.fromISO(date.toISODate(), { zone: TIMEZONE }).startOf('day')
);

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  date.startOf('week').plus({ weeks: offset }).toJSDate()
);

export const getDayEnd = createSelector(getDate, (date) =>
  DateTime.fromISO(date.toISODate(), { zone: TIMEZONE }).endOf('day')
);

export const getWeekEnd = createSelector(getOffset, getDate, (offset, date) =>
  date.endOf('week').plus({ weeks: offset }).toJSDate()
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  DateTime.fromJSDate(weekStart, { zone: TIMEZONE }).toISODate()
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
