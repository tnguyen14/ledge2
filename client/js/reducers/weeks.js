import { REMOVE_TRANSACTION_SUCCESS } from '../actions/account';
import {
  ADD_WEEK,
  SHOW_WEEK,
  LOAD_TRANSACTIONS_SUCCESS
} from '../actions/weeks';
import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS
} from '../actions/transaction';
import moment from 'moment-timezone';

const NUM_PAST_WEEKS_VISIBLE_AT_FIRST = 4;

function createDefaultWeek(offset) {
  if (!Number.isInteger(offset)) {
    throw new Error(`Offset ${offset} is not an integer`);
  }
  return {
    start: moment()
      .isoWeekday(1 + offset * 7)
      .startOf('isoWeek'),
    end: moment()
      .isoWeekday(7 + offset * 7)
      .endOf('isoWeek'),
    isLoading: false,
    hasLoaded: false,
    transactions: [],
    visible: offset <= 0 && Math.abs(offset) < NUM_PAST_WEEKS_VISIBLE_AT_FIRST
  };
}

function isWithinWeek(date, start, end) {
  if (!date || !start || !end) {
    return false;
  }
  // date string comparison
  return date >= start.toISOString() && date <= end.toISOString();
}

// add a newTransactions array to an existing ones,
// with checking for duplicate id
function addTransactionsToExisting(existingTransactions, newTransactions) {
  // create a new array
  const transactions = existingTransactions.concat();
  newTransactions.forEach((tx) => {
    if (!existingTransactions.some((existingTx) => existingTx.id == tx.id)) {
      transactions.push(tx);
    }
  });
  return transactions;
}
// filter out list of transactions that have span > 1
function getMultiWeekTransactions(transactions) {
  return transactions.filter((txn) => {
    return txn.span && txn.span > 1;
  });
}

// distribute multiweek transactions across other weeks
function accountForMultiWeekTransaction(transaction, currentOffset, weeks) {
  // sort week indices from highest (future) to lowest (past)
  const weeksIndices = Object.keys(weeks).sort((a, b) => b - a);
  for (let i = 1; i < transaction.span; i++) {
    let nextOffset = currentOffset + i;
    if (!weeks[nextOffset]) {
      weeks[nextOffset] = createDefaultWeek(nextOffset);
    }

    weeks[nextOffset].transactions = addTransactionsToExisting(
      weeks[nextOffset].transactions,
      [
        {
          ...transaction,
          carriedOver: true
        }
      ]
    );
  }
}

function sortTransactions(transactions) {
  return transactions.sort((a, b) => {
    // sort by id, which is the transaction timestamp
    return Number(b.id) - Number(a.id);
  });
}

export default function weeks(state = {}, action) {
  let offset;
  let newState;
  switch (action.type) {
    case ADD_WEEK:
      newState = {
        ...state
      };
      let newOffset = action.data.offset;
      // week might already exist as loaded by carriedover transactions
      if (!newState[newOffset]) {
        newState[newOffset] = createDefaultWeek(newOffset);
      }
      newState[newOffset].isLoading = true;
      return newState;
    case SHOW_WEEK:
      newState = {
        ...state
      };

      if (newState[action.data.index]) {
        newState[action.data.index].visible = true;
      }

      return newState;
    case LOAD_TRANSACTIONS_SUCCESS:
      offset = action.data.offset;
      const start = state[offset].start;
      const end = state[offset].end;
      if (!start || !end) {
        throw new Error('Unable to find boundaries for week ' + offset);
      }
      getMultiWeekTransactions(action.data.transactions).forEach((txn) => {
        accountForMultiWeekTransaction(txn, offset, state);
      });
      // there might be existing transactions that were carried over
      // by multiweek transactions
      const existingTransactions = state[offset].transactions || [];
      const carriedOverTransactions = existingTransactions.filter(
        (tx) => tx.carriedOver
      );
      return {
        ...state,
        [offset]: {
          ...state[offset],
          isLoading: false,
          hasLoaded: true,
          transactions: carriedOverTransactions.concat(
            sortTransactions(
              // filter seems unnecessary for weekly transactions
              // filterTransactions(action.data.transactions, start, end)
              action.data.transactions
            )
          ),
          // assign start and end again
          // as nested object will be overriden
          start,
          end
        }
      };
    case ADD_TRANSACTION_SUCCESS:
      return Object.keys(state).reduce((newState, offset) => {
        const week = state[offset];
        // only care if transaction is within a week
        if (isWithinWeek(action.data.date, week.start, week.end)) {
          week.transactions = sortTransactions(
            week.transactions.concat(action.data)
          );
        }
        newState[offset] = week;
        return newState;
      }, {});
    case REMOVE_TRANSACTION_SUCCESS:
      return Object.keys(state).reduce((newState, offset) => {
        const week = state[offset];
        newState[offset] = {
          ...week,
          transactions: week.transactions.filter((tx) => tx.id !== action.data)
        };
        return newState;
      }, {});
    case UPDATE_TRANSACTION_SUCCESS:
      return Object.keys(state).reduce((newState, offset) => {
        const week = state[offset];
        newState[offset] = {
          ...week,
          transactions: sortTransactions(
            week.transactions.map((tx) =>
              tx.id === action.data.oldId ? { ...action.data } : tx
            )
          )
        };
        return newState;
      }, {});
    default:
      return state;
  }
}
