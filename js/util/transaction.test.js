import { decorateTransaction } from './transaction';

test('decorateTransaction - parse date and time', () => {
  expect(
    decorateTransaction({
      date: '2021-05-08',
      time: '22:17',
      amount: 104.56,
      span: '4'
    })
  ).toEqual({
    date: new Date('2021-05-08 22:17').toISOString(),
    amount: 10456,
    span: 4,
    category: undefined,
    description: undefined,
    source: undefined,
    status: undefined
  });
});
