import moment from 'moment-timezone';
import {
	INPUT_CHANGE,
	SUBMIT_TRANSACTION,
	SUBMIT_TRANSACTION_FAILURE,
	ADD_TRANSACTION_SUCCESS,
	UPDATE_TRANSACTION_SUCCESS,
	RESET_FORM
} from '../actions/form';
import { EDIT_TRANSACTION, LOAD_ACCOUNT_SUCCESS } from '../actions/account';
import { SHOW_ONE_MORE_WEEK } from '../actions/weeks';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const timezone = 'America/New_York';

let defaultCategory = '';
let defaultSource = '';

// abstract this into a function so it can be called again later
// resetting the date and time to the current value when it's called
function createInitialValues() {
	const now = moment.tz(timezone);
	return {
		amount: '',
		merchant: '',
		date: now.format(dateFormat),
		time: now.format(timeFormat),
		category: defaultCategory,
		source: defaultSource,
		span: 1,
		description: '',
		status: 'POSTED'
	};
}
const initialState = {
	action: 'add',
	focus: true,
	values: createInitialValues(),
	fields: [
		{
			type: 'number',
			label: 'Amount',
			name: 'amount',
			placeholder: 'Amount',
			attributes: {
				min: 0,
				step: 'any',
				required: true,
				autoFocus: true
			}
		},
		{
			type: 'text',
			label: 'Merchant',
			name: 'merchant',
			placeholder: 'Merchant',
			attributes: {
				required: true,
				list: 'merchants-list'
			}
		},
		{
			type: 'date',
			label: 'Date',
			name: 'date',
			attributes: {
				required: true
			}
		},
		{
			type: 'time',
			label: 'Time',
			name: 'time',
			attributes: {
				required: true
			}
		},
		{
			type: 'select',
			label: 'Category',
			name: 'category',
			placeholder: 'Select a category'
		},
		{
			type: 'select',
			label: 'Source',
			name: 'source'
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description',
			placeholder: 'Description'
		},
		{
			type: 'number',
			label: 'Span',
			name: 'span',
			hint:
				'Number of weeks the transaction should be spread over, such as 1, 4, 13, 52',
			attributes: {
				min: 0,
				step: 1
			}
		},
		{
			type: 'select',
			label: 'Status',
			name: 'status',
			options: [
				{
					slug: 'POSTED',
					value: 'POSTED'
				}
			]
		},
		{
			type: 'hidden',
			name: 'id'
		}
	]
};

function updateFieldsWithValues(fields, values) {
	return fields.map(field => {
		return {
			...field,
			value: values[field.name]
		};
	});
}

export default function form(state = initialState, action) {
	let newValues;
	switch (action.type) {
		case SUBMIT_TRANSACTION:
			return {
				...state,
				focus: false,
				pending: true,
				action: state.action === 'add' ? 'adding...' : 'updating...'
			};
		case SUBMIT_TRANSACTION_FAILURE:
			return {
				...state,
				focus: false,
				pending: false,
				action: state.action === 'adding...' ? 'add' : 'update'
			};
		case ADD_TRANSACTION_SUCCESS:
		case UPDATE_TRANSACTION_SUCCESS:
			// after successful save to the server, reset to initial values
			newValues = createInitialValues();
			return {
				...state,
				pending: false,
				fields: updateFieldsWithValues(state.fields, newValues),
				values: newValues,
				action: 'add'
			};
		case RESET_FORM:
			newValues = createInitialValues();
			return {
				...state,
				focus: true,
				pending: false,
				fields: updateFieldsWithValues(state.fields, newValues),
				values: newValues,
				action: 'add'
			};
		case INPUT_CHANGE:
			newValues = {
				...state.values,
				[action.data.name]: action.data.value
			};

			return {
				...state,
				focus: false,
				values: newValues,
				fields: updateFieldsWithValues(state.fields, newValues)
			};
		case EDIT_TRANSACTION:
			const date = moment.tz(action.data.date, timezone);
			newValues = {
				...action.data,
				amount: action.data.amount / 100,
				date: date.format(dateFormat),
				time: date.format(timeFormat)
			};
			return {
				...state,
				action: 'update',
				focus: true,
				values: newValues,
				fields: updateFieldsWithValues(state.fields, newValues)
			};
		case SHOW_ONE_MORE_WEEK:
			return {
				...state,
				focus: false
			};
		case LOAD_ACCOUNT_SUCCESS:
			// when account is loaded, set category and source
			// with the first value in options
			defaultCategory = action.data.categories[0].slug;
			defaultSource = action.data.sources[0].slug;
			newValues = {
				...state.values,
				category: defaultCategory,
				source: defaultSource
			};
			return {
				...state,
				values: newValues,
				fields: updateFieldsWithValues(state.fields, newValues)
			};
		default:
			return {
				...state,
				fields: updateFieldsWithValues(state.fields, state.values)
			};
	}
}
