import { LOAD_ACCOUNT_SUCCESS } from '../actions/account';
import {
	REMOVE_TRANSACTION,
	REMOVE_TRANSACTION_SUCCESS,
	CANCEL_REMOVE_TRANSACTION
} from '../actions/transactions';
const initialState = {
	merchants: [],
	isRemovingTransaction: false
};

export default function account(state = initialState, action) {
	switch (action.type) {
		case LOAD_ACCOUNT_SUCCESS:
			// create a list of merchants based on the
			// merchants_count object
			const merchants = Object.keys(action.data.merchants_count)
				.map(merchant => {
					return {
						slug: merchant,
						count: action.data.merchants_count[merchant].count
					};
				})
				.sort((a, b) => {
					return b.count - a.count;
				})
				.reduce((merchants, merchant) => {
					return merchants.concat(
						action.data.merchants_count[merchant.slug].values
					);
				}, []);
			return { ...state, ...action.data, merchants: merchants };
		case REMOVE_TRANSACTION:
			return {
				...state,
				isRemovingTransaction: true,
				transactionToBeRemoved: action.data
			};
		case REMOVE_TRANSACTION_SUCCESS:
		case CANCEL_REMOVE_TRANSACTION:
			return {
				...state,
				isRemovingTransaction: false,
				transactionToBeRemoved: undefined
			};
		default:
			return state;
	}
}
