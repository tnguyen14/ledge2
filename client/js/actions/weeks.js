import { getJson } from '../util/fetch';
import config from 'config';
export const ADD_WEEK = 'ADD_WEEK';

export function addWeek() {
	return {
		type: ADD_WEEK
	};
}

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

const serverUrl = process.env.SERVER_URL;

export function loadTransactions(offset) {
	return function(dispatch, getState) {
		dispatch({
			type: LOAD_TRANSACTIONS,
			data: {
				offset
			}
		});
		getJson
			.bind(null, dispatch, getState)(
				`${serverUrl}/accounts/${config.account_name}/weekly/${offset}`
			)
			.then(transactions => {
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
