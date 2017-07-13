import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import weeks from './weeks';

const rootReducer = combineReducers({
	form,
	account,
	weeks
});

export default rootReducer;
