import { getWeekStart, getWeekEnd, getWeekId } from './week.js';
import { expect } from 'https://cdn.skypack.dev/chai';

describe('selectors/week', () => {
  it('weekstart', () => {});
  it('weekstart - Sunday night NY after midnight UTC', () => {
    const state = {
      date: '2021-05-03T03:04:00.000Z'
    };

    expect(getWeekStart(state).toISOString()).to.equal(
      '2021-04-26T04:00:00.000Z'
    );
    expect(getWeekEnd(state).toISOString()).to.equal(
      '2021-05-03T03:59:59.999Z'
    );
    expect(getWeekId(state)).to.equal('2021-04-26');

    // Date object
    expect(
      getWeekStart({
        date: new Date('2021-05-03T03:04:00.000Z')
      }).toISOString()
    ).to.equal('2021-04-26T04:00:00.000Z');
  });
});
