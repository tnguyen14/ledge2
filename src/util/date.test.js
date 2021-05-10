import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { format } from 'date-fns';

const localTime8pm = new Date('2021-12-05 20:05');
// localTime8pm is, if local system is
// - America/New_York 2021-12-06T01:05:00.000Z
// - UTC              2021-12-05T20:05:00.000Z

test('date-fns-tz', () => {
  /*
   * hard-to-understand behavior for date-fns-tz when passing Date object
   * - "zonedTimeToUtc" is as if to take only the time (pretend it's not UTC)
   *   from the Date object and add the timezone parameter
   * - "utcToZonedTime" is as if to remove the timezone parameter from the
   *   Date object (UTC time)
   */
  const utcTimeForChicago8pm = zonedTimeToUtc(localTime8pm, 'America/Chicago');
  expect(utcTimeForChicago8pm.toISOString()).toBe('2021-12-06T02:05:00.000Z');

  expect(utcToZonedTime(utcTimeForChicago8pm, 'America/Chicago')).toEqual(
    localTime8pm
  );
});

test('date-fns format', () => {
  const displayFormat = 'MM/dd/yyyy hh:mm a';
  expect(format(localTime8pm, displayFormat)).toBe('12/05/2021 08:05 PM');
});
