import { combineReducers } from 'https://esm.sh/redux@3';
import form from './form.js';
import meta from './meta.js';
import app from '../slices/app.js';
import transactions from '../slices/transactions.js';

const rootReducer = combineReducers({
  app,
  form,
  meta,
  transactions
});

export default rootReducer;
