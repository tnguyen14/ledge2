import { createSelector } from 'reselect';
import { startOfDay, endOfDay, setISODay, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { WEEK_ID_FORMAT, TIMEZONE } from '../util/constants';

const getOffset = (state) => state.offset || 0;
const getDate = (state) => state.date;

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  startOfDay(setISODay(date ? new Date(date) : new Date(), 1 + offset * 7))
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(utcToZonedTime(weekStart, TIMEZONE), WEEK_ID_FORMAT)
);

export const getWeekEnd = createSelector(getWeekStart, (weekStart) =>
  endOfDay(setISODay(weekStart, 7))
);
