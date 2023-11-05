import { createSlice } from 'https://esm.sh/@reduxjs/toolkit';

const transactions = createSlice({
  name: 'transactions',
  initialState: {},
  reducers: {
    loadingTransactions: () => {},
    loadTransactionsSuccess: (state, action) => {
      if (!action.payload.transactions) {
        return;
      }
      action.payload.transactions.forEach((transaction) => {
        if (!state[transaction.id]) {
          state[transaction.id] = transaction;
        }
      });
    },
    addTransactionSuccess: (state, action) => {
      state[action.payload.id] = action.payload;
    },
    addTransactionFailure: () => {},
    updateTransactionSuccess: (state, action) => {
      state[action.payload.id] = action.payload;
    },
    updateTransactionFailure: () => {},
    removingTransaction: () => {},
    removeTransactionSuccess: (state, action) => {
      delete state[action.payload];
    },
    removeTransactionFailure: () => {}
  }
});

export const {
  loadingTransactions,
  loadTransactionsSuccess,
  addTransactionSuccess,
  addTransactionFailure,
  updateTransactionSuccess,
  updateTransactionFailure,
  removingTransaction,
  removeTransactionSuccess,
  removeTransactionFailure
} = transactions.actions;
export default transactions.reducer;
