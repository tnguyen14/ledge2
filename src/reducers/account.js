import {
  LOAD_ACCOUNT_SUCCESS,
  INTEND_TO_REMOVE_TRANSACTION,
  CANCEL_REMOVE_TRANSACTION
} from '../actions/account.js';

import { REMOVE_TRANSACTION_SUCCESS } from '../actions/transactions.js';

const initialState = {
  merchants: [],
  isRemovingTransaction: false,
  categories: {
    'regular-expense': []
  },
  sources: {
    'regular-expense': []
  },
  merchants_count: {},
  types: {
    in: [],
    out: []
  }
};

export default function account(state = initialState, action) {
  switch (action.type) {
    case LOAD_ACCOUNT_SUCCESS:
      const merchants = Object.keys(action.data.merchants_count)
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
      const merchantsNames = merchants.reduce((merchants, merchant) => {
        return merchants.concat(merchant.values);
      }, []);
      return { ...state, ...action.data, merchants: merchantsNames };
    case INTEND_TO_REMOVE_TRANSACTION:
      return {
        ...state,
        isRemovingTransaction: true,
        transactionToBeRemoved: action.data
      };
    case REMOVE_TRANSACTION_SUCCESS:
    case CANCEL_REMOVE_TRANSACTION:
      return {
        ...state,
        isRemovingTransaction: false,
        transactionToBeRemoved: undefined
      };
    default:
      return state;
  }
}
