import { createSlice } from 'https://esm.sh/@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';
import { format } from 'https://esm.sh/date-fns@2';
import { fromCents } from 'https://esm.sh/@tridnguyen/money@1';
import { DATE_FIELD_FORMAT, TIME_FIELD_FORMAT } from '../util/constants.js';
import { getWeeksDifference } from '../selectors/week.js';
import { setSearchMode, editTransaction } from './app.js';
import {
  addTransactionSuccess,
  addTransactionFailure,
  updateTransactionSuccess,
  updateTransactionFailure
} from './transactions.js';

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

const searchAccountField = {
  type: 'select',
  label: 'Account',
  name: 'searchAccount',
  placeholder: 'Account'
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

const budgetSpanField = {
  type: 'range',
  name: 'budgetSpan',
  label: 'Span',
  attributes: {
    min: 1,
    step: 1,
    max: 52,
    list: 'budget-span'
  }
};

const budgetStartField = {
  type: 'date',
  label: 'From',
  name: 'budgetStart',
  attributes: {
    required: true
  }
};

const budgetEndField = {
  type: 'date',
  label: 'Until',
  name: 'budgetEnd',
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

const syntheticTypeField = {
  type: 'select',
  name: 'syntheticType',
  label: 'Type'
};

const idField = {
  type: 'hidden',
  name: 'id'
};
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
    budgetSpan: 1,
    budgetStart: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    budgetEnd: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    memo: '',
    id: '',
    debitAccount: '',
    creditAccount: ''
  };
}

function getAccountsValues(syntheticType) {
  let creditAccount = '';
  let debitAccount = '';
  switch (syntheticType) {
    case 'expense':
      debitAccount = 'expense';
      creditAccount = 'cash';
      break;
    case 'income':
      debitAccount = 'cash';
      creditAccount = 'income';
      break;
  }
  return {
    syntheticType,
    creditAccount,
    debitAccount
  };
}

function getFormFields(syntheticType, isSearch) {
  if (isSearch) {
    return [
      amountField,
      searchAccountField,
      merchantField,
      categoryField,
      dateField,
      timeField,
      memoField,
      idField
    ];
  }
  switch (syntheticType) {
    case 'expense':
      return [
        creditAccountField,
        debitAccountField,
        amountField,
        calculateField,
        merchantField,
        categoryField,
        dateField,
        timeField,
        budgetStartField,
        budgetEndField,
        budgetSpanField,
        memoField,
        syntheticTypeField,
        idField
      ];
    case 'transfer':
    default:
      return [
        creditAccountField,
        debitAccountField,
        amountField,
        calculateField,
        merchantField,
        dateField,
        timeField,
        memoField,
        syntheticTypeField,
        idField
      ];
  }
}
const defaultSyntheticType = 'expense';
const initialState = {
  action: 'add',
  pending: false,
  values: {
    ...createInitialValues(),
    ...getAccountsValues(defaultSyntheticType)
  },
  fields: getFormFields(defaultSyntheticType)
};

const form = createSlice({
  name: 'form',
  initialState,
  reducers: {
    submitTransaction: (state) => {
      state.pending = true;
    },
    inputChange: (state, action) => {
      state.values[action.payload.name] = action.payload.value;
      if (action.payload.name == 'date') {
        state.values.budgetStart = action.payload.value;
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${state.values.budgetStart} 00:00`))
            .plus({ weeks: state.values.budgetSpan - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'budgetStart') {
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${action.payload.value} 00:00`))
            .plus({ weeks: state.values.budgetSpan - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'budgetEnd') {
        state.values.budgetSpan =
          getWeeksDifference({
            dateStart: new Date(
              `${state.values.budgetEnd} 00:00`
            ).toISOString(),
            dateEnd: new Date(`${state.values.budgetStart} 00:00`).toISOString()
          }) + 1;
      }
      if (action.payload.name == 'budgetSpan') {
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${state.values.budgetStart} 00:00`))
            .plus({ weeks: action.payload.value - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'syntheticType') {
        state.fields = getFormFields(action.payload.value);
        state.values = {
          ...state.values,
          ...getAccountsValues(state.values.syntheticType)
        };
      }
    },
    resetForm: (state) => {
      state.values = {
        ...createInitialValues(state.action == 'search'),
        ...getAccountsValues(state.values.syntheticType)
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(editTransaction, (state, action) => {
        state.action = 'update';
        state.values = {
          ...action.payload,
          amount: fromCents(action.payload.amount),
          date: format(new Date(action.payload.date), DATE_FIELD_FORMAT),
          time: format(new Date(action.payload.date), TIME_FIELD_FORMAT),
          budgetStart: format(
            new Date(action.payload.budgetStart),
            DATE_FIELD_FORMAT
          ),
          budgetEnd: format(
            new Date(action.payload.budgetEnd),
            DATE_FIELD_FORMAT
          ),
          calculate: ''
        };
        state.fields = getFormFields(state.values.syntheticType);
      })
      .addCase(setSearchMode, (state, action) => {
        state.action = action.payload ? 'search' : 'add';
        state.values = {
          ...createInitialValues(action.payload),
          ...getAccountsValues(state.values.syntheticType)
        };
        state.fields = getFormFields(
          state.values.syntheticType,
          action.payload
        );
      })
      .addMatcher(
        (action) =>
          [addTransactionSuccess.type, updateTransactionSuccess.type].includes(
            action.type
          ),
        (state) => {
          state.pending = false;
          state.values = {
            ...createInitialValues(state.action == 'search'),
            ...getAccountsValues(state.values.syntheticType)
          };
          state.action = 'add';
        }
      )
      .addMatcher(
        (action) =>
          [addTransactionFailure.type, updateTransactionFailure.type].includes(
            action.type
          ),
        (state) => {
          state.pending = false;
        }
      );
  }
});

export const { submitTransaction, inputChange, resetForm } = form.actions;
export default form.reducer;
