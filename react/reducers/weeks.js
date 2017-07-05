import { LOAD_TRANSACTIONS_SUCCESS } from '../actions/transactions';
import { ADD_WEEK } from '../actions/weeks';
import { ADD_TRANSACTION_SUCCESS } from '../actions/form';
import moment from 'moment-timezone';

const weekOffsets = [0, -1, -2, -3];
const initialState = weekOffsets.reduce((state, offset) => {
	state[offset] = createDefaultWeek(offset);
	return state;
}, {});

function createDefaultWeek(offset) {
	return {
		start: moment().isoWeekday(1 + offset * 7).startOf('isoWeek'),
		end: moment().isoWeekday(7 + offset * 7).endOf('isoWeek'),
		transactions: []
	};
}

function isWithinWeek(date, start, end) {
	return date >= start.toISOString() && date <= end.toISOString();
}

function filterTransactions(transactions, start, end) {
	return transactions
		.filter(tx => {
			return isWithinWeek(tx.date, start, end);
		})
		.sort((a, b) => {
			// sort by id, which is the transaction timestamp
			return Number(b.id) - Number(a.id);
		});
}

export default function weeks(state = initialState, action) {
	let offset;
	switch (action.type) {
		case LOAD_TRANSACTIONS_SUCCESS:
			offset = action.data.offset;
			const start = state[offset].start;
			const end = state[offset].end;
			if (!start || !end) {
				throw new Error('Unable to find boundaries for week ' + offset);
			}
			return {
				...state,
				[offset]: {
					transactions: filterTransactions(
						action.data.transactions,
						start,
						end
					),
					// assign start and end again
					// as nested object will be overriden
					start,
					end
				}
			};
		case ADD_WEEK:
			const newOffset = -Object.keys(state).length;
			return {
				...state,
				[newOffset]: createDefaultWeek(newOffset)
			};
		case ADD_TRANSACTION_SUCCESS:
			return Object.keys(state).reduce((newState, offset) => {
				const week = state[offset];
				// only care if transaction is within a week
				if (isWithinWeek(action.data.date, week.start, week.end)) {
					week.transactions = filterTransactions(
						week.transactions.concat(action.data),
						week.start,
						week.end
					);
				}
				newState[offset] = week;
				return newState;
			}, {});
		default:
			return state;
	}
}
