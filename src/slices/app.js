import { createSlice } from 'https://esm.sh/@reduxjs/toolkit';

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
  error: null
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
    }
  }
});

export const { setDisplayFrom, setToken, setListName, refreshApp } =
  app.actions;

export default app.reducer;
