import { combineReducers } from 'redux';
import form from './form';
import account from './account';

const rootReducer = combineReducers({
	form,
	account
});

export default rootReducer;
