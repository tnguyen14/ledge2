import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  format,
  startOfMonth,
  endOfMonth
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import getDateInTz from 'https://cdn.skypack.dev/@tridnguyen/date-tz@1';
import { TIMEZONE, MONTH_FORMAT } from '../util/constants.js';
import { getDate } from './week.js';

export const getMonthStart = createSelector(getDate, (date) =>
  getDateInTz(startOfMonth(new Date(`${date} 00:00`)), TIMEZONE)
);

export const getMonthEnd = createSelector(getDate, (date) =>
  getDateInTz(endOfMonth(new Date(`${date} 23:59:59.999`)), TIMEZONE)
);

export const getMonthId = createSelector(getMonthStart, (date) =>
  format(date, MONTH_FORMAT)
);

export const getPastMonthsIds = createSelector();
