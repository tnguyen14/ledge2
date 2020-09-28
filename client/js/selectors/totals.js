import { createSelector } from 'reselect';

const getTransactions = (state) => state.transactions;

const getCategories = (state) => state.categories;

export const getCategoriesTotalsStats = createSelector(
  getTransactions,
  getCategories,
  (transactions, categories) => {
    // calculate total for each category
    const totals = categories
      .map((cat) => {
        return {
          amount: getCategoryTotal(transactions, cat),
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

export const getTotalStat = createSelector(getTransactions, (transactions) => {
  return {
    label: 'Total',
    slug: 'total',
    amount: calculateTotal(transactions)
  };
});

/**
 * get the total amount for transactions
 * @param {Array} transactions
 * @returns {Number} total
 */
function calculateTotal(transactions) {
  if (!Array.isArray(transactions)) {
    return 0;
  }
  return transactions.reduce(function (total, t) {
    return total + t.amount / t.span;
  }, 0);
}

/**
 * get the total amount of transactions that belong to a specific category
 * @param {Array} transactions
 * @param {Object} category
 * @returns {Number} total
 */
function getCategoryTotal(transactions, category) {
  return calculateTotal(
    transactions.filter(function (t) {
      return t.category === category.slug;
    })
  );
}
