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
const getAccounts = (state) => state.accounts;

// shape of cashflow
// {
//   "2021-08": {
//     "debit": {
//       "accounts": {
//         "income": 123456,
//         ...
//       },
//       "total": 123456,
//     },
//     "credit": {
//       "accounts": {
//         "expense": 123456,
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
  getAccounts,
  (transactionsByMonths, monthsIds, accounts) =>
    monthsIds.reduce((allMonths, monthId) => {
      const selectedAccount = 'cash';
      const monthData = {
        debit: {
          accounts: {}
        },
        credit: {
          accounts: {}
        }
      };
      const transactions = (transactionsByMonths[monthId] || []).filter(
        (txn) =>
          txn.debitAccount == selectedAccount ||
          txn.creditAccount == selectedAccount
      );
      accounts
        .filter((acct) => acct.slug != selectedAccount)
        .forEach((account) => {
          const debitSum = sum(
            transactions
              .filter((t) => t.creditAccount == account.slug)
              .map((t) => t.amount)
          );
          if (debitSum) {
            monthData.debit.accounts[account.slug] = debitSum;
          }
          const creditSum = sum(
            transactions
              .filter((t) => t.debitAccount == account.slug)
              .map((t) => t.amount)
          );
          if (creditSum) {
            monthData.credit.accounts[account.slug] = creditSum;
          }
        });
      monthData.debit.total = sum(Object.values(monthData.debit.accounts));
      monthData.credit.total = sum(Object.values(monthData.credit.accounts));
      allMonths[monthId] = monthData;
      return allMonths;
    }, {})
);
