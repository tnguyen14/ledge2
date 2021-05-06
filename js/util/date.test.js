import { utcToZonedTime, format as formatZ } from 'date-fns-tz';
import { format } from 'date-fns';

test('date-fns-tz format', () => {
  const time = new Date('2021-12-05 20:05');
  const chicagoTime = utcToZonedTime(time, 'America/Chicago');
  const displayFormat = 'MM/dd/yyyy hh:mma';
  const timeDisplay = format(time, displayFormat);
  const chicagoTimeDisplay = format(chicagoTime, displayFormat);

  //formatZ doesn't seem to be different from format
  expect(formatZ(chicagoTime, displayFormat)).toBe(chicagoTimeDisplay);
  // apparently timeZone option doesn't matter
  expect(
    formatZ(chicagoTime, displayFormat, { timeZone: 'America/Chicago' })
  ).toBe(chicagoTimeDisplay);
  expect(
    formatZ(chicagoTime, displayFormat, { timeZone: 'America/New_York' })
  ).toBe(chicagoTimeDisplay);
  expect(
    formatZ(time, 'MM/dd/yyyy hh:mma', { timeZone: 'America/Chicago' })
  ).toBe(timeDisplay);
});
