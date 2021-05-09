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
  zonedTimeToUtc(
    startOfDay(setISODay(date ? new Date(date) : new Date(), 1 + offset * 7)),
    TIMEZONE
  )
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, WEEK_ID_FORMAT)
);

export const getWeekEnd = createSelector(getWeekStart, (weekStart) =>
  zonedTimeToUtc(endOfDay(setISODay(weekStart, 7)))
);
