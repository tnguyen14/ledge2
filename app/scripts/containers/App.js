import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Alert from '../components/Alert';
import NewTransaction from '../components/NewTransaction';
import Stats from '../components/Stats';
import Transactions from '../components/Transactions';
import ConfirmDelete from './ConfirmDelete';
import { editTransaction, confirmDelete } from '../actions';

function App (props) {
	return (
		<div className="main">
			<Alert/>
			<NewTransaction/>
			<Stats transactions={props.account.transactions} />
			<Transactions weeks={props.weeks} transactions={props.account.transactions} onEditClick={props.editTransaction} onDeleteClick={props.confirmDelete}/>
			<ConfirmDelete/>
		</div>
	);
}

App.propTypes = {
	account: PropTypes.object.isRequired,
	weeks: PropTypes.array.isRequired
};

function mapStateToProps (state) {
	return {
		account: state.account,
		weeks: state.weeks
	};
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({editTransaction, confirmDelete}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
