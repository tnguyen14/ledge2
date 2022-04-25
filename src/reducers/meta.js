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
  accounts: builtinAccounts
};

export default function meta(state = initialState, action) {
  let merchants, merchantsNames;
  switch (action.type) {
    case LOAD_META_SUCCESS:
      merchants = Object.keys(action.data.merchants_count)
        .filter((merchant) => {
          return action.data.merchants_count[merchant] != null;
        })
        .map((merchant) => {
          return {
            // pass along slug
            slug: merchant,
            ...action.data.merchants_count[merchant]
          };
        })
        .sort((a, b) => {
          // sort by count
          return b.count - a.count;
        });
      // create an array of all merchant names
      merchantsNames = merchants.reduce((merchants, merchant) => {
        return merchants.concat(merchant.values);
      }, []);
      return {
        ...state,
        ...action.data,
        merchants: merchantsNames,
        accounts: [
          ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
          ...(action.data.accounts || [])
        ]
      };
    case SAVE_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.data,
        accounts: [
          ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
          ...(action.data.accounts || [])
        ]
      };
    case UPDATE_YEAR_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.data.year]: {
            updating: true
          }
        }
      };
    case UPDATE_YEAR_STATS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.data.year]: action.data.stat
        }
      };
    case ADD_ACCOUNT:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          {
            value: action.data,
            slug: slugify(action.data),
            toBeAdded: true
          }
        ]
      };
    case REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts
          .filter((acct) => {
            if (acct.value === action.data && acct.toBeAdded) {
              return false;
            }
            return true;
          })
          .map((acct) => {
            if (acct.value === action.data) {
              return {
                ...acct,
                toBeRemoved: true
              };
            }
            return acct;
          })
      };
    case CANCEL_REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.map((acct) => {
          if (acct.value === action.data) {
            return {
              ...acct,
              toBeRemoved: false
            };
          }
          return acct;
        })
      };
    case ADD_CATEGORY:
      return {
        ...state,
        expenseCategories: [
          ...state.expenseCategories,
          {
            value: action.data,
            slug: slugify(action.data),
            toBeAdded: true
          }
        ]
      };
    case REMOVE_CATEGORY:
      return {
        ...state,
        expenseCategories: state.expenseCategories
          .filter((cat) => {
            if (cat.value === action.data && cat.toBeAdded) {
              return false;
            }
            return true;
          })
          .map((cat) => {
            if (cat.value === action.data) {
              return {
                ...cat,
                toBeRemoved: true
              };
            }
            return cat;
          })
      };
    case CANCEL_REMOVE_CATEGORY:
      return {
        ...state,
        expenseCategories: state.expenseCategories.map((cat) => {
          if (cat.value === action.data) {
            return {
              ...cat,
              toBeRemoved: false
            };
          }
          return cat;
        })
      };
    default:
      return state;
  }
}
