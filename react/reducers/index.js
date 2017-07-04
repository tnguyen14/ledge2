import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import transactions from './transactions';

const rootReducer = combineReducers({
	form,
	account,
	transactions
});

export default rootReducer;
