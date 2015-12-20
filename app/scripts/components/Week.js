'use strict';

var React = require('react');
var Transaction = require('./Transaction');

function Week (props) {
	return (
		<div className="weekly">
			<table className="table table-striped weekly-transactions">
				<thead>
					<tr>
						<th>Day</th>
						<th>Merc hant</th>
						<th>Amount</th>
						<th>Source</th>
						<th className="secondary">Des.</th>
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
					{props.transactions.map(Transaction)}
				</tbody>
			</table>
		</div>
	);
}

module.exports = Week;
