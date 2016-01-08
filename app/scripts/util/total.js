/**
 * get the total amount for transactions
 * @param {Array} transactions
 * @returns {Number} total
 */
export function getTotal (transactions) {
	if (!Array.isArray(transactions)) {
		return 0;
	}
	return transactions.reduce(function (total, t) {
		return total + t.amount;
	}, 0);
}

/**
 * get the total amount of transactions that belong to a specific category
 * @param {Array} transactions
 * @param {Object} category
 * @returns {Number} total
 */
export function getCategoryTotal (transactions, category) {
	return getTotal(transactions.filter(function (t) {
		return t.category === category.slug;
	}));
}
