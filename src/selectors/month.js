import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  format,
  startOfMonth,
  endOfMonth,
  add
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import {
  TIMEZONE,
  DATE_FIELD_FORMAT,
  MONTH_FORMAT
} from '../util/constants.js';
import { getDate, getOffset } from './week.js';

export const getMonthStart = createSelector(
  getOffset,
  getDate,
  (offset, date) =>
    add(
      startOfMonth(
        DateTime.fromISO(`${format(date, DATE_FIELD_FORMAT)}T00:00`, {
          zone: TIMEZONE
        }).toJSDate()
      ),
      { months: offset }
    )
);

export const getMonthEnd = createSelector(getOffset, getDate, (offset, date) =>
  add(
    endOfMonth(
      DateTime.fromISO(`${format(date, DATE_FIELD_FORMAT)}T23:59:59.999`, {
        zone: TIMEZONE
      }).toJSDate()
    ),
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
