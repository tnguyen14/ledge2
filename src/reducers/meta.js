import { createReducer } from 'https://cdn.skypack.dev/@reduxjs/toolkit';
import slugify from 'https://cdn.skypack.dev/@tridnguyen/slugify@2';
import {
  LOAD_META_SUCCESS,
  UPDATE_YEAR_STATS,
  UPDATE_YEAR_STATS_SUCCESS,
  SAVE_USER_SETTINGS_SUCCESS
} from '../actions/meta.js';
import {
  ADD_ACCOUNT,
  REMOVE_ACCOUNT,
  CANCEL_REMOVE_ACCOUNT,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  CANCEL_REMOVE_CATEGORY
} from '../actions/app.js';

const builtinAccounts = [
  {
    slug: 'cash',
    value: 'Cash'
  },
  {
    slug: 'expense',
    value: 'Expense'
  },
  {
    slug: 'income',
    value: 'Income'
  }
];

const initialState = {
  merchants: [],
  expenseCategories: [],
  merchants_count: {},
  accounts: builtinAccounts,
  stats: {}
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(LOAD_META_SUCCESS, (state, action) => {
      const merchants = Object.keys(action.payload.merchants_count)
        .filter((merchant) => {
          return action.payload.merchants_count[merchant] != null;
        })
        .map((merchant) => {
          return {
            // pass along slug
            slug: merchant,
            ...action.payload.merchants_count[merchant]
          };
        })
        .sort((a, b) => {
          // sort by count
          return b.count - a.count;
        });
      // create an array of all merchant names
      state.merchants = merchants.reduce((merchants, merchant) => {
        return merchants.concat(merchant.values);
      }, []);
      state.expenseCategories = action.payload.expenseCategories;
      state.merchants_count = action.payload.merchants_count;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
      state.stats = action.payload.stats;
    })
    .addCase(SAVE_USER_SETTINGS_SUCCESS, (state, action) => {
      state.expenseCategories = action.payload.expenseCategories;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
    })
    .addCase(UPDATE_YEAR_STATS, (state, action) => {
      state.stats[action.payload.year].updating = true;
    })
    .addCase(UPDATE_YEAR_STATS_SUCCESS, (state, action) => {
      state.stats[action.payload.year] = action.payload.stat;
    })
    .addCase(ADD_ACCOUNT, (state, action) => {
      state.accounts.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    })
    .addCase(REMOVE_ACCOUNT, (state, action) => {
      state.accounts = state.accounts
        .filter((acct) => {
          if (acct.value === action.payload && acct.toBeAdded) {
            return false;
          }
          return true;
        })
        .map((acct) => {
          if (acct.value === action.payload) {
            return {
              ...acct,
              toBeRemoved: true
            };
          }
          return acct;
        });
    })
    .addCase(CANCEL_REMOVE_ACCOUNT, (state, action) => {
      state.accounts = state.accounts.map((acct) => {
        if (acct.value === action.payload) {
          return {
            ...acct,
            toBeRemoved: false
          };
        }
        return acct;
      });
    })
    .addCase(ADD_CATEGORY, (state, action) => {
      state.expenseCategories.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    })
    .addCase(REMOVE_CATEGORY, (state, action) => {
      state.expenseCategories = state.expenseCategories
        .filter((cat) => {
          if (cat.value === action.payload && cat.toBeAdded) {
            return false;
          }
          return true;
        })
        .map((cat) => {
          if (cat.value === action.payload) {
            return {
              ...cat,
              toBeRemoved: true
            };
          }
          return cat;
        });
    })
    .addCase(CANCEL_REMOVE_CATEGORY, (state, action) => {
      state.expenseCategories = state.expenseCategories.map((cat) => {
        if (cat.value === action.payload) {
          return {
            ...cat,
            toBeRemoved: false
          };
        }
        return cat;
      });
    });
});
