import React from 'https://cdn.skypack.dev/react@17';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { ZapIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import { fromCents } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import {
  INPUT_CHANGE,
  SUBMIT_TRANSACTION,
  SUBMIT_TRANSACTION_FAILURE,
  RESET_FORM
} from '../actions/form.js';
import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';
import { EDIT_TRANSACTION, SET_SEARCH_MODE } from '../actions/app.js';
import { DATE_FIELD_FORMAT, TIME_FIELD_FORMAT } from '../util/constants.js';

// abstract this into a function so it can be called again later
// resetting the date and time to the current value when it's called
function createInitialValues(isSearch) {
  const now = new Date();
  return {
    amount: '',
    calculate: '',
    merchant: '',
    category: '',
    date: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    time: isSearch ? '' : format(now, TIME_FIELD_FORMAT),
    budgetStart: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    budgetEnd: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    memo: '',
    id: '',
    debitAccount: '',
    creditAccount: ''
  };
}

const amountField = {
  type: 'number',
  label: 'Amount',
  name: 'amount',
  placeholder: 'Amount',
  attributes: {
    min: 0,
    step: 'any',
    required: true
  }
};

const calculateField = {
  type: 'text',
  label: 'Calculate',
  name: 'calculate',
  placeholder: 'Calculate amount',
  afterButton: <ZapIcon />,
  tabindex: -1
};

const merchantField = {
  type: 'text',
  label: 'Merchant',
  name: 'merchant',
  placeholder: 'Merchant',
  attributes: {
    required: true,
    list: 'merchants-list'
  }
};

const categoryField = {
  type: 'select',
  label: 'Category',
  name: 'category',
  placeholder: 'Select a category'
};

const debitAccountField = {
  type: 'select',
  label: 'To',
  name: 'debitAccount',
  placeholder: 'To'
};

const creditAccountField = {
  type: 'select',
  label: 'From',
  name: 'creditAccount',
  placeholder: 'From'
};

const dateField = {
  type: 'date',
  label: 'Date',
  name: 'date',
  attributes: {
    required: true
  }
};

const timeField = {
  type: 'time',
  label: 'Time',
  name: 'time',
  attributes: {
    required: true
  }
};

const budgetStartField = {
  type: 'date',
  label: 'From',
  name: 'budgetStart',
  hint: 'The beginning date of the budget period',
  attributes: {
    required: true
  }
};

const budgetEndField = {
  type: 'date',
  label: 'Until',
  name: 'budgetEnd',
  hint: 'The end date of the budget period',
  attributes: {
    required: true
  }
};

const memoField = {
  type: 'textarea',
  name: 'memo',
  label: 'Memo',
  placeholder: 'Memo'
};

const idField = {
  type: 'hidden',
  name: 'id'
};

function getFormFields(syntheticType) {
  switch (syntheticType) {
    case 'expense':
      return [
        amountField,
        calculateField,
        merchantField,
        categoryField,
        dateField,
        timeField,
        budgetStartField,
        budgetEndField,
        memoField,
        idField
      ];
    case 'transfer':
      return [
        amountField,
        calculateField,
        debitAccountField,
        creditAccountField,
        dateField,
        timeField,
        memoField,
        idField
      ];
    case 'income':
    case 'deposit':
    case 'withdrawal':
    default:
      return [
        amountField,
        calculateField,
        merchantField,
        dateField,
        timeField,
        memoField,
        idField
      ];
  }
}

const initialState = {
  action: 'add',
  values: {
    ...createInitialValues(),
    syntheticType: 'expense'
  },
  fields: getFormFields('expense')
};

export default function form(state = initialState, action) {
  let newValues, newFields;
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
      newValues = createInitialValues(state.action == 'search');
      return {
        ...state,
        action: 'add',
        pending: false,
        values: newValues
      };
    case RESET_FORM:
      newValues = createInitialValues(state.action == 'search');
      return {
        ...state,
        action: 'add',
        pending: false,
        values: newValues
      };
    case INPUT_CHANGE:
      newValues = {
        ...state.values,
        [action.data.name]: action.data.value
      };
      newFields =
        action.data.name == 'syntheticType'
          ? getFormFields(action.data.value)
          : state.fields;

      return {
        ...state,
        values: newValues,
        fields: newFields
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
        fields: getFormFields(newValues.syntheticType),
        values: newValues
      };
    case SET_SEARCH_MODE:
      return {
        ...state,
        action: action.data ? 'search' : 'add',
        // reset values, except for type
        values: createInitialValues(action.data == 'search')
      };
    default:
      return state;
  }
}
