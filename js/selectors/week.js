import { createSelector } from 'reselect';
import { startOfDay, endOfDay, setISODay, format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { WEEK_ID_FORMAT, TIMEZONE } from '../util/constants';

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
