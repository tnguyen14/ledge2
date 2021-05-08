import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { format } from 'date-fns';

test('date-fns-tz', () => {
  /*
   * hard-to-understand behavior for date-fns-tz when passing Date object
   * - "zonedTimeToUtc" is as if to take only the time (without regard for
   *   TZ) from the Date object and add the timezone parameter
   * - "utcToZonedTime" is as if to remove the timezone parameter from the
   *   Date object
   */
  const localTime8pm = new Date('2021-12-05 20:05');
  const chicagoTime8pm = zonedTimeToUtc(localTime8pm, 'America/Chicago');
  expect(chicagoTime8pm.toISOString()).toBe('2021-12-06T02:05:00.000Z');
  expect(utcToZonedTime(chicagoTime8pm, 'America/Chicago')).toEqual(
    localTime8pm
  );

  const displayFormat = 'MM/dd/yyyy hh:mm a';
  expect(format(localTime8pm, displayFormat)).toBe('12/05/2021 08:05 PM');
});
