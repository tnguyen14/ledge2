import { getWeekStart, getWeekEnd, getWeekId } from './week';

test('weekStart - Sunday night NY after midnight UTC', () => {
  const state = {
    date: '2021-05-03T03:04:00.000Z'
  };

  expect(getWeekStart(state).toISOString()).toBe('2021-04-26T04:00:00.000Z');
  expect(getWeekEnd(state).toISOString()).toBe('2021-05-03T03:59:59.999Z');
  expect(getWeekId(state)).toBe('2021-04-26');

  // Date object
  expect(
    getWeekStart({
      date: new Date('2021-05-03T03:04:00.000Z')
    }).toISOString()
  ).toBe('2021-04-26T04:00:00.000Z');
});
