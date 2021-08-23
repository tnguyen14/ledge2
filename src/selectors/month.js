import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  format,
  startOfMonth,
  endOfMonth
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { TIMEZONE, MONTH_FORMAT } from '../util/constants.js';

const getDate = (state) => new Date(state.date);

export const getMonthStart = createSelector(getDate, (date) =>
  utcToZonedTime(startOfMonth(date), TIMEZONE)
);

export const getMonthEnd = createSelector(getDate, (date) =>
  utcToZonedTime(endOfMonth(date), TIMEZONE)
);
