'use strict';

var React = require('react');
var PropTypes = React.PropTypes;
var connect = require('react-redux').connect;
var Alert = require('../components/Alert');
var NewTransaction = require('../components/NewTransaction');
var Transactions = require('../components/Transactions');

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
				<Transactions weeks={this.props.account.weeks}/>
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
