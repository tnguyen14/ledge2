import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import groupBy from 'https://cdn.skypack.dev/lodash.groupby';
import sortBy from 'https://cdn.skypack.dev/lodash.sortby';
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
          amount: sum(
            categoryTransactions.map((t) => {
              if (!t.budgetSpan) {
                throw new Error(`budgetSpan is falsy ${t.budgetSpan}`);
              }
              return t.amount / t.budgetSpan;
            })
          ),
          label: cat.value,
          slug: cat.slug
        };
      })
      .filter((stat) => stat.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }
);

const getMonthsIds = (state) => state.monthsIds;

// shape of cashflow
/*
{
  accounts: {
    debit: ['income', 'schwab'],
    credit: ['expense', 'mark']
  },
  months: {
    "2021-08": {
      "debit": {
        "accounts": {
          "income": 123456,
          ...
        },
        "total": 123456,
      },
      "credit": {
        "accounts": {
          "expense": 123456,
          ...
        },
        "total": 123456,
      },
    },
    ...
  }
}
*/
export const getMonthsCashflow = createSelector(
  getTransactions,
  getMonthsIds,
  (transactionsByMonths, monthsIds) => {
    const cashflow = {
      accounts: {
        debit: new Set(),
        credit: new Set()
      },
      months: {}
    };
    cashflow.months = monthsIds.reduce((allMonths, monthId) => {
      const selectedAccount = 'cash';
      const monthData = {
        debit: {
          accounts: {}
        },
        credit: {
          accounts: {}
        }
      };
      const transactions = transactionsByMonths[monthId] || [];
      const debitTransactions = groupBy(
        sortBy(
          transactions.filter((t) => t.debitAccount == selectedAccount),
          ['creditAccount']
        ),
        'creditAccount'
      );
      const creditTransactions = groupBy(
        sortBy(
          transactions.filter((t) => t.creditAccount == selectedAccount),
          ['debitAccount']
        ),
        'debitAccount'
      );

      Object.entries(debitTransactions).forEach(([account, txns]) => {
        monthData.debit.accounts[account] = sum(txns.map((t) => t.amount));
        cashflow.accounts.debit.add(account);
      });
      Object.entries(creditTransactions).forEach(([account, txns]) => {
        monthData.credit.accounts[account] = sum(txns.map((t) => t.amount));
        cashflow.accounts.credit.add(account);
      });
      monthData.debit.total = sum(Object.values(monthData.debit.accounts));
      monthData.credit.total = sum(Object.values(monthData.credit.accounts));
      allMonths[monthId] = monthData;
      return allMonths;
    }, {});
    return cashflow;
  }
);
