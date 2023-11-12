import React, { useEffect, useRef, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@7';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import { ZapIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Field from './Field.js';
import Span from './Span.js';
import {
  submitTransaction,
  inputChange,
  resetForm
} from '../../slices/form.js';
import { updateMerchantCounts } from '../../slices/meta.js';
import { setSearchParams } from '../../slices/app.js';
import {
  updateTransactionSuccess,
  updateTransactionFailure,
  addTransactionSuccess,
  addTransactionFailure
} from '../../slices/transactions.js';
import {
  SYNTHETIC_TYPES,
  decorateTransaction,
  getUniqueTransactionId
} from '../../util/transaction.js';
import {
  postTransaction,
  patchTransaction,
  getTransactionsWithMerchantName
} from '../../util/api.js';
import {
  addMerchantToCounts,
  removeMerchantFromCounts
} from '../../util/merchants.js';

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
  const merchants_count = useSelector((state) => state.meta.merchants_count);

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  }, [action]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  const submitForm = useCallback(
    async (event) => {
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
      } else {
        dispatch(submitTransaction());
        const decoratedTransaction = decorateTransaction(values);
        if (action == 'update') {
          const id = values.id;
          const oldMerchant = prevMerchantRef.current;
          try {
            await patchTransaction({
              ...decoratedTransaction,
              id
            });
            dispatch(
              updateTransactionSuccess({
                ...decoratedTransaction,
                id
              })
            );
            if (values.merchant != oldMerchant) {
              const transactionsWithOldMerchantName =
                await getTransactionsWithMerchantName(oldMerchant);
              const updatedMerchantsCount = addMerchantToCounts(
                removeMerchantFromCounts(
                  merchants_count,
                  oldMerchant,
                  transactionsWithOldMerchantName.length
                ),
                values.merchant
              );
              dispatch(updateMerchantCounts(updatedMerchantsCount));
            }
          } catch (e) {
            console.error(e);
            dispatch(updateTransactionFailure());
          }
        } else {
          try {
            const id = await getUniqueTransactionId(
              new Date(decoratedTransaction.date).valueOf()
            );
            await postTransaction({
              ...decoratedTransaction,
              id
            });
            dispatch(
              addTransactionSuccess({
                ...decoratedTransaction,
                id
              })
            );
            const updatedMerchantsCount = addMerchantToCounts(
              merchants_count,
              values.merchant
            );
            dispatch(updateMerchantCounts(updatedMerchantsCount));
          } catch (e) {
            console.error(e);
            dispatch(addTransactionFailure());
          }
        }
      }
    },
    [action, values, merchants_count]
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
