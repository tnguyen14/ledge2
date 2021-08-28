import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { sum, average } from '../util/calculate.js';

const getTransactions = (state) => state.transactions;

const getCategories = (state) => state.categories;

export const getCategoriesTotalsStats = createSelector(
  getTransactions,
  getCategories,
  (transactions, categories) => {
    // calculate total for each category
    return categories
      .map((cat) => {
        const categoryTransactions = transactions.filter(
          (t) => t.category == cat.slug
        );
        return {
          amount: sum(categoryTransactions.map((t) => t.amount / t.span)),
          label: cat.value,
          slug: cat.slug
        };
      })
      .filter((stat) => {
        return stat.amount > 0;
      })
      .sort((a, b) => {
        return b.amount - a.amount;
      });
  }
);

const getMonthsIds = (state) => state.monthsIds;
const getTypes = (state) => state.types;

// shape of cashflow
// {
//   "2021-08": {
//     "Regular Income": 123456,
//     ...
//     "IN": 123456,
//     "Regular Expense": 123456,
//     ...
//     "OUT": 123456
//   },
//   ...
// }
export const getMonthsCashflow = createSelector(
  getTransactions,
  getMonthsIds,
  getTypes,
  (transactionsByMonths, monthsIds, types) =>
    monthsIds.reduce((allMonths, monthId) => {
      const monthData = {};
      ['in', 'out'].forEach((flow) => {
        types[flow].forEach((type) => {
          monthData[type.value] = sum(
            transactionsByMonths[monthId]
              .filter((t) => t.type == type.slug)
              .map((t) => t.amount)
          );
        });
        monthData[flow.toUpperCase()] = sum(Object.values(monthData));
      });
      monthData.Balance = monthData.IN - monthData.OUT;
      allMonths[monthId] = monthData;
      return allMonths;
    }, {})
);
