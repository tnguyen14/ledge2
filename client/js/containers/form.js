import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Field from '../components/field';
import {
  INPUT_CHANGE,
  RESET_FORM,
  SUBMIT_TRANSACTION_FAILURE,
  SUBMIT_TRANSACTION
} from '../actions/form';
import { addTransaction, updateTransaction } from '../actions/transaction';
import { loadAccount } from '../actions/account';
import { logout } from '../actions/user';

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
  const {
    fields,
    action,
    values,
    datalists,
    pending,
    resetForm,
    fieldOptions,
    loadAccount,
    addTransaction,
    updateTransaction,
    logout,
    inputChange
  } = props;

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  });

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
      submit();
      try {
        if (action == 'update') {
          updateTransaction(values, prevMerchantRef.current);
        } else {
          addTransaction(values);
        }
      } catch (err) {
        if (err.message == 'Unauthorized') {
          logout();
          return;
        }
        submitFailure(err);
      }
    },
    [action, values, updateTransaction, addTransaction, logout, submitFailure]
  );

  useEffect(loadAccount, []);

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
              inputChange(field.name, event.target.value);
            }}
            afterButtonAction={() => {
              if (field.name == 'calculate') {
                if (!values.calculate) {
                  return;
                }
                const newAmount = calculateString(values.calculate).toFixed(2);

                inputChange('amount', newAmount);
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
        onClick={resetForm}
        {...buttonAttrs}
      >
        Reset
      </Button>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  values: PropTypes.object,
  action: PropTypes.string.isRequired,
  focus: PropTypes.bool,
  pending: PropTypes.bool,
  addTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  logout: PropTypes.func,
  submitFailure: PropTypes.func,
  submit: PropTypes.func,
  datalists: PropTypes.shape({
    'merchants-list': PropTypes.array
  }),
  loadAccount: PropTypes.func,
  inputChange: PropTypes.func,
  resetForm: PropTypes.func,
  fieldOptions: PropTypes.shape({
    category: PropTypes.array.isRequired,
    source: PropTypes.array.isRequired
  })
};

function mapStateToProps(state) {
  return {
    ...state.form,
    datalists: {
      'merchants-list': state.account.merchants
    },
    fieldOptions: {
      category: state.account.categories,
      source: state.account.sources
    }
  };
}

export default connect(mapStateToProps, {
  loadAccount,
  inputChange,
  resetForm,
  addTransaction,
  updateTransaction,
  logout,
  submitFailure,
  submit
})(Form);
