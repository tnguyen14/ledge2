import { createSelector } from 'reselect';
import { sum, average } from '../util/calculate';

export const calculateWeeklyTotal = (week) => {
  if (!week || !week.transactions) {
    return 0;
  }
  return sum(
    week.transactions.filter((txn) => !txn.carriedOver).map((t) => t.amount)
  );
};

const getTransactions = (state) => state.transactions;

const getCategories = (state) => state.categories;

export const getCategoriesTotalsStats = createSelector(
  getTransactions,
  getCategories,
  (transactions, categories) => {
    // calculate total for each category
    const totals = categories
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
    return totals;
  }
);
