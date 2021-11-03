import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  format,
  startOfMonth,
  endOfMonth,
  add
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { TIMEZONE, MONTH_FORMAT } from '../util/constants.js';
import { getDayStart, getDayEnd, getDate, getOffset } from './week.js';

export const getMonthStart = createSelector(
  getOffset,
  getDayStart,
  (offset, dayStart) =>
    add(
      DateTime.fromJSDate(dayStart)
        .setZone(TIMEZONE)
        .startOf('month')
        .toJSDate(),
      { months: offset }
    )
);

export const getMonthEnd = createSelector(
  getOffset,
  getDayEnd,
  (offset, dayEnd) =>
    add(
      DateTime.fromJSDate(dayEnd).setZone(TIMEZONE).endOf('month').toJSDate(),
      { months: offset }
    )
);

export const getMonthId = createSelector(getMonthStart, (date) =>
  format(date, MONTH_FORMAT)
);

const getNumMonths = (state) => state.numMonths;

export const getPastMonthsIds = createSelector(
  getDate,
  getNumMonths,
  (date, numMonths) => {
    return [...Array(numMonths).keys()].map((offset) =>
      getMonthId({ date, offset: -offset })
    );
  }
);
