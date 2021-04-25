import { createSelector } from 'reselect';
import moment from 'moment-timezone';

// TODO consolidate this with window.TIMEZONE
const TIMEZONE = 'America/New_York';

const getOffset = (state) => state.offset || 0;
const getDate = (state) => state.date;

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  moment(date)
    .tz(TIMEZONE)
    .isoWeekday(1 + offset * 7)
    .startOf('day')
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  weekStart.format('YYYY-MM-DD')
);

export const getWeekEnd = createSelector(getWeekStart, (weekStart) =>
  moment(weekStart).add(7, 'd').endOf('day')
);
