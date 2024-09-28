import React, {
  useEffect,
  useRef,
  useCallback
} from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';
import { ZapIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Field from './Field.jsx';
import Span from './Span.jsx';
import {
  submitTransaction,
  submitTransactionFailure,
  inputChange,
  resetForm
} from '../../slices/form.js';
import {
  updateMerchantCounts,
  addRecurringTransaction,
  updateRecurringTransaction
} from '../../slices/meta.js';
import { setSearchParams, setSearchMode } from '../../slices/app.js';
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
  const appIsSearch = useSelector((state) => state.app.isSearch);
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
    syntheticType: SYNTHETIC_TYPES.concat({
      slug: 'recurring',
      value: 'Recurring'
    }),
    recurrencePeriod: [
      {
        slug: 'week',
        value: 'Week'
      },
      {
        slug: 'month',
        value: 'Month'
      },
      {
        slug: 'year',
        value: 'Year'
      }
    ],
    recurrenceDay: state.form.recurrenceDays
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
        let decoratedTransaction;
        try {
          decoratedTransaction = decorateTransaction(values);
        } catch (e) {
          console.error(e);
          dispatch(submitTransactionFailure());
          return;
        }
        if (action == 'update') {
          try {
            if (values.syntheticType == 'recurring') {
              dispatch(
                updateRecurringTransaction({
                  id: values.id,
                  amount: decoratedTransaction.amount,
                  date: decoratedTransaction.date,
                  merchant: decoratedTransaction.merchant,
                  category: decoratedTransaction.category,
                  debitAccount: decoratedTransaction.debitAccount,
                  creditAccount: decoratedTransaction.creditAccount,
                  recurrenceFrequency: values.recurrenceFrequency,
                  recurrencePeriod: values.recurrencePeriod,
                  recurrenceDay: values.recurrenceDay,
                  recurrenceEndDate: values.recurrenceEndDate
                })
              );
            } else {
              const id = values.id;
              const oldMerchant = prevMerchantRef.current;
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
              if (decoratedTransaction.merchant != oldMerchant) {
                const transactionsWithOldMerchantName =
                  await getTransactionsWithMerchantName(oldMerchant);
                const updatedMerchantsCount = addMerchantToCounts(
                  removeMerchantFromCounts(
                    merchants_count,
                    oldMerchant,
                    transactionsWithOldMerchantName.length
                  ),
                  decoratedTransaction.merchant
                );
                dispatch(updateMerchantCounts(updatedMerchantsCount));
              }
              // If updating an transaction while in search mode
              // the app.isSearch is still set to true, but the form
              // would reset to "add". Dispatching app setSearchMode to
              // switch the form back to search
              dispatch(setSearchMode(appIsSearch));
            }
          } catch (e) {
            console.error(e);
            dispatch(updateTransactionFailure());
          }
        } else if (action == 'add') {
          try {
            if (values.syntheticType == 'recurring') {
              dispatch(
                addRecurringTransaction({
                  id: new Date().valueOf(),
                  amount: decoratedTransaction.amount,
                  date: decoratedTransaction.date,
                  merchant: decoratedTransaction.merchant,
                  category: decoratedTransaction.category,
                  debitAccount: decoratedTransaction.debitAccount,
                  creditAccount: decoratedTransaction.creditAccount,
                  recurrenceFrequency: values.recurrenceFrequency,
                  recurrencePeriod: values.recurrencePeriod,
                  recurrenceDay: values.recurrenceDay,
                  recurrenceEndDate: values.recurrenceEndDate
                })
              );
            } else {
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
                decoratedTransaction.merchant
              );
              dispatch(updateMerchantCounts(updatedMerchantsCount));
            }
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
