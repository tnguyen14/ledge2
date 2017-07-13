import { getJson, deleteJson } from 'simple-fetch';
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

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';

export function editTransaction(transactionId) {
	return function(dispatch, getState) {
		// editTransaction is an action-creator creator
		return function() {
			const { weeks } = getState();
			let transaction;
			// iterate over each week to find the transaction
			// if it's already found, move on (short-circuiting by using
			// Array.prototype.some)
			Object.keys(weeks).some(offset => {
				if (transaction) {
					return true;
				}
				weeks[offset].transactions.some(tx => {
					if (tx.id === transactionId) {
						transaction = tx;
						return true;
					}
				});
			});
			dispatch({
				type: EDIT_TRANSACTION,
				data: transaction
			});
		};
	};
}

export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';

export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

export function removeTransaction(transactionId) {
	return function(dispatch) {
		// removeTransaction is an action-creator creator
		return function() {
			dispatch({
				type: REMOVE_TRANSACTION,
				data: transactionId
			});
		};
	};
}

export function confirmRemoveTransaction(transactionId) {
	return function(dispatch) {
		return function() {
			deleteJson(
				`${config.server_url}/accounts/${config.account_name}/transactions/${transactionId}`
			).then(json => {
				dispatch({
					type: REMOVE_TRANSACTION_SUCCESS,
					data: transactionId
				});
			});
		};
	};
}

export const CANCEL_REMOVE_TRANSACTION = 'CANCEL_REMOVE_TRANSACTION';

export function cancelRemoveTransaction() {
	return {
		type: CANCEL_REMOVE_TRANSACTION
	};
}
