import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from '../components/Alert';
import NewTransaction from '../components/NewTransaction';
import Transactions from '../components/Transactions';
import Stats from '../components/Stats';
import { getAccount } from '../actions';

const App = React.createClass({
	propTypes: {
		dispatch: PropTypes.func.isRequired,
		account: PropTypes.object
	},
	componentDidMount: function () {
		const dispatch = this.props.dispatch;
		dispatch(getAccount());
	},
	render: function () {
		return (
			<div className="main">
				<Alert/>
				<NewTransaction/>
				<Stats {...this.props.account.stats}/>
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
export default connect(mapStateToProps)(App);
