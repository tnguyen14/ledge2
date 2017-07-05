export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';

export function submitForm(transaction) {
	return (dispatch, getState) => {
		const { action } = getState().form;
		console.log('action is ', action);
		dispatch({
			type: SUBMIT_TRANSACTION,
			data: transaction
		});
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
