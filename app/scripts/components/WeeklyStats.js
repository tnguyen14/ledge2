import React, { PropTypes } from 'react';
import Stats from './Stats';
import config from 'config';
import { getTotal, getCategoryTotal } from '../util/total';

export default function WeeklyStats (props) {
	const stats = config.categories.map(function (cat) {
		return {
			amount: getCategoryTotal(props.transactions, cat),
			label: cat.value,
			slug: cat.slug
		};
	}).filter(function (stat) {
		return stat.amount > 0;
	});
	const total = getTotal(props.transactions);

	return (
		<div className="summary">
			<Stats stats={stats} total={total} />
		</div>
	);
}

WeeklyStats.propTypes = {
	transactions: PropTypes.array.isRequired
};
