import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import money from '../util/money';

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
		return total + t.amount;
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

function calculateStats(transactions) {
	// calculate total for each category
	const totals = config.categories
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
	return {
		stats: totals
	};
}

function WeeklyStats(props) {
	const { label, weekId, transactions } = props;
	const { stats } = calculateStats(transactions);
	return (
		<div className="stats summary">
			<h4>
				{label}
			</h4>
			<table className="table">
				<tbody>
					{stats.map(stat => {
						const { slug, label, amount } = stat;
						const statId = `${slug}-${weekId}`;
						return (
							<tr key={statId} className="stat" data-cat={slug}>
								<td id={statId}>
									<span className="legend">&nbsp;</span>
									{label}
								</td>
								<td aria-labelledby={statId}>
									{money(amount)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

WeeklyStats.propTypes = {
	label: PropTypes.string,
	weekId: PropTypes.string.isRequired,
	transactions: PropTypes.array.isRequired
};

export default WeeklyStats;
