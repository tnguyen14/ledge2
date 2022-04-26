import { createReducer } from 'https://cdn.skypack.dev/@reduxjs/toolkit';
import {
  LOAD_TRANSACTIONS_SUCCESS,
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';

export default createReducer({}, (builder) => {
  builder
    .addCase(LOAD_TRANSACTIONS_SUCCESS, (state, action) => {
      if (!action.payload.transactions) {
        return;
      }
      action.payload.transactions.forEach((transaction) => {
        if (!state[transaction.id]) {
          state[transaction.id] = transaction;
        }
      });
    })
    .addCase(ADD_TRANSACTION_SUCCESS, (state, action) => {
      state[action.payload.id] = action.payload;
    })
    .addCase(REMOVE_TRANSACTION_SUCCESS, (state, action) => {
      delete state[action.payload];
    })
    .addCase(UPDATE_TRANSACTION_SUCCESS, (state, action) => {
      state[action.payload.id] = action.payload;
    });
});
