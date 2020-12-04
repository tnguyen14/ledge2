import { postJson, patchJson } from '../util/fetch';
import { decorateTransaction } from '../util/transaction';
import { LOGOUT, scheduleRenewal } from './user';
import moment from 'moment-timezone';

const timezone = 'America/New_York';

export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';

async function addTransaction(idToken, transaction) {
  const response = await postJson(idToken, `${SERVER_URL}/items`, transaction);
  return ADD_TRANSACTION_SUCCESS;
}

async function updateTransaction(idToken, transaction) {
  const response = await patchJson(
    idToken,
    `${SERVER_URL}/items/${transaction.id}`,
    transaction
  );
  return UPDATE_TRANSACTION_SUCCESS;
}

export function submitForm(event) {
  event.preventDefault();
  return async (dispatch, getState) => {
    const {
      form: { action, values }
    } = getState();
    let entry = {
      ...values
    };
    // remove calculate
    delete entry.calculate;

    const serverAction =
      action == 'update' ? updateTransaction : addTransaction;

    dispatch({
      type: SUBMIT_TRANSACTION
    });

    const {
      user: { idToken }
    } = getState();
    try {
      const transaction = await decorateTransaction(idToken, entry);
      const action = await serverAction(idToken, transaction);
      dispatch({
        type: action,
        data: transaction
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
