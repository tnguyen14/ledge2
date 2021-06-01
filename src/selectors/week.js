import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  startOfDay,
  endOfDay,
  setISODay,
  format
} from 'https://cdn.skypack.dev/date-fns@2';
import { zonedTimeToUtc } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { WEEK_ID_FORMAT, TIMEZONE } from '../util/constants.js';

const getOffset = (state) => state.offset || 0;
const getDate = (state) => state.date;

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  startOfDay(
    setISODay(
      date ? new Date(date) : zonedTimeToUtc(new Date(), TIMEZONE),
      1 + offset * 7
    )
  )
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, WEEK_ID_FORMAT)
);

export const getWeekEnd = createSelector(getWeekStart, (weekStart) =>
  endOfDay(setISODay(weekStart, 7))
);

const getDateFromId = (state) =>
  new Date(`${state.weekId} 00:00`).toISOString();
const getNumWeeks = (state) => state.numWeeks;
export const getPastWeeksIds = createSelector(
  getDateFromId,
  getNumWeeks,
  (date, numWeeks) =>
    [...Array(numWeeks).keys()].map((offset) =>
      getWeekId({ date, offset: -offset })
    )
);
