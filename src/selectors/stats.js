import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { sum } from '../util/calculate.js';

const getTransactions = (state) => state.transactions;

const getCategories = (state) => state.categories;

export const getCategoriesTotals = createSelector(
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
          amount: sum(categoryTransactions.map((t) => t.amount / t.budgetSpan)),
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
//     "in": {
//       "types": {
//         "Regular Income": 123456,
//         ...
//       },
//       "total": 123456,
//     },
//     "out": {
//       "types": {
//         "Regular Expense": 123456,
//         ...
//       },
//       "total": 123456,
//     },
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
      const transactions = transactionsByMonths[monthId] || [];
      ['in', 'out'].forEach((flow) => {
        if (!monthData[flow]) {
          monthData[flow] = {
            types: {}
          };
        }
        types[flow].forEach((type) => {
          monthData[flow].types[type.slug] = sum(
            transactions.filter((t) => t.type == type.slug).map((t) => t.amount)
          );
        });
        monthData[flow].total = sum(Object.values(monthData[flow].types));
      });
      allMonths[monthId] = monthData;
      return allMonths;
    }, {})
);
