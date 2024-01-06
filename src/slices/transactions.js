import {
  createSlice,
  createAsyncThunk
} from 'https://esm.sh/@reduxjs/toolkit@2';
import { getTransactions } from '../util/api.js';

export const loadTransactions = createAsyncThunk(
  'transactions/loadTransactions',
  async ({ start, end }) => {
    const transactions = await getTransactions(start, end);
    return {
      start,
      end,
      transactions
    };
  }
);

const transactions = createSlice({
  name: 'transactions',
  initialState: {},
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder.addCase(loadTransactions.fulfilled, (state, action) => {
      if (!action.payload.transactions) {
        return;
      }
      action.payload.transactions.forEach((transaction) => {
        if (!state[transaction.id]) {
          state[transaction.id] = transaction;
        }
      });
    });
  }
});

export const {
  addTransactionSuccess,
  addTransactionFailure,
  updateTransactionSuccess,
  updateTransactionFailure,
  removingTransaction,
  removeTransactionSuccess,
  removeTransactionFailure
} = transactions.actions;
export default transactions.reducer;
