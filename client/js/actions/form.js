import { postJson, patchJson } from '../util/fetch';
import { LOGOUT, scheduleRenewal } from './user';
import moment from 'moment-timezone';

const timezone = 'America/New_York';

export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';

export function submitForm(event) {
  event.preventDefault();
  return async (dispatch, getState) => {
    const {
      form: { action, values }
    } = getState();
    let entry = {
      ...values,
      calculate, // filter out calculate field
      amount: values.amount * 100
    };

    const isUpdating = action === 'update';
    const serverAction = isUpdating ? patchJson : postJson;
    const actionUrl = `${SERVER_URL}/accounts/${ACCOUNT_NAME}/transactions/${
      isUpdating ? entry.id : ''
    }`;
    const successActionType = isUpdating
      ? UPDATE_TRANSACTION_SUCCESS
      : ADD_TRANSACTION_SUCCESS;

    dispatch({
      type: SUBMIT_TRANSACTION
    });

    const {
      user: { idToken }
    } = getState();
    try {
      const response = await serverAction(idToken, actionUrl, entry);
      dispatch({
        type: successActionType,
        data: {
          ...entry,
          // pass back the old ID in case the transaction's ID
          // has been changed due to changed time
          oldId: entry.id,
          id: String(response.id),
          // replicate the conversion done on the server as the
          // date value is not returned
          date: moment.tz(entry.date + ' ' + entry.time, timezone).toISOString()
        }
      });
      scheduleRenewal()(dispatch, getState);
    } catch (err) {
      if (err.message == 'Unauthorized') {
        dispatch({
          type: LOGOUT
        });
        return;
      }
      dispatch({
        type: SUBMIT_TRANSACTION_FAILURE,
        data: err
      });
    }
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

function calculateString(str) {
  return Function(`"use strict"; return(${str})`)();
}

export function calculateAmount() {
  return function (dispatch, getState) {
    const {
      form: {
        values: { calculate }
      }
    } = getState();
    if (!calculate) {
      return;
    }
    const newAmount = calculateString(calculate).toFixed(2);

    dispatch(inputChange('amount', newAmount));
  };
}
