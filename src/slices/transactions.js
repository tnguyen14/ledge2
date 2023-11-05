import { createSlice } from 'https://esm.sh/@reduxjs/toolkit';

const transactions = createSlice({
  name: 'transactions',
  initialState: {},
  reducers: {
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
    removeTransactionSuccess: (state, action) => {
      delete state[action.payload];
    },
    updateTransactionSuccess: (state, action) => {
      state[action.payload.id] = action.payload;
    }
  }
});

export const {
  loadTransactionsSuccess,
  addTransactionSuccess,
  removeTransactionSuccess,
  updateTransactionSuccess
} = transactions.actions;
export default transactions.reducer;
