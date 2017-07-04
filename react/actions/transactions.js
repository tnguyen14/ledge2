import { getJson } from 'simple-fetch';
import config from 'config';

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
