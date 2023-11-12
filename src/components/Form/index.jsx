import React, { useEffect, useRef, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@7';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import { ZapIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Field from './Field.js';
import {
  submitTransaction,
  inputChange,
  resetForm
} from '../../slices/form.js';
import { setSearchParams } from '../../slices/app.js';
import {
  addTransaction,
  updateTransaction
} from '../../actions/transactions.js';
import { SYNTHETIC_TYPES } from '../../util/transaction.js';
import Span from './Span.js';

function calculateString(str) {
  return Function(`"use strict"; return(${str})`)();
}

function Form() {
  const dispatch = useDispatch();
  const appReady = useSelector((state) => state.app.appReady);
  const datalists = useSelector((state) => ({
    'merchants-list': state.meta.merchants,
    'budget-span': ['1', '4', '12', '26']
  }));
  const { fields, action, values, pending } = useSelector(
    (state) => state.form
  );
  const fieldOptions = useSelector((state) => ({
    category: state.meta.expenseCategories,
    debitAccount: state.meta.accounts,
    creditAccount: state.meta.accounts,
    searchAccount: state.meta.accounts,
    syntheticType: SYNTHETIC_TYPES
  }));

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  }, [action]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      if (action == 'search') {
        dispatch(
          setSearchParams({
            // limit the number of attributes to search
            // to avoid overly narrow search
            amount: values.amount && (values.amount * 100).toFixed(),
            merchant: values.merchant,
            category: values.category,
            searchAccount: values.searchAccount
          })
        );
      } else if (action == 'update') {
        dispatch(submitTransaction());
        dispatch(updateTransaction(values, prevMerchantRef.current));
      } else {
        dispatch(submitTransaction());
        dispatch(addTransaction(values));
      }
    },
    [action, values]
  );

  let actionText;
  switch (action) {
    case 'add':
      actionText = pending ? 'adding...' : 'add';
      break;
    case 'update':
      actionText = pending ? 'updating...' : 'update';
      break;
    case 'search':
      actionText = pending ? 'searching...' : 'search';
      break;
  }

  return (
    <form className="new-transaction" method="POST">
      <>
        {fields.map((fieldConfig) => {
          const field = { ...fieldConfig };
          if (field.attributes && field.attributes.list) {
            field.datalist = datalists[field.attributes.list];
          }
          if (fieldOptions[field.name]) {
            field.options = fieldOptions[field.name];
          }
          let afterButton;
          if (field.name == 'calculate') {
            afterButton = <ZapIcon />;
          }
          if (field.name == 'budgetSpan') {
            afterButton = <Span />;
          }
          return (
            <Field
              key={field.name}
              handleChange={(event) => {
                dispatch(
                  inputChange({ name: field.name, value: event.target.value })
                );
              }}
              afterButton={afterButton}
              afterButtonAction={() => {
                if (field.name == 'calculate') {
                  if (!values.calculate) {
                    return;
                  }
                  const newAmount = calculateString(values.calculate).toFixed(
                    2
                  );

                  dispatch(inputChange({ name: 'amount', value: newAmount }));
                }
              }}
              disabled={!appReady}
              value={values[field.name]}
              {...field}
            />
          );
        })}
        <div className="actions">
          <Button
            variant="primary"
            type="submit"
            onClick={submitForm}
            {...buttonAttrs}
          >
            {actionText}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => dispatch(resetForm())}
            {...buttonAttrs}
          >
            Reset
          </Button>
        </div>
      </>
    </form>
  );
}

export default Form;
