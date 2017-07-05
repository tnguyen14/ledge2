import { LOAD_TRANSACTIONS_SUCCESS } from '../actions/transactions';
import { LOAD_WEEK } from '../actions/weeks';
import moment from 'moment-timezone';

const initialState = {};

function filterTransactions(transactions, start, end) {
	function isWithinWeek(date) {
		return date >= start.toISOString() && date <= end.toISOString();
	}
	return transactions
		.filter(tx => {
			return isWithinWeek(tx.date);
		})
		.sort((a, b) => {
			// sort by id, which is the transaction timestamp
			return Number(b.id) - Number(a.id);
		});
}
export default function weeks(state = initialState, action) {
	let offset;
	switch (action.type) {
		case LOAD_WEEK:
			offset = action.data;
			return {
				...state,
				[offset]: {
					start: moment().isoWeekday(1 + offset * 7).startOf('isoWeek'),
					end: moment().isoWeekday(7 + offset * 7).endOf('isoWeek')
				}
			};
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
		default:
			return state;
	}
}
