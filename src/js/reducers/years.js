import { LOAD_YEAR_SUCCESS } from '../actions/years';

export default function years(state = {}, action) {
  switch (action.type) {
    case LOAD_YEAR_SUCCESS:
      return {
        ...state,
        [action.data.year]: {
          transactions: action.data.transactions,
          numWeeks: action.data.end.diff(action.data.start, 'week')
        }
      };
    default:
      return state;
  }
}
