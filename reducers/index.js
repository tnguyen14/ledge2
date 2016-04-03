import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';
import {reducer as formReducer} from 'redux-form';
import moment from 'moment-timezone';
import config from 'config';

const accountInitialState = {
	transactions: []
};

function account (state = accountInitialState, action) {
	switch (action.type) {
	case actionTypes.RECEIVE_ACCOUNT:
		return Object.assign({}, action.payload);
	default:
		return {
			transactions: transactions(state.transactions, action)
		};
	}
}

function transactions (state = accountInitialState.transactions, action) {
	switch (action.type) {
	case actionTypes.ADD_TRANSACTION:
		return [
			...state,
			action.payload
		];
	case actionTypes.UPDATE_TRANSACTION:
		return state.map(function (tx) {
			return tx.id === action.payload.id ? Object.assign({}, tx, action.payload) : tx;
		});
	case actionTypes.DELETE_TRANSACTION:
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
	case actionTypes.EDIT_TRANSACTION:
		const transaction = Object.assign({}, action.payload);
		const date = moment.tz(transaction.date, 'America/New_York');
		transaction.amount = transaction.amount / 100;
		transaction.date = date.format('YYYY-MM-DD');
		transaction.time = date.format('HH:mm');
		return transaction;
	case actionTypes.RESET_FORM:
		return defaultForm;
	default:
		return state || defaultForm;
	}
}

function confirmDelete (state, action) {
	switch (action.type) {
	case actionTypes.CONFIRM_DELETE:
		return {
			active: true,
			id: action.payload
		};
	case actionTypes.CANCEL_DELETE:
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
	case actionTypes.ALERT:
		return {
			active: true,
			...action.payload
		};
	case actionTypes.DISMISS_ALERT:
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
