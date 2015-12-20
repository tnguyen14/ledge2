'use strict';

var React = require('react');
var helpers = require('../util/handlebars');

function Transaction (props) {
	return (
		<tr className="transaction" data-transaction-id={props._id}>
			<td className="day {helpers.date('ddd', props.date)}"><span className="badge">{helpers.date('ddd', props.date)}</span></td>
			<td className="merchant">{props.merchant}</td>
			<td className="amount">{helpers.money(props.amount)}</td>
			<td className="source">{helpers.getSource(props.source)}</td>
			<td className="description">{props.description}</td>
			<td className="category">{helpers.getCategory(props.category)}</td>
			<td className="action"><i className="edit glyphicon glyphicon-pencil"></i><i className="remove glyphicon glyphicon-remove"></i></td>
		</tr>
	);
}

module.exports = Transaction;
