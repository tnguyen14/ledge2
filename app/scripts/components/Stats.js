import React from 'react';
import config from 'config';
import statsUtil from '../util/stats';
import { money } from '../util/helpers';

export default function Stats (props) {
	let averages = [];
	const numWeeks = statsUtil.totalWeeks(props.transactions);
	config.categories.forEach(function (cat) {
		const catTransactions = props.transactions.filter(function (t) {
			return t.category === cat.slug;
		});
		const catTotal = catTransactions.reduce(function (total, t) {
			return total + t.amount;
		}, 0);
		averages.push({
			amount: catTotal / numWeeks,
			label: cat.value,
			slug: cat.slug
		});
	});

	const allTotal = props.transactions.reduce(function (total, t) {
		return total + t.amount;
	}, 0);
	averages.push({
		amount: allTotal / numWeeks,
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
