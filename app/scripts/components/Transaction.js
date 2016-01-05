import React from 'react';
import { date, money, getSource, getCategory } from '../util/helpers';

export default function Transaction (props) {
	return (
		<tr className="transaction" data-transaction-id={props.data._id}>
			<td className="day" data-day={date('ddd', props.data.date)}><span className="badge">{date('ddd', props.date)}</span></td>
			<td className="merchant">{props.data.merchant}</td>
			<td className="amount">{money(props.data.amount)}</td>
			<td className="source">{getSource(props.data.source)}</td>
			<td className="description">{props.data.description}</td>
			<td className="category">{getCategory(props.data.category)}</td>
			<td className="action"><i className="edit glyphicon glyphicon-pencil"></i><i className="remove glyphicon glyphicon-remove"></i></td>
		</tr>
	);
}
