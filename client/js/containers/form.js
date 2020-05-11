import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Field from '../components/field';
import { submitForm, inputChange, resetForm } from '../actions/form';
import { loadAccount } from '../actions/account';

function Form(props) {
  const amount = props.fields.find((field) => field.name == 'amount').value;
  useEffect(props.loadAccount, []);

  let amountFieldRef = useRef();

  useEffect(() => {
    if (amountFieldRef) {
      amountFieldRef.focus();
    }
  }, [amount]);

  const {
    fields,
    action,
    datalists,
    submitForm,
    pending,
    resetForm,
    fieldOptions
  } = props;
  const buttonAttrs = {
    disabled: Boolean(pending)
  };

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
              props.inputChange(field.name, event.target.value);
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
  action: PropTypes.string.isRequired,
  focus: PropTypes.bool,
  pending: PropTypes.bool,
  submitForm: PropTypes.func,
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
  submitForm,
  loadAccount,
  inputChange,
  resetForm
})(Form);
