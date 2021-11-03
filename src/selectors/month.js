import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { format, add } from 'https://cdn.skypack.dev/date-fns@2';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { MONTH_FORMAT } from '../util/constants.js';
import { getDayStart, getDayEnd, getDate, getOffset } from './week.js';

export const getMonthStart = createSelector(
  getOffset,
  getDayStart,
  (offset, dayStart) =>
    add(dayStart.startOf('month').toJSDate(), { months: offset })
);

export const getMonthEnd = createSelector(
  getOffset,
  getDayEnd,
  (offset, dayEnd) => add(dayEnd.endOf('month').toJSDate(), { months: offset })
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
