import { combineReducers } from 'redux';
import { RECEIVE_ACCOUNT, ADD_TRANSACTION, EDIT_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION, RESET_FORM, CONFIRM_DELETE, CANCEL_DELETE, ALERT, DISMISS_ALERT } from '../actions';
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
			...state,
			action.payload
		];
	case UPDATE_TRANSACTION:
		return state.map(function (tx) {
			return tx.id === action.payload.id ? Object.assign({}, tx, action.payload) : tx;
		});
	case DELETE_TRANSACTION:
		return state.filter(function (tx) {
			return tx.id !== action.payload;
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

function confirmDelete (state, action) {
	switch (action.type) {
	case CONFIRM_DELETE:
		return {
			active: true,
			id: action.payload
		};
	case CANCEL_DELETE:
		return {
			active: false
		};
	default:
		return {
			active: false
		};
	}
}

function alert (state, action) {
	switch (action.type) {
	case ALERT:
		return {
			active: true,
			...action.payload
		};
	case DISMISS_ALERT:
	default:
		return {};
	}
}

const rootReducer = combineReducers({
	account,
	weeks,
	transaction,
	confirmDelete,
	alert,
	form: formReducer
});

export default rootReducer;
