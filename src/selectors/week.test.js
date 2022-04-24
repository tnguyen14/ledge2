import {
  getDate,
  getWeekStart,
  getWeekEnd,
  getWeekId,
  getPastWeeksIds,
  getWeekStartFromWeekId,
  getMonthStart,
  getMonthEnd,
  getMonthId,
  getPastMonthsIds
} from './week.js';
import { expect } from 'https://cdn.skypack.dev/chai@4.3.4';

describe('selectors/week', () => {
  // Sunday night 11pm NY after midnight UTC
  // May 3rd is a Monday
  const date = '2021-05-03T03:04:00.000Z';

  it('date parsing', () => {
    const state = {
      date
    };

    expect(getDate(state).toISO()).to.equal('2021-05-02T23:04:00.000-04:00');
  });
  it('getWeekStart & getWeekEnd', () => {
    const state = {
      date
    };
    expect(getWeekStart(state).toISO()).to.equal(
      '2021-04-26T00:00:00.000-04:00'
    );
    expect(getWeekEnd(state).toISO()).to.equal('2021-05-02T23:59:59.999-04:00');

    // Date object
    expect(
      getWeekStart({
        date: new Date(date)
      }).toISO()
    ).to.equal('2021-04-26T00:00:00.000-04:00');
  });
  it('getWeekStart with offset', () => {
    expect(
      getWeekStart({
        date,
        offset: 1
      }).toISO()
    ).to.equal('2021-05-03T00:00:00.000-04:00');
    expect(
      getWeekStart({
        date,
        offset: -1
      }).toISO()
    ).to.equal('2021-04-19T00:00:00.000-04:00');
  });
  it('getWeekId', () => {
    const state = {
      date
    };
    expect(getWeekId(state)).to.equal('2021-04-26');
  });
  it('getWeekStartFromWeekId', () => {
    const state = {
      weekId: '2021-06-02'
    };
    expect(getWeekStartFromWeekId(state).toISOString()).to.equal(
      '2021-05-31T04:00:00.000Z'
    );
  });
  it('getPastWeeksIds', () => {
    expect(
      getPastWeeksIds({
        weekId: '2021-05-31',
        numWeeks: 4
      })
    ).to.deep.equal(['2021-05-31', '2021-05-24', '2021-05-17', '2021-05-10']);
  });
});

describe('selectors/month', () => {
  const date = '2021-09-01T01:00:00.000Z';
  it('getMonthStart & getMonthEnd', () => {
    const state = {
      date
    };

    expect(getMonthStart(state).toISO()).to.equal(
      '2021-08-01T00:00:00.000-04:00'
    );
    expect(getMonthEnd(state).toISO()).to.equal(
      '2021-08-31T23:59:59.999-04:00'
    );
  });
  it('getMonthId', () => {
    const state = {
      date
    };

    expect(getMonthId(state)).to.equal('2021-08');
  });

  it('getPastMonthsIds', () => {
    expect(
      getPastMonthsIds({
        date,
        numMonths: 4
      })
    ).to.deep.equal(['2021-08', '2021-07', '2021-06', '2021-05']);
  });
});
