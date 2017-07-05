import React from 'react';
import moment from 'moment-timezone';
import { money, getSource, getCategory } from '../../util/helpers';

function Transaction(props) {
	const { date, amount, merchant, category, source, description } = props;
	const displayDate = moment(date).format('ddd');
	return (
		<tr className="transaction" data-day={displayDate}>
			<td className="day">
				{displayDate}
			</td>
			<td className="merchant">
				{merchant}
			</td>
			<td className="amount" data-cat={category}>
				<span className="badge">
					{money(amount)}
				</span>
			</td>
			<td className="source">
				{getSource(source)}
			</td>
			<td className="description">
				{description}
			</td>
			<td className="category">
				{getCategory(category)}
			</td>
			<td className="action">
				<i className="edit glyphicon glyphicon-pencil" />
				<i className="remove glyphicon glyphicon-remove" />
			</td>
		</tr>
	);
}

export default Transaction;
