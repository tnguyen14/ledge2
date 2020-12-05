import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Field from '../components/field';
import { inputChange, resetForm, submitFailure, submit } from '../actions/form';
import { addTransaction, updateTransaction } from '../actions/transaction';
import { loadAccount } from '../actions/account';
import { logout } from '../actions/user';

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
  const amount = fields.find((field) => field.name == 'amount').value;
  const merchant = fields.find((field) => field.name == 'merchant').value;

  useEffect(loadAccount, []);

  let amountFieldRef = useRef();

  useEffect(() => {
    if (amountFieldRef) {
      amountFieldRef.focus();
    }
  }, [amount]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  function submitForm(event) {
    event.preventDefault();
    submit();
    try {
      if (action == 'update') {
        updateTransaction(values, merchant);
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
  }

  function calculateString(str) {
    return Function(`"use strict"; return(${str})`)();
  }

  function calculateAmount() {
    if (!values.calculate) {
      return;
    }
    const newAmount = calculateString(values.calculate).toFixed(2);

    inputChange('amount', newAmount);
  }

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
                calculateAmount();
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
