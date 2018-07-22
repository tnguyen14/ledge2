import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import weeks from './weeks';
import user from './user';

const rootReducer = combineReducers({
	form,
	account,
	weeks,
	user
});

export default rootReducer;
