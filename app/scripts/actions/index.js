import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import config from 'config';

// action types
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';

export function getAccount () {
	return function (dispatch) {
		return fetch(config.server_url + '/accounts/' + config.account_name)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				return dispatch({
					type: RECEIVE_ACCOUNT,
					payload: json
				});
			});
	};
}

