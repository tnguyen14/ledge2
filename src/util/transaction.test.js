import { decorateTransaction } from './transaction.js';
import { expect } from 'https://cdn.skypack.dev/chai';

describe('decorateTransaction', () => {
  it('parse date and time', () => {
    expect(
      decorateTransaction({
        date: '2021-05-08',
        time: '22:17',
        amount: 104.56,
        span: '4'
      })
    ).to.deep.equal({
      date: new Date('2021-05-08 22:17').toISOString(),
      merchant: undefined,
      amount: 10456,
      span: 4,
      category: undefined,
      memo: undefined,
      type: undefined
    });
  });
});
