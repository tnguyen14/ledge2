import { getJson, postJson, patchJson, deleteJson } from 'simple-fetch';
import config from 'config';

// action types
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
export const CONFIRM_DELETE = 'CONFIRM_DELETE';
export const CANCEL_DELETE = 'CANCEL_DELETE';
export const RESET_FORM = 'RESET_FORM';
export const ALERT = 'ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

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

export function saveTransaction (data) {
	data.amount = data.amount * 100;
	const saveMethod = data.id ? patchJson : postJson;
	const actionType = data.id ? UPDATE_TRANSACTION : ADD_TRANSACTION;
	const url = config.server_url + '/accounts/' + config.account_name + '/transactions' + (data.id ? '/' + data.id : '');
	return (dispatch) => {
		return saveMethod(url, data)
			.then(function (json) {
				let payload = json;
				// if updating, return data as the patch REST API response
				// does not contain transaction data
				if (data.id) {
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

export function deleteTransaction (id) {
	return (dispatch) => {
		return deleteJson(config.server_url + '/accounts/' + config.account_name + '/transactions/' + id)
			.then((json) => {
				dispatch({
					type: DELETE_TRANSACTION,
					payload: id
				});
			}, (err) => {
				err.response.json().then(function (json) {
					dispatch({
						type: ALERT,
						payload: {
							type: 'danger',
							content: err.message + ': ' + json.message
						}
					});
				});
			});
	};
}

export function editTransaction (id) {
	return (dispatch, getState) => {
		const { account: {transactions} } = getState();
		const transaction = transactions.filter((tx) => tx.id === id)[0];
		dispatch({
			type: EDIT_TRANSACTION,
			payload: transaction
		});
	};
}

export function confirmDelete (id) {
	return {
		type: CONFIRM_DELETE,
		payload: id
	};
}

export function cancelDelete () {
	return {
		type: CANCEL_DELETE
	};
}

export function dismissAlert () {
	return {
		type: DISMISS_ALERT
	};
}
