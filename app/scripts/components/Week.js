'use strict';

var React = require('react');
var Transaction = require('./Transaction');
var helpers = require('../util/handlebars');

function Week (props) {
	return (
		<div className="weekly">
			<h3>{helpers.date('MMM D', props.data.start)} - {helpers.date('MMM D', props.data.end)}</h3>
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
					{props.data.transactions.map(function (t) {
						return <Transaction key={t._id} data={t}/>;
					})}
				</tbody>
			</table>
		</div>
	);
}

module.exports = Week;
