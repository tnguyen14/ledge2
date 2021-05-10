import { combineReducers } from 'https://cdn.skypack.dev/redux@3';
import form from './form.js';
import account from './account.js';
import user from './user.js';
import app from './app.js';
import transactions from './transactions.js';

const rootReducer = combineReducers({
  app,
  form,
  account,
  user,
  transactions
});

export default rootReducer;
