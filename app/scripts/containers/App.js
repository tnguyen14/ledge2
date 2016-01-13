import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from '../components/Alert';
import NewTransaction from '../components/NewTransaction';
import Stats from '../components/Stats';
import Transactions from '../components/Transactions';
import { editTransaction } from '../actions';

function App (props) {
	const { dispatch } = props;
	return (
		<div className="main">
			<Alert/>
			<NewTransaction/>
			<Stats transactions={props.account.transactions} />
			<Transactions weeks={props.weeks} transactions={props.account.transactions} onEditClick={id => dispatch(editTransaction(id))}/>
		</div>
	);
}

App.propTypes = {
	dispatch: PropTypes.func.isRequired,
	account: PropTypes.object.isRequired,
	weeks: PropTypes.array.isRequired
};

function mapStateToProps (state) {
	return {
		account: state.account,
		weeks: state.weeks
	};
}

export default connect(mapStateToProps)(App);
