'use strict';

var React = require('react');
var Alert = require('./Alert');
var NewTransaction = require('./NewTransaction');

function App () {
	return (
		<div className="main">
			<Alert/>
			<NewTransaction/>
		</div>
	);
}

module.exports = App;
