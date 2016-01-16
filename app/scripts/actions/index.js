import { getJson, postJson, patchJson } from 'simple-fetch';
import config from 'config';

// action types
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export const RESET_FORM = 'RESET_FORM';

export function getAccount () {
	return function (dispatch) {
		return getJson(config.server_url + '/accounts/' + config.account_name)
			.then(function (json) {
				dispatch({
					type: RECEIVE_ACCOUNT,
					payload: json
				});
			});
	};
}

export function newTransaction (data) {
	data.amount = data.amount * 100;
	const saveMethod = data._id ? patchJson : postJson;
	const actionType = data._id ? UPDATE_TRANSACTION : ADD_TRANSACTION;
	const url = config.server_url + '/accounts/' + config.account_name + '/transactions' + (data._id ? '/' + data._id : '');
	return dispatch => {
		return saveMethod(url, data)
			.then(function (json) {
				let payload = json;
				// if updating, return data as the patch REST API response
				// does not contain transaction data
				if (data._id) {
					payload = data;
				}
				dispatch({
					type: actionType,
					payload: payload
				});
				dispatch({
					type: RESET_FORM
				});
			});
	};
}

export function editTransaction (id) {
	return (dispatch, getState) => {
		const { account: {transactions} } = getState();
		const transaction = transactions.filter(tx => tx._id === id)[0];
		dispatch({
			type: EDIT_TRANSACTION,
			payload: transaction
		});
	};
}
