import { postJson, patchJson } from 'simple-fetch';
import moment from 'moment-timezone';
import config from 'config';

const timezone = 'America/New_York';

export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';

export function submitForm(event) {
	event.preventDefault();
	return (dispatch, getState) => {
		const { form: { action, values }, user: { idToken } } = getState();
		let entry = {
			...values,
			amount: values.amount * 100
		};

		const isUpdating = action === 'update';
		const serverAction = isUpdating ? patchJson : postJson;
		const actionUrl = `${config.server_url}/accounts/${
			config.account_name
		}/transactions/${isUpdating ? entry.id : ''}`;
		const successActionType = isUpdating
			? UPDATE_TRANSACTION_SUCCESS
			: ADD_TRANSACTION_SUCCESS;

		dispatch({
			type: SUBMIT_TRANSACTION
		});

		serverAction(actionUrl, entry, {
			headers: {
				Authorization: `Bearer ${idToken}`
			}
		}).then(
			json => {
				dispatch({
					type: successActionType,
					data: {
						...entry,
						// pass back the old ID in case the transaction's ID
						// has been changed due to changed time
						oldId: entry.id,
						id: String(json.id),
						// replicate the conversion done on the server as the
						// date value is not returned
						date: moment
							.tz(entry.date + ' ' + entry.time, timezone)
							.toISOString()
					}
				});
			},
			err => {
				dispatch({
					type: SUBMIT_TRANSACTION_FAILURE,
					data: err
				});
			}
		);
	};
}

export const INPUT_CHANGE = 'INPUT_CHANGE';

export function inputChange(name, value) {
	return {
		type: INPUT_CHANGE,
		data: {
			name,
			value
		}
	};
}

export const RESET_FORM = 'RESET_FORM';

export function resetForm() {
	return {
		type: RESET_FORM
	};
}
