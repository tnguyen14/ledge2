import { configureStore } from 'https://esm.sh/@reduxjs/toolkit';
import { combineReducers } from 'https://esm.sh/redux@3';
import form from './slices/form.js';
import meta from './slices/meta.js';
import app from './slices/app.js';
import transactions from './slices/transactions.js';

const store = configureStore({
  reducer: combineReducers({
    app,
    form,
    meta,
    transactions
  })
});

export default store;
