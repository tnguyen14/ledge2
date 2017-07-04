import { LOAD_ACCOUNT_SUCCESS } from '../actions/account';
const initialState = {
	weeks: [0, -1, -2, -3],
	merchants: []
};

export default function account(state = initialState, action) {
	switch (action.type) {
		case LOAD_ACCOUNT_SUCCESS:
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
		default:
			return state;
	}
}
