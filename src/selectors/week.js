import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  startOfDay,
  endOfDay,
  setISODay,
  format
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import getDateInTz from 'https://cdn.skypack.dev/@tridnguyen/date-tz@1';
import {
  WEEK_ID_FORMAT,
  TIMEZONE,
  DATE_FIELD_FORMAT
} from '../util/constants.js';

const getOffset = (state) => state.offset || 0;

// given a date specified in the state param
// return a date object that has the same date/ time in TIMEZONE
// (if ignoring timezone parameter of Date object)
// for eg.
// getDate({date: '2021-12-06T02:05:00.000Z'}) => 2021-12-05T21:05:00.000Z
const getDate = (state) => {
  let date = new Date();
  if (state && state.date) {
    date = new Date(state.date);
  }
  return utcToZonedTime(date, TIMEZONE);
};

function setLocalDay(date, day) {
  return getDateInTz(setISODay(date, day), TIMEZONE);
}

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  setLocalDay(startOfDay(date), 1 + offset * 7)
);

export const getWeekEnd = createSelector(getOffset, getDate, (offset, date) =>
  setLocalDay(endOfDay(date), 7 + offset * 7)
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, WEEK_ID_FORMAT)
);

const getDateFromWeekId = (state) => new Date(`${state.weekId} 00:00`);

export const getWeekStartFromWeekId = createSelector(
  getDateFromWeekId,
  (date) => getDateInTz(date, TIMEZONE)
);

const getNumWeeks = (state) => state.numWeeks;

export const getPastWeeksIds = createSelector(
  getWeekStartFromWeekId,
  getNumWeeks,
  (weekStart, numWeeks) =>
    [...Array(numWeeks).keys()].map((offset) =>
      getWeekId({ date: weekStart, offset: -offset })
    )
);
