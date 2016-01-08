import { combineReducers } from 'redux';
import { RECEIVE_ACCOUNT } from '../actions';

function account (state, action) {
	switch (action.type) {
		case RECEIVE_ACCOUNT:
			return Object.assign({}, action.payload);
		default:
			return {
				transactions: []
			};
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
	weeks
});

export default rootReducer;
