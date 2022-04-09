import { combineReducers } from 'https://cdn.skypack.dev/redux@3';
import form from './form.js';
import meta from './meta.js';
import app from './app.js';
import transactions from './transactions.js';

const rootReducer = combineReducers({
  app,
  form,
  meta,
  transactions
});

export default rootReducer;
