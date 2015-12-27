'use strict';

var React = require('react');
var helpers = require('../util/handlebars');

function Stats (props) {
	return (
		<div className="stats">
			<h2>Stats</h2>
			<div className="averages">
				<h3>Weekly Averages</h3>
				<div className="stat">
					{props.averages.map(function (stat) {
						return (
							<div key={stat.slug}>
								<label htmlFor={stat.slug}>{stat.label}</label>
								<span id={stat.slug}>{helpers.money(stat.amount)}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

module.exports = Stats;
