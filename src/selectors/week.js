import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { setISODay, format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { TIMEZONE, DATE_FIELD_FORMAT } from '../util/constants.js';

export const getOffset = (state) => state.offset || 0;
export const getDate = (state) => {
  let date = new Date();
  if (state && state.date) {
    date = new Date(state.date);
  }
  return format(utcToZonedTime(date, TIMEZONE), DATE_FIELD_FORMAT);
};

// TODO instead of getDate, define a format of date explicitly
export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  setISODay(
    DateTime.fromISO(`${date}T00:00`, { zone: TIMEZONE }).toJSDate(),
    1 + offset * 7
  )
);

export const getWeekEnd = createSelector(getOffset, getDate, (offset, date) =>
  setISODay(
    DateTime.fromISO(`${date}T23:59:59.999`, { zone: TIMEZONE }).toJSDate(),
    7 + offset * 7
  )
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
