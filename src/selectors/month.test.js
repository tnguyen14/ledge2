import { getMonthStart, getMonthEnd, getMonthId } from './month.js';
import { expect } from 'https://cdn.skypack.dev/chai';

const date = '2021-09-01T01:00:00.000Z';

describe('selectors/month', () => {
  it('getMonthStart & getMonthEnd', () => {
    const state = {
      date
    };

    expect(getMonthStart(state).toISOString()).to.equal(
      '2021-08-01T04:00:00.000Z'
    );
    expect(getMonthEnd(state).toISOString()).to.equal(
      '2021-09-01T03:59:59.999Z'
    );
  });
  it('getMonthId', () => {
    const state = {
      date
    };

    expect(getMonthId(state)).to.equal('2021-08');
  });
});
