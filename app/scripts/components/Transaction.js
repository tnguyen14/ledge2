import React from 'react';
import { date, money, getSource, getCategory } from '../util/helpers';

export default function Transaction (props) {
	return (
		<tr className="transaction" data-transaction-id={props.data._id} data-day={date('ddd', props.data.date)}>
			<td className="day">{date('ddd', props.data.date)}</td>
			<td className="merchant">{props.data.merchant}</td>
			<td className="amount" data-cat={props.data.category}><span className="badge">{money(props.data.amount)}</span></td>
			<td className="source">{getSource(props.data.source)}</td>
			<td className="description">{props.data.description}</td>
			<td className="category">{getCategory(props.data.category)}</td>
			<td className="action">
				<i className="edit glyphicon glyphicon-pencil" onClick={props.onEditClick.bind(this, props.data._id)}></i>
				<i className="remove glyphicon glyphicon-remove"></i>
			</td>
		</tr>
	);
}
