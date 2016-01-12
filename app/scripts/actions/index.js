import { getJson, postJson } from 'simple-fetch';
import config from 'config';

// action types
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';

export function getAccount () {
	return function (dispatch) {
		return getJson(config.server_url + '/accounts/' + config.account_name)
			.then(function (json) {
				return dispatch({
					type: RECEIVE_ACCOUNT,
					payload: json
				});
			});
	};
}

export function newTransaction (data) {
	return dispatch => {
		// return postJson(config.server_url + '/accounts/' + config.account_name + '/transactions', data)
		return Promise.resolve(data)
			.then(function () {
				return dispatch({
					type: ADD_TRANSACTION,
					payload: data
				});
			});
	};
}
