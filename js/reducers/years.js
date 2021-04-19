import { LOAD_YEAR_SUCCESS, LOAD_YEARS_SUCCESS } from '../actions/years';
import { sortTransactions } from '../util/transaction';
import moment from 'moment-timezone';

function addTransaction(years, transaction) {
  const transactionYear = moment(new Date(transaction.date))
    .tz(TIMEZONE)
    .year();
  const newYears = { ...years };
  // TODO check if transaction already exist in year- maybe use Set?
  if (!newYears[transactionYear]) {
    newYears[transactionYear] = {
      transactions: [transaction]
    };
  } else {
    newYears[transactionYear].transactions = newYears[
      transactionYear
    ].transactions.concat(transaction);
  }
  return newYears;
}
export default function years(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOAD_YEAR_SUCCESS:
      return {
        ...state,
        [action.data.year]: {
          transactions: action.data.transactions,
          numWeeks: action.data.end.diff(action.data.start, 'week')
        }
      };
    case LOAD_YEARS_SUCCESS:
      newState = action.data.transactions.reduce(addTransaction, state);
      // sort transactions in a year
      return Object.keys(newState).reduce((years, year) => {
        years[year].transactions = sortTransactions(years[year].transactions);
        years[year].numWeeks = moment(
          new Date(years[year].transactions[0].date)
        ).diff(
          moment(
            new Date(
              years[year].transactions[years[year].transactions.length - 1].date
            )
          ),
          'weeks'
        );
        return years;
      }, newState);
    default:
      return state;
  }
}
