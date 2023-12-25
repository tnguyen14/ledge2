import { createAsyncThunk, createSlice } from 'https://esm.sh/@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';
import { createSelector } from 'https://esm.sh/reselect@4';
import slugify from 'https://esm.sh/@tridnguyen/slugify@2';
import { patchMeta } from '../util/api.js';

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
  timezoneToStore: '',
  recurring: []
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

export const updateMerchantCounts = createAsyncThunk(
  'meta/updateMerchantCounts',
  async (merchants_count) => {
    await patchMeta({
      merchants_count
    });
    return merchants_count;
  }
);

export const updateRecurring = createAsyncThunk(
  'meta/updateRecurring',
  async (recurring) => {
    await patchMeta({
      recurring
    });
    return recurring;
  }
);

const meta = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    loadMetaSuccess: (state, action) => {
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
      state.recurring = action.payload.recurring;
    },
    updateMerchantCountsSuccess: (state, action) => {
      state.merchants_count = action.payload;
      state.merchants = getMerchantNamesFromMerchantCounts(action.payload);
    },
    updateYearStats: (state, action) => {
      state.stats[action.payload].updating = true;
    },
    updateYearStatsSuccess: (state, action) => {
      state.stats[action.payload.year] = action.payload.stat;
    },
    updateUserSettings: () => {},
    updateUserSettingsSuccess: (state, action) => {
      state.expenseCategories = action.payload.expenseCategories;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
    },
    updateUserSettingsFailure: () => {},
    addAccount: (state, action) => {
      state.accounts.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    },
    removeAccount: (state, action) => {
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
    },
    cancelRemoveAccount: (state, action) => {
      state.accounts = state.accounts.map((acct) => {
        if (acct.value === action.payload) {
          return {
            ...acct,
            toBeRemoved: false
          };
        }
        return acct;
      });
    },
    addCategory: (state, action) => {
      state.expenseCategories.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    },
    removeCategory: (state, action) => {
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
    },
    cancelRemoveCategory: (state, action) => {
      state.expenseCategories = state.expenseCategories.map((cat) => {
        if (cat.value === action.payload) {
          return {
            ...cat,
            toBeRemoved: false
          };
        }
        return cat;
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateMerchantCounts.fulfilled, (state, action) => {
      state.merchants_count = action.payload;
      state.merchants = getMerchantNamesFromMerchantCounts(action.payload);
    });
    builder.addCase(updateRecurring.fulfilled, (state, action) => {
      state.recurring = action.payload;
    });
  }
});

export const {
  loadMetaSuccess,
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  updateYearStats,
  updateYearStatsSuccess,
  addAccount,
  removeAccount,
  cancelRemoveAccount,
  addCategory,
  removeCategory,
  cancelRemoveCategory
} = meta.actions;
export default meta.reducer;
