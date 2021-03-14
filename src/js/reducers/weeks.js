import { SHOW_WEEK } from '../actions/weeks';
import { LOAD_TRANSACTIONS_SUCCESS } from '../actions/years';

import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
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
      .startOf('day'),
    end: moment()
      .isoWeekday(7 + offset * 7)
      .endOf('day'),
    transactions: [],
    offset,
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

function addTransactionToWeek(transaction, week) {
  if (
    !week.transactions.some((existingTx) => existingTx.id == transaction.id)
  ) {
    week.transactions = sortTransactions(week.transactions.concat(transaction));
  }
}

function getTransactionWeekOffset(transaction) {
  const thisMonday = moment().tz(TIMEZONE).isoWeekday(1).startOf('day');
  const transactionMonday = moment(transaction.date)
    .tz(TIMEZONE)
    .isoWeekday(1)
    .startOf('day');
  const offset = transactionMonday.diff(thisMonday, 'week');
  return offset;
}

function addTransaction(transaction, weeks) {
  const newWeeks = {
    ...weeks
  };
  const offset = getTransactionWeekOffset(transaction);

  if (!newWeeks[offset]) {
    newWeeks[offset] = createDefaultWeek(offset);
  }

  addTransactionToWeek(transaction, newWeeks[offset]);
  // account for multi-week transaction
  for (let i = 1; i < transaction.span; i++) {
    let nextOffset = offset + i;
    if (!newWeeks[nextOffset]) {
      newWeeks[nextOffset] = createDefaultWeek(nextOffset);
    }
    addTransactionToWeek(
      {
        ...transaction,
        carriedOver: true
      },
      newWeeks[nextOffset]
    );
  }
  return newWeeks;
}

function sortTransactions(transactions) {
  return transactions.sort((a, b) => {
    // sort by id, which is the transaction timestamp
    return moment(b.date).valueOf() - moment(a.date).valueOf();
  });
}

export default function weeks(state = {}, action) {
  let offset;
  let newState;
  let transaction;
  switch (action.type) {
    case SHOW_WEEK:
      newState = {
        ...state
      };

      if (newState[action.data.index]) {
        newState[action.data.index].visible = true;
      }

      return newState;
    case LOAD_TRANSACTIONS_SUCCESS:
      newState = action.data.reduce((weeks, t) => {
        return addTransaction(t, weeks);
      }, state);
      return newState;
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
              tx.id === action.data.id ? { ...action.data } : tx
            )
          )
        };
        return newState;
      }, {});
    default:
      return state;
  }
}
