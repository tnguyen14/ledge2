import React, { PropTypes } from 'react';
import Stats from './Stats';
import config from 'config';
import { getTotalWeeks } from '../util/weeks';
import { getTotal, getCategoryTotal } from '../util/total';

export default function AccountStats (props) {
	let averages = [];
	const numWeeks = getTotalWeeks(props.transactions);
	config.categories.forEach(function (cat) {
		const catTotal = getCategoryTotal(props.transactions, cat);
		averages.push({
			amount: catTotal / numWeeks,
			label: cat.value,
			slug: cat.slug
		});
	});

	averages.push({
		amount: getTotal(props.transactions) / numWeeks,
		label: 'Total',
		slug: 'total'
	});

	return (
		<div className="account-stats">
			<Stats stats={averages} label="Weekly Averages"/>
		</div>
	);
}

AccountStats.propTypes = {
	transactions: PropTypes.array.isRequired
};
