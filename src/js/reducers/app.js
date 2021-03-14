import { LOAD_TRANSACTIONS, LOAD_TRANSACTIONS_SUCCESS } from '../actions/app';

const defaultState = {
  isLoading: false
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}
