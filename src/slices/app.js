import { createSlice, isAnyOf } from 'https://esm.sh/@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';

import {
  loadTransactions,
  removingTransaction,
  removeTransactionSuccess
} from './transactions.js';

import {
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  removeRecurringTransaction
} from './meta.js';

const initialState = {
  appReady: false,
  isLoading: false,
  filter: '',
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  showCashflow: false,
  isUserSettingsOpen: false,
  error: null,
  searchParams: {},
  savingUserSettings: false,
  userSettingsError: null // @TODO this is not being used
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDisplayFrom: (state, action) => {
      state.displayFrom = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setListName: (state, action) => {
      state.listName = action.payload;
    },
    refreshApp: (state) => {
      state.appReady = true;
      state.lastRefreshed = new Date().valueOf();
    },
    showCashflow: (state, action) => {
      state.showCashflow = action.payload;
    },
    setSearchMode: (state, action) => {
      state.isSearch = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    intendToRemoveTransaction: (state, action) => {
      state.transactionRemovalIntended = true;
      state.transactionToBeRemoved = action.payload;
    },
    cancelRemoveTransaction: (state) => {
      state.transactionRemovalIntended = false;
      state.transactionToBeRemoved = undefined;
      state.waitingTransactionRemoval = false;
    },
    setUserSettingsOpen: (state, action) => {
      state.isUserSettingsOpen = action.payload;
    },
    setAppError: (state, action) => {
      state.error = action.payload;
    },
    editTransaction: () => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.loadedTransactions = true),
          (state.notification = {
            title: 'App',
            content: `Finished loading transactions from ${action.payload.start.toLocaleString(
              DateTime.DATETIME_FULL
            )} to ${action.payload.end.toLocaleString(DateTime.DATETIME_FULL)}`,
            autohide: 3000
          });
      })
      .addCase(removingTransaction, (state) => {
        state.waitingTransactionRemoval = true;
      })
      .addCase(updateUserSettings, (state) => {
        state.savingUserSettings = true;
      })
      .addCase(updateUserSettingsSuccess, (state) => {
        state.savingUserSettings = false;
      })
      .addCase(updateUserSettingsFailure, (state, action) => {
        state.savingUserSettings = false;
        state.userSettingsError = action.payload;
      })
      .addMatcher(
        isAnyOf(removeTransactionSuccess, removeRecurringTransaction.fulfilled),
        (state) => {
          state.transactionRemovalIntended = false;
          state.waitingTransactionRemoval = false;
          state.transactionToBeRemoved = undefined;
        }
      );
  }
});

export const {
  setDisplayFrom,
  setToken,
  setListName,
  refreshApp,
  showCashflow,
  setSearchMode,
  setSearchParams,
  intendToRemoveTransaction,
  cancelRemoveTransaction,
  setUserSettingsOpen,
  setAppError,
  editTransaction
} = app.actions;

export default app.reducer;
