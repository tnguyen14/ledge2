import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import user from './user';
import app from './app';
import transactions from './transactions';

const rootReducer = combineReducers({
  app,
  form,
  account,
  user,
  transactions
});

export default rootReducer;
