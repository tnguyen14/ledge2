export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export function submit() {
  return {
    type: SUBMIT_TRANSACTION
  };
}

export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';
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

export const SET_SEARCH = 'SET_SEARCH';
export function setSearch(searchData) {
  return {
    type: SET_SEARCH,
    data: searchData
  };
}
