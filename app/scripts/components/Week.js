import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-timezone';
import config from 'config';
import { date } from '../util/helpers';
import { getTotal, getCategoryTotal } from '../util/total';
import Transaction from './Transaction';
import WeeklyStats from './WeeklyStats';

export default function Week (props) {
	const offset = props.offset;
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');

	const weekTransactions = props.transactions.filter(function (t) {
		return t.date >= start.toISOString() && t.date <= end.toISOString();
	});

	const weekTotal = getTotal(weekTransactions);

	let categoryTotals = [];
	config.categories.forEach(function (cat) {
		const catTotal = getCategoryTotal(weekTransactions, cat);
		if (catTotal === 0) {
			return;
		}
		categoryTotals.push({
			amount: catTotal,
			label: cat.value,
			slug: cat.slug
		});
	});

	const stats = {
		weekTotal,
		categoryTotals
	};

	return (
		<div className="weekly">
			<h3>{date('MMM D', start)} - {date('MMM D', end)}</h3>
			<Table striped className="weekly-transactions">
				<thead>
					<tr>
						<th>Day</th>
						<th>Merchant</th>
						<th>Amount</th>
						<th>Source</th>
						<th className="secondary">Desc.</th>
						<th className="secondary">Category</th>
						<th className="secondary"></th>
					</tr>
					<tr className="addition">
						<th className="two-col">Desc.</th>
						<th>Category</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{weekTransactions.map(function (t) {
						return <Transaction key={t._id} data={t} onEditClick={props.onEditClick}/>;
					})}
				</tbody>
			</Table>
			<WeeklyStats {...stats}/>
		</div>
	);
}
