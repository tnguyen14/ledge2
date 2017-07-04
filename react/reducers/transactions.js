import { LOAD_TRANSACTIONS_SUCCESS } from '../actions/transactions';
const initialState = {};

export default function transactions(state = initialState, action) {
	switch (action.type) {
		case LOAD_TRANSACTIONS_SUCCESS:
			return {
				...state,
				[action.data.offset]: action.data.transactions
			};
		default:
			return state;
	}
}
