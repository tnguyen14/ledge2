import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Field from '../components/field';
import {
  INPUT_CHANGE,
  RESET_FORM,
  SUBMIT_TRANSACTION_FAILURE,
  SUBMIT_TRANSACTION
} from '../actions/form';
import { addTransaction, updateTransaction } from '../actions/transaction';
import { logout, scheduleRenewal } from '../actions/user';

function submit() {
  return {
    type: SUBMIT_TRANSACTION
  };
}

function submitFailure(err) {
  return {
    type: SUBMIT_TRANSACTION_FAILURE,
    data: err
  };
}

function inputChange(name, value) {
  return {
    type: INPUT_CHANGE,
    data: {
      name,
      value
    }
  };
}

function resetForm() {
  return {
    type: RESET_FORM
  };
}

function calculateString(str) {
  return Function(`"use strict"; return(${str})`)();
}

function Form(props) {
  const dispatch = useDispatch();
  const datalists = useSelector((state) => ({
    'merchants-list': state.account.merchants
  }));
  const fieldOptions = useSelector((state) => ({
    category: state.account.categories,
    source: state.account.sources
  }));
  const { fields, action, values, pending } = useSelector(
    (state) => state.form
  );

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  }, [action]);

  let amountFieldRef = null;

  useEffect(() => {
    if (amountFieldRef) {
      amountFieldRef.focus();
    }
  }, [values.amount]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(submit());
      try {
        if (action == 'update') {
          dispatch(updateTransaction(values, prevMerchantRef.current));
        } else {
          dispatch(addTransaction(values));
        }
      } catch (err) {
        if (err.message == 'Unauthorized') {
          dispatch(logout());
          return;
        }
        dispatch(submitFailure(err));
      }
      dispatch(scheduleRenewal());
    },
    [action, values]
  );

  return (
    <form className="new-transaction" method="POST">
      <h2>Add a new transaction</h2>
      {fields.map((field) => {
        if (field.attributes && field.attributes.list) {
          field.datalist = datalists[field.attributes.list];
        }
        if (fieldOptions[field.name]) {
          field.options = fieldOptions[field.name];
        }
        return (
          <Field
            inputRef={(input) => {
              if (field.name == 'amount') {
                amountFieldRef = input;
              }
            }}
            key={field.name}
            handleChange={(event) => {
              dispatch(inputChange(field.name, event.target.value));
            }}
            afterButtonAction={() => {
              if (field.name == 'calculate') {
                if (!values.calculate) {
                  return;
                }
                const newAmount = calculateString(values.calculate).toFixed(2);

                dispatch(inputChange('amount', newAmount));
              }
            }}
            {...field}
          />
        );
      })}
      <Button
        variant="primary"
        className="float-right"
        type="submit"
        onClick={submitForm}
        {...buttonAttrs}
      >
        {action}
      </Button>
      <Button
        variant="outline-secondary"
        className="float-right"
        onClick={() => dispatch(resetForm())}
        {...buttonAttrs}
      >
        Reset
      </Button>
    </form>
  );
}

export default Form;
