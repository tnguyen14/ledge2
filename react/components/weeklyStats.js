import React from 'react';
import PropTypes from 'prop-types';
import { money } from '../../util/helpers';
import config from 'config';
import { getTotal, getCategoryTotal } from '../../util/total';

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
