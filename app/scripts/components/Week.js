import React from 'react';
import { date } from '../util/helpers';
import Transaction from './Transaction';
import WeeklyStats from './WeeklyStats';

export default function Week (props) {
	return (
		<div className="weekly">
			<h3>{date('MMM D', props.data.start)} - {date('MMM D', props.data.end)}</h3>
			<table className="table table-striped weekly-transactions">
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
					{props.data.transactions.map(function (t) {
						return <Transaction key={t._id} data={t}/>;
					})}
				</tbody>
			</table>
			<WeeklyStats {...props.data.stats}/>
		</div>
	);
}
