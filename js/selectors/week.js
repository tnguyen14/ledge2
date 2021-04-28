import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import { TIMEZONE, WEEK_ID_FORMAT } from '../util/constants';

const getOffset = (state) => state.offset || 0;
const getDate = (state) => state.date;

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  moment(date)
    .tz(TIMEZONE)
    .isoWeekday(1 + offset * 7)
    .startOf('day')
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  weekStart.format(WEEK_ID_FORMAT)
);

export const getWeekEnd = createSelector(getWeekStart, (weekStart) =>
  moment(weekStart).isoWeekday(7).endOf('day')
);
