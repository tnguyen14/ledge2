import React, { PropTypes } from 'react';
import Stats from './Stats';
import config from 'config';
import { getTotalWeeks } from '../util/weeks';
import { getTotal, getCategoryTotal } from '../util/total';

export default function AccountStats (props) {
	const numWeeks = getTotalWeeks(props.transactions);
	const averages = config.categories.map(function (cat) {
		return {
			amount: getCategoryTotal(props.transactions, cat) / numWeeks,
			label: cat.value,
			slug: cat.slug
		};
	});
	const total = getTotal(props.transactions) / numWeeks;

	return (
		<div className="account-stats">
			<Stats stats={averages} label="Weekly Averages" total={total}/>
		</div>
	);
}

AccountStats.propTypes = {
	transactions: PropTypes.array.isRequired
};
