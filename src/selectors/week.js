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
  return DateTime.fromISO(dateStr).setZone(TIMEZONE);
};

export const getDayStart = createSelector(getDate, (date) =>
  DateTime.fromISO(date.toISODate(), { zone: TIMEZONE }).startOf('day')
);

export const getWeekStart = createSelector(
  getOffset,
  getDayStart,
  (offset, dayStart) => setISODay(dayStart.toJSDate(), 1 + offset * 7)
);

export const getDayEnd = createSelector(getDate, (date) =>
  DateTime.fromISO(date.toISODate(), { zone: TIMEZONE }).endOf('day')
);

export const getWeekEnd = createSelector(
  getOffset,
  getDayEnd,
  (offset, dayEnd) => setISODay(dayEnd.toJSDate(), 7 + offset * 7)
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, DATE_FIELD_FORMAT)
);

export const getWeekStartFromWeekId = (state) => {
  if (!state.weekId) {
    return;
  }
  return DateTime.fromISO(`${state.weekId}T00:00`, {
    zone: TIMEZONE
  }).toJSDate();
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
