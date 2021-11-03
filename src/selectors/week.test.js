import {
  getDate,
  getDayStart,
  getDayEnd,
  getWeekStart,
  getWeekEnd,
  getWeekId,
  getPastWeeksIds,
  getWeekStartFromWeekId
} from './week.js';
import { expect } from 'https://cdn.skypack.dev/chai';

// Sunday night 11pm NY after midnight UTC
// May 3rd is a Monday
const date = '2021-05-03T03:04:00.000Z';

describe('selectors/week', () => {
  it('date parsing', () => {
    const state = {
      date
    };

    expect(getDate(state).toISO()).to.equal('2021-05-02T23:04:00.000-04:00');
    expect(getDayStart(state).toISO()).to.equal(
      '2021-05-02T00:00:00.000-04:00'
    );
    expect(getDayEnd(state).toISO()).to.equal('2021-05-02T23:59:59.999-04:00');
  });
  it('getWeekStart & getWeekEnd', () => {
    const state = {
      date
    };
    expect(getWeekStart(state).toISOString()).to.equal(
      '2021-04-26T04:00:00.000Z'
    );
    expect(getWeekEnd(state).toISOString()).to.equal(
      '2021-05-03T03:59:59.999Z'
    );

    // Date object
    expect(
      getWeekStart({
        date: new Date(date)
      }).toISOString()
    ).to.equal('2021-04-26T04:00:00.000Z');
  });
  it('getWeekId', () => {
    const state = {
      date
    };
    expect(getWeekId(state)).to.equal('2021-04-26');
  });
  it('getWeekStartFromWeekId', () => {
    const state = {
      weekId: '2021-05-31'
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
