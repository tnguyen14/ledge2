import { LOAD_YEARS_SUCCESS } from '../actions/years';
export default function transactions(state = {}, action) {
  switch (action.type) {
    case LOAD_YEARS_SUCCESS:
      return action.data.transactions.reduce(
        function addTransation(currentState, transaction) {
          if (!currentState[transaction.id]) {
            currentState[transaction.id] = transaction;
          }
          return currentState;
        },
        { ...state }
      );
    default:
      return state;
  }
}
