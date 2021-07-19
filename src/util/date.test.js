import {
  utcToZonedTime,
  zonedTimeToUtc
} from 'https://cdn.skypack.dev/date-fns-tz@1';
import { expect } from 'https://cdn.skypack.dev/chai';
import { setISODay, format } from 'https://cdn.skypack.dev/date-fns@2';

const TIMEZONE = 'America/Chicago';
const localTime8pm = new Date('2021-12-05 20:05');
// localTime8pm is, if local system is
// - America/New_York 2021-12-06T01:05:00.000Z
// - UTC              2021-12-05T20:05:00.000Z

describe('date-fns', () => {
  it('tz', () => {
    /*
     * hard-to-understand behavior for date-fns-tz when passing Date object
     * - "zonedTimeToUtc" is as if to take a local time and translate
     *   to time in UTC that corresponds with that time
     *
     * - "utcToZonedTime" is getting the utc time and translate
     *   to that time locally
     *   */
    const chicago8pm = zonedTimeToUtc(localTime8pm, TIMEZONE);
    expect(chicago8pm.toISOString()).to.equal('2021-12-06T02:05:00.000Z');

    // revert conversion
    expect(utcToZonedTime(chicago8pm, TIMEZONE)).to.deep.equal(localTime8pm);
  });

  it('tz - get ISO day in local timezone', () => {
    const sundayNyAfterMidnightUtc = '2021-05-03T03:04:00.000Z';
    expect(
      zonedTimeToUtc(
        setISODay(
          new Date(
            format(
              utcToZonedTime(sundayNyAfterMidnightUtc, TIMEZONE),
              'yyyy-MM-dd HH:mm'
            )
          ),
          1
        ),
        TIMEZONE
      ).toISOString()
    ).to.equal('2021-04-27T03:04:00.000Z');
  });

  it('format', () => {
    const displayFormat = 'MM/dd/yyyy hh:mm a';
    expect(format(localTime8pm, displayFormat)).to.equal('12/05/2021 08:05 PM');
  });
});
