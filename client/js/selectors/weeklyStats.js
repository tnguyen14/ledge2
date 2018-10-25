import { createSelector } from 'reselect';

const getTransactions = state => state.transactions;

const getCategories = state => state.options.categories;

export const calculateStats = createSelector(
	getTransactions,
	getCategories,
	(transactions, categories) => {
		// calculate total for each category
		const totals = categories
			.map(cat => {
				return {
					amount: getCategoryTotal(transactions, cat),
					label: cat.value,
					slug: cat.slug
				};
			})
			.filter(stat => {
				return stat.amount > 0;
			})
			.sort((a, b) => {
				return b.amount - a.amount;
			})
			// add the total stat as well
			.concat({
				amount: getTotal(transactions),
				label: 'Total',
				slug: 'total'
			});
		return totals;
	}
);

/**
 * get the total amount for transactions
 * @param {Array} transactions
 * @returns {Number} total
 */
function getTotal(transactions) {
	if (!Array.isArray(transactions)) {
		return 0;
	}
	return transactions.reduce(function(total, t) {
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
	return getTotal(
		transactions.filter(function(t) {
			return t.category === category.slug;
		})
	);
}
