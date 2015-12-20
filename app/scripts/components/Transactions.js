'use strict';

var React = require('react');
var Week = require('./Week');

function Transactions (props) {
	return (
		<div className="transactions">
			{props.weeks.map(function (week, index) {
				return <Week key={index} data={week}/>;
			})}
		</div>
	);
}

module.exports = Transactions;
