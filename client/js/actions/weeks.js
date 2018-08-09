import { getJson } from 'simple-fetch';
import config from 'config';
export const ADD_WEEK = 'ADD_WEEK';

export function addWeek() {
	return {
		type: ADD_WEEK
	};
}

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

const serverUrl = process.env.SERVER_URL;

export function loadTransactions(offset) {
	return function(dispatch, getState) {
		const { user: { idToken } } = getState();
		getJson(
			`${serverUrl}/accounts/${config.account_name}/weekly/${offset}`,
			{
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			}
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
