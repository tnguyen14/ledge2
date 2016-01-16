import { combineReducers } from 'redux';
import { RECEIVE_ACCOUNT, ADD_TRANSACTION, EDIT_TRANSACTION, UPDATE_TRANSACTION, RESET_FORM } from '../actions';
import {reducer as formReducer} from 'redux-form';
import moment from 'moment-timezone';
import config from 'config';

const accountInitialState = {
	transactions: []
};

function account (state = accountInitialState, action) {
	switch (action.type) {
		case RECEIVE_ACCOUNT:
			return Object.assign({}, action.payload);
		default:
			return {
				transactions: transactions(state.transactions, action)
			};
	}
}

function transactions (state = accountInitialState.transactions, action) {
	switch (action.type) {
		case ADD_TRANSACTION:
			return [
				action.payload,
				...state
			];
		case UPDATE_TRANSACTION:
			return state.map(function (tx) {
				return tx._id === action.payload._id ? Object.assign({}, tx, action.payload) : tx;
			});
		default:
			return state;
	}
}

function weeks (state, action) {
	switch (action.type) {
		default:
			return [0, -1, -2, -3];
	}
}

function transaction (state, action) {
	const defaultForm = {
		date: moment().format('YYYY-MM-DD'),
		time: moment().format('HH:mm'),
		category: config.categories[0].slug,
		source: config.sources[0].slug,
		status: 'POSTED'
	};
	switch (action.type) {
		case EDIT_TRANSACTION:
			const transaction = Object.assign({}, action.payload);
			const date = moment.tz(transaction.date, 'America/New_York');
			transaction.amount = transaction.amount / 100;
			transaction.date = date.format('YYYY-MM-DD');
			transaction.time = date.format('HH:mm');
			return transaction;
		case RESET_FORM:
			return defaultForm;
		default:
			return state || defaultForm;
	}
}

const rootReducer = combineReducers({
	account,
	weeks,
	transaction,
	form: formReducer
});

export default rootReducer;
