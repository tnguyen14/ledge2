'use strict';

var React = require('react');
var helpers = require('../util/handlebars');

function Transaction (props) {
	return (
		<tr className="transaction" data-transaction-id={props.data._id}>
			<td className="day" data-day={helpers.date('ddd', props.data.date)}><span className="badge">{helpers.date('ddd', props.date)}</span></td>
			<td className="merchant">{props.data.merchant}</td>
			<td className="amount">{helpers.money(props.data.amount)}</td>
			<td className="source">{helpers.getSource(props.data.source)}</td>
			<td className="description">{props.data.description}</td>
			<td className="category">{helpers.getCategory(props.data.category)}</td>
			<td className="action"><i className="edit glyphicon glyphicon-pencil"></i><i className="remove glyphicon glyphicon-remove"></i></td>
		</tr>
	);
}

module.exports = Transaction;
