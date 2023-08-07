import { decorateTransaction } from './transaction.js';
import { expect } from 'https://esm.sh/chai@4.3.4';

describe('decorateTransaction', () => {
  it('parse date and time', () => {
    expect(
      decorateTransaction({
        date: '2021-05-08',
        time: '22:17',
        amount: 104.56,
        syntheticType: 'expense'
      })
    ).to.deep.equal({
      date: new Date('2021-05-08 22:17').toISOString(),
      merchant: undefined,
      amount: 10456,
      category: undefined,
      memo: undefined,
      type: undefined,
      budgetStart: undefined,
      budgetEnd: undefined,
      budgetSpan: undefined,
      creditAccount: 'cash',
      debitAccount: 'expense',
      syntheticType: 'expense'
    });
  });
});
