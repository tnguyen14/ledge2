import { getJson, postJson, patchJson, deleteJson } from 'simple-fetch';
import * as actionTypes from './types';
import config from 'config';

export function getAccount () {
	return function (dispatch) {
		return getJson(config.server_url + '/accounts/' + config.account_name)
			.then(function (json) {
				dispatch({
					type: actionTypes.RECEIVE_ACCOUNT,
					payload: json
				});
			});
	};
}

export function saveTransaction (data) {
	data.amount = data.amount * 100;
	const isUpdating = Boolean(data.id);
	const saveMethod = isUpdating ? patchJson : postJson;
	const actionType = isUpdating ? actionTypes.UPDATE_TRANSACTION : actionTypes.ADD_TRANSACTION;
	const url = config.server_url + '/accounts/' + config.account_name + '/transactions' + (isUpdating ? '/' + data.id : '');
	return (dispatch) => {
		return saveMethod(url, data)
			.then(function (json) {
				let payload;
				if (isUpdating) {
					payload = data;
				} else {
					payload = {
						...data,
						id: json.id
					};
				}
				dispatch({
					type: actionType,
					payload: payload
				});
				dispatch({
					type: actionTypes.RESET_FORM
				});
			});
	};
}

export function deleteTransaction (id) {
	return (dispatch) => {
		return deleteJson(config.server_url + '/accounts/' + config.account_name + '/transactions/' + id)
			.then((json) => {
				dispatch({
					type: actionTypes.DELETE_TRANSACTION,
					payload: id
				});
			}, (err) => {
				err.response.json().then(function (json) {
					dispatch({
						type: actionTypes.ALERT,
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
			type: actionTypes.EDIT_TRANSACTION,
			payload: transaction
		});
	};
}

export function confirmDelete (id) {
	return {
		type: actionTypes.CONFIRM_DELETE,
		payload: id
	};
}

export function cancelDelete () {
	return {
		type: actionTypes.CANCEL_DELETE
	};
}

export function dismissAlert () {
	return {
		type: actionTypes.DISMISS_ALERT
	};
}
