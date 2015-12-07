'use strict';

var React = require('react');
var PropTypes = React.PropTypes;
var connect = require('react-redux').connect;
var Alert = require('./Alert');
var NewTransaction = require('./NewTransaction');

var actions = require('../actions');
var getAccount = actions.getAccount;

var App = React.createClass({
	propTypes: {
		dispatch: PropTypes.func.isRequired
	},
	componentDidMount: function () {
		var dispatch = this.props.dispatch;
		dispatch(getAccount());
	},
	render: function () {
		return (
			<div className="main">
				<Alert/>
				<NewTransaction/>
			</div>
		);
	}
});

function mapStateToProps (state) {
	return {
		account: state.account
	};
}
module.exports = connect(mapStateToProps)(App);
