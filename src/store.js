import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
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
