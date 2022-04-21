import {
  LOAD_META_SUCCESS,
  UPDATE_YEAR_STATS,
  UPDATE_YEAR_STATS_SUCCESS
} from '../actions/meta.js';

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
  categories: {
    'regular-expense': []
  },
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
        accounts: [...builtinAccounts, ...(action.data.accounts || [])]
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
    default:
      return state;
  }
}
