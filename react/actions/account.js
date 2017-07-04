import { getJson } from 'simple-fetch';
import config from 'config';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
	return function(dispatch) {
		getJson(
			config.server_url + '/accounts/' + config.account_name
		).then(account => {
			dispatch({
				type: LOAD_ACCOUNT_SUCCESS,
				data: account
			});
		});
	};
}
