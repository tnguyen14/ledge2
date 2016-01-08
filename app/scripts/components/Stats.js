import React from 'react';
import config from 'config';
import { getTotalWeeks } from '../util/weeks';
import { getTotal, getCategoryTotal } from '../util/total';
import { money } from '../util/helpers';

export default function Stats (props) {
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
		<div className="stats">
			<h2>Stats</h2>
			<div className="averages">
				<h3>Weekly Averages</h3>
				<div className="stat">
					{averages.map(function (stat) {
						const id = stat.slug + '-avg';
						return (
							<div key={stat.slug}>
								<label htmlFor={id}>{stat.label}</label>{' '}
								<span id={id}>{money(stat.amount)}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
