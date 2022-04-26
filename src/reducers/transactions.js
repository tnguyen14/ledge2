import {
  LOAD_TRANSACTIONS_SUCCESS,
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';

export default function transactions(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOAD_TRANSACTIONS_SUCCESS:
      if (!action.payload.transactions) {
        return state;
      }
      return action.payload.transactions.reduce(
        function addTransation(currentState, transaction) {
          if (!currentState[transaction.id]) {
            currentState[transaction.id] = transaction;
          }
          return currentState;
        },
        { ...state }
      );
    case ADD_TRANSACTION_SUCCESS:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    case REMOVE_TRANSACTION_SUCCESS:
      newState = { ...state };
      delete newState[action.payload];
      return newState;
    case UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    default:
      return state;
  }
}
