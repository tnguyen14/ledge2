import { postJson, patchJson } from '../util/fetch';
import { decorateTransaction } from '../util/transaction';
import { LOGOUT, scheduleRenewal } from './user';
import moment from 'moment-timezone';

const timezone = 'America/New_York';

export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';

export function submit() {
  return {
    type: SUBMIT_TRANSACTION
  };
}

export function submitFailure(err) {
  return {
    type: SUBMIT_TRANSACTION_FAILURE,
    data: err
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
