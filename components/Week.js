import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-timezone';
import { date } from '../util/helpers';
import Transaction from './Transaction';
import WeeklyStats from './WeeklyStats';

export default function Week (props) {
	const offset = props.offset;
	const start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	const end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');

	const transactions = props.transactions.filter(function (t) {
		return t.date >= start.toISOString() && t.date <= end.toISOString();
	}).reverse();

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
					{transactions.map(function (t) {
						return <Transaction key={t.id} data={t} onEditClick={props.onEditClick} onDeleteClick={props.onDeleteClick}/>;
					})}
				</tbody>
			</Table>
			<WeeklyStats transactions={transactions}/>
		</div>
	);
}

Week.propTypes = {
	offset: PropTypes.number.isRequired,
	onEditClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	transactions: PropTypes.array.isRequired
};
