import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';
import format from 'date-fns/format';
import getDaysInMonth from 'date-fns/getDaysInMonth';
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
import { addRecurringTransaction, updateRecurringTransaction } from './meta.js';

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

const recurrenceFrequencyField = {
  type: 'number',
  name: 'recurrenceFrequency',
  label: 'Every',
  attributes: {
    min: 1,
    step: 1,
    required: true
  }
};

const recurrencePeriodField = {
  type: 'select',
  name: 'recurrencePeriod',
  label: 'Period'
};

const recurrenceDay = {
  type: 'select',
  name: 'recurrenceDay',
  label: 'Day'
};

const recurrenceEndDateField = {
  type: 'date',
  label: 'Until',
  name: 'recurrenceEndDate'
};

const idField = {
  type: 'hidden',
  name: 'id'
};

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
    creditAccount,
    debitAccount
  };
}

/**
 * @param {string} period
 * @param {Date} date
 * @returns {string[]}
 */
function getRecurrenceDayValues(period, date) {
  if (period == 'week') {
    return [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ].map((day) => ({ value: day, slug: day }));
  }
  if (period == 'month') {
    const daysInMonth = getDaysInMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => ({
      slug: day,
      value: day
    }));
  }
  if (period == 'year') {
    const daysInMonth = getDaysInMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => ({
      slug: `${format(date, 'MMM')} ${day}`,
      value: `${format(date, 'MMM')} ${day}`
    }));
  }
}

function getRecurrenceDay(period, date) {
  if (period == 'week') {
    return format(date, 'EEEE');
  }
  if (period == 'month') {
    return format(date, 'd');
  }
  if (period == 'year') {
    return format(date, 'MMM d');
  }
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
    case 'recurring':
      return [
        creditAccountField,
        debitAccountField,
        amountField,
        calculateField,
        merchantField,
        categoryField,
        dateField,
        timeField,
        recurrenceFrequencyField,
        recurrencePeriodField,
        recurrenceDay,
        recurrenceEndDateField,
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
    syntheticType: 'expense',
    debitAccount: '',
    creditAccount: '',
    recurrenceFrequency: 1,
    recurrencePeriod: 'week',
    recurrenceDay: format(now, 'EEEE'),
    recurrenceEndDate: ''
  };
}
const initialValues = createInitialValues(false);
const initialState = {
  action: 'add',
  pending: false,
  values: {
    ...initialValues,
    ...getAccountsValues(initialValues.syntheticType)
  },
  fields: getFormFields(initialValues.syntheticType),
  recurrenceDays: getRecurrenceDayValues(
    initialValues.recurrencePeriod,
    new Date(`${initialValues.date} ${initialValues.time}`)
  )
};

const form = createSlice({
  name: 'form',
  initialState,
  reducers: {
    submitTransaction: (state) => {
      state.pending = true;
      return state;
    },
    submitTransactionFailure: (state) => {
      state.pending = false;
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
        const newDate = new Date(
          `${action.payload.value} ${state.values.time}`
        );
        state.recurrenceDays = getRecurrenceDayValues(
          state.values.recurrencePeriod,
          newDate
        );
        state.values.recurrenceDay = getRecurrenceDay(
          state.values.recurrencePeriod,
          newDate
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
        // this could be handled by getAccountsValues,
        // but handling it manually here as it's not a strict mapping
        // these accounts are just most likely values
        if (action.payload.value == 'recurring') {
          state.values.creditAccount = 'cash';
          state.values.debitAccount = 'expense';
        }
      }
      if (action.payload.name == 'recurrencePeriod') {
        const newDate = new Date(`${state.values.date} ${state.values.time}`);
        state.recurrenceDays = getRecurrenceDayValues(
          action.payload.value,
          newDate
        );
        state.values.recurrenceDay = getRecurrenceDay(
          action.payload.value,
          newDate
        );
      }
    },
    resetForm: (state) => {
      const resetValues = createInitialValues(state.action == 'search');
      if (state.action == 'update') {
        state.action = 'add';
      }
      state.values = {
        ...resetValues,
        ...getAccountsValues(state.values.syntheticType),
        syntheticType: state.values.syntheticType
      };
      state.recurrenceDays = getRecurrenceDayValues(
        resetValues.recurrencePeriod,
        new Date(`${resetValues.date} ${resetValues.time}`)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(editTransaction, (state, action) => {
        const transactionDate = new Date(action.payload.date);
        state.action = 'update';
        state.values = {
          ...action.payload,
          amount: fromCents(action.payload.amount),
          date: action.payload.date
            ? format(transactionDate, DATE_FIELD_FORMAT)
            : undefined,
          time: action.payload.date
            ? format(transactionDate, TIME_FIELD_FORMAT)
            : undefined,
          budgetStart: action.payload.budgetStart
            ? format(new Date(action.payload.budgetStart), DATE_FIELD_FORMAT)
            : undefined,
          budgetEnd: action.payload.budgetEnd
            ? format(new Date(action.payload.budgetEnd), DATE_FIELD_FORMAT)
            : undefined,
          calculate: ''
        };
        state.recurrenceDays = getRecurrenceDayValues(
          action.payload.recurrencePeriod,
          transactionDate
        );
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
        isAnyOf(
          addTransactionSuccess,
          updateTransactionSuccess,
          addRecurringTransaction.fulfilled,
          updateRecurringTransaction.fulfilled
        ),
        (state) => {
          state.pending = false;
          state.values = {
            ...createInitialValues(state.action == 'search'),
            ...getAccountsValues(state.values.syntheticType),
            syntheticType: state.values.syntheticType
          };
          state.action = 'add';
        }
      )
      .addMatcher(
        isAnyOf(addTransactionFailure, updateTransactionFailure),
        (state) => {
          state.pending = false;
        }
      );
  }
});

export const {
  submitTransaction,
  submitTransactionFailure,
  inputChange,
  resetForm
} = form.actions;
export default form.reducer;
