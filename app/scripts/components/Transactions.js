'use strict';

var React = require('react');
var Week = require('./Week');

function Transactions (props) {
	return (
		<div className="transactions">
			{props.weeks.map(Week)}
		</div>
	);
}

module.exports = Transactions;
