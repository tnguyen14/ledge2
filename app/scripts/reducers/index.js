import { combineReducers } from 'redux';
import { RECEIVE_ACCOUNT, ADD_TRANSACTION } from '../actions';
import {reducer as formReducer} from 'redux-form';

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

const rootReducer = combineReducers({
	account,
	weeks,
	form: formReducer
});

export default rootReducer;
