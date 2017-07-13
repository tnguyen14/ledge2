import { getJson } from 'simple-fetch';
export const ADD_WEEK = 'ADD_WEEK';

export function addWeek() {
	return {
		type: ADD_WEEK
	};
}

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

export function loadTransactions(offset) {
	return function(dispatch) {
		getJson(
			`${config.server_url}/accounts/${config.account_name}/weekly/${offset}`
		).then(transactions => {
			dispatch({
				type: LOAD_TRANSACTIONS_SUCCESS,
				data: {
					offset,
					transactions
				}
			});
		});
	};
}
