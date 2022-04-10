import React from 'https://cdn.skypack.dev/react@17';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { ZapIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import { fromCents } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import {
  INPUT_CHANGE,
  SUBMIT_TRANSACTION,
  SUBMIT_TRANSACTION_FAILURE,
  RESET_FORM,
  UPDATE_DEFAULT_VALUE
} from '../actions/form.js';
import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';
import { EDIT_TRANSACTION, SET_SEARCH_MODE } from '../actions/app.js';
import { DATE_FIELD_FORMAT, TIME_FIELD_FORMAT } from '../util/constants.js';

// abstract this into a function so it can be called again later
// resetting the date and time to the current value when it's called
function createInitialValues(defaults = {}) {
  const now = new Date();
  return {
    amount: '',
    calculate: '',
    merchant: '',
    category: '',
    date: format(now, DATE_FIELD_FORMAT),
    time: format(now, TIME_FIELD_FORMAT),
    span: 1,
    memo: '',
    id: '',
    type: '',
    ...defaults
  };
}

function updateFieldsWithValues(fields, values) {
  return fields.map((field) => {
    return {
      ...field,
      value: values[field.name]
    };
  });
}

const fields = [
  {
    type: 'number',
    label: 'Amount',
    name: 'amount',
    placeholder: 'Amount',
    attributes: {
      min: 0,
      step: 'any',
      required: true
    }
  },
  {
    type: 'text',
    label: 'Calculate',
    name: 'calculate',
    placeholder: 'Calculate amount',
    afterButton: <ZapIcon />,
    tabindex: -1
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
    type: 'select',
    label: 'Category',
    name: 'category',
    placeholder: 'Select a category'
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
    type: 'textarea',
    name: 'memo',
    label: 'Memo',
    placeholder: 'Memo'
  },
  {
    type: 'hidden',
    name: 'id'
  }
];

const initialState = {
  action: 'add',
  defaultValues: {},
  values: createInitialValues(),
  fields: updateFieldsWithValues(fields, createInitialValues())
};

export default function form(state = initialState, action) {
  const searchDefaultValues = {
    date: '',
    time: '',
    span: ''
  };
  let newValues;
  switch (action.type) {
    case SUBMIT_TRANSACTION:
      return {
        ...state,
        pending: true,
        action: state.action === 'add' ? 'adding...' : 'updating...'
      };
    case SUBMIT_TRANSACTION_FAILURE:
      return {
        ...state,
        pending: false,
        action: state.action === 'adding...' ? 'add' : 'update'
      };
    case ADD_TRANSACTION_SUCCESS:
    case UPDATE_TRANSACTION_SUCCESS:
      // after successful save to the server, reset to initial values
      newValues = createInitialValues(state.defaultValues);
      return {
        ...state,
        pending: false,
        fields: updateFieldsWithValues(state.fields, newValues),
        values: newValues,
        action: 'add'
      };
    case RESET_FORM:
      newValues = createInitialValues(state.defaultValues);
      return {
        ...state,
        pending: false,
        fields: updateFieldsWithValues(state.fields, newValues),
        values: newValues
      };
    case INPUT_CHANGE:
      newValues = {
        ...state.values,
        [action.data.name]: action.data.value
      };

      return {
        ...state,
        values: newValues,
        fields: updateFieldsWithValues(state.fields, newValues)
      };
    case EDIT_TRANSACTION:
      newValues = {
        ...action.data,
        amount: fromCents(action.data.amount),
        date: format(new Date(action.data.date), DATE_FIELD_FORMAT),
        time: format(new Date(action.data.date), TIME_FIELD_FORMAT),
        calculate: ''
      };
      return {
        ...state,
        action: 'update',
        values: newValues,
        fields: updateFieldsWithValues(state.fields, newValues)
      };
    case UPDATE_DEFAULT_VALUE:
      newValues = {
        ...state.values,
        [action.data.name]: action.data.value
      };
      return {
        ...state,
        defaultValues: {
          ...state.defaultValues,
          [action.data.name]: action.data.value
        },
        // not just update the default values,
        // but also actual values and fields
        values: newValues,
        fields: updateFieldsWithValues(state.fields, newValues)
      };
    case SET_SEARCH_MODE:
      return {
        ...state,
        action: action.data ? 'search' : 'add',
        // reset values, except for type
        values: {
          type: state.values.type
        },
        defaultValues: action.data ? searchDefaultValues : {},
        fields: updateFieldsWithValues(
          state.fields,
          createInitialValues(action.data ? searchDefaultValues : undefined)
        )
      };
    default:
      return state;
  }
}
