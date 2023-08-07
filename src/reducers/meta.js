import { createReducer } from 'https://esm.sh/@reduxjs/toolkit';
import slugify from 'https://esm.sh/@tridnguyen/slugify@2';
import { createSelector } from 'https://esm.sh/reselect@4';
import { DateTime } from 'https://esm.sh/luxon@3';

import {
  LOAD_META_SUCCESS,
  UPDATE_YEAR_STATS,
  UPDATE_YEAR_STATS_SUCCESS,
  SAVE_USER_SETTINGS_SUCCESS,
  UPDATE_MERCHANT_COUNTS_SUCCESS
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

// generate an array of years since last year, going back to 2018
// for eg., if current year is 2023, pastYears is [2022, 2021, ..., 2018]
const currentYear = DateTime.now().get('year');
const pastYears = [...Array(currentYear - 2018).keys()].map(
  (index) => 2018 + index
);

const initialState = {
  merchants: [],
  expenseCategories: [],
  merchants_count: {},
  accounts: builtinAccounts,
  stats: pastYears.reduce((stats, year) => {
    stats[year] = {
      weeklyAverage: 0
    };
    return stats;
  }, {}),
  timezoneToStore: ''
};

const getMerchantNamesFromMerchantCounts = createSelector(
  (state) => state,
  (counts) =>
    Object.keys(counts)
      .filter((merchant) => {
        // a merchant count might be set to null if
        // it's being removed completely
        return counts[merchant] != null;
      })
      .map((merchant) => {
        return {
          // pass along slug
          slug: merchant,
          ...counts[merchant]
        };
      })
      .sort((a, b) => {
        // sort by count
        return b.count - a.count;
      })
      .reduce((merchants, merchant) => merchants.concat(merchant.values), [])
);

export default createReducer(initialState, (builder) => {
  builder
    .addCase(LOAD_META_SUCCESS, (state, action) => {
      state.merchants = getMerchantNamesFromMerchantCounts(
        action.payload.merchants_count
      );
      state.expenseCategories = action.payload.expenseCategories;
      state.merchants_count = action.payload.merchants_count;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
      Object.keys(action.payload.stats).forEach(
        (year) => (state.stats[year] = action.payload.stats[year])
      );
      state.timezoneToStore = action.payload.timezoneToStore;
    })
    .addCase(UPDATE_MERCHANT_COUNTS_SUCCESS, (state, action) => {
      state.merchants_count = action.payload;
      state.merchants = getMerchantNamesFromMerchantCounts(action.payload);
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
