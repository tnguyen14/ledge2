import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';
import {
  INTEND_TO_REMOVE_TRANSACTION,
  EDIT_TRANSACTION
} from '../../actions/account';
import Transaction from './transaction';
import WeekStats from './weekStats';

function editTransaction(transaction) {
  return {
    type: EDIT_TRANSACTION,
    data: transaction
  };
}

function intendToRemoveTransaction(transaction) {
  return {
    type: INTEND_TO_REMOVE_TRANSACTION,
    data: transaction
  };
}

function Week(props) {
  const dispatch = useDispatch();
  const { offset } = props;
  const week = useSelector((state) => state.weeks[offset]);
  const categories = useSelector((state) => state.account.categories);
  const sources = useSelector((state) => state.account.sources);
  const filter = useSelector((state) => state.app.filter);
  const { isLoading, visible, transactions, start, end } = week;

  if (!visible) {
    return null;
  }

  const displayTransactions = transactions
    .filter((tx) => {
      // don't show carried over transactions
      return !tx.carriedOver;
    })
    .filter((tx) => {
      if (filter) {
        if (tx.merchant.toLowerCase().includes(filter)) {
          return true;
        }
        if (String(tx.amount).includes(filter)) {
          return true;
        }
        if (tx.category.includes(filter)) {
          return true;
        }
        if (tx.source.includes(filter)) {
          return true;
        }
        return false;
      }
      return true;
    });

  return (
    <div className="weekly">
      <h3 className="week-title">
        {start.format('MMM D')} - {end.format('MMM D')}
      </h3>
      <div className="transactions-loading">
        <PulseLoader loading={isLoading} />
      </div>
      <table className="weekly-transactions table table-striped">
        <thead>
          <tr>
            <th data-field="day">Day</th>
            <th data-field="merchant">Merchant</th>
            <th data-field="amount">Amount</th>
            <th data-field="source">Source</th>
            <th data-field="description" className="secondary">
              Desc.
            </th>
            <th data-field="category" className="secondary">
              Category
            </th>
            <th className="secondary" />
          </tr>
          <tr className="addition" />
        </thead>
        <tbody>
          {displayTransactions.map((tx) => (
            <Transaction
              key={tx.id}
              handleRemove={() => dispatch(intendToRemoveTransaction(tx))}
              handleEdit={(event) => {
                // avoid toggling the transaction as active
                event.stopPropagation();
                dispatch(editTransaction(tx));
              }}
              options={{
                categories,
                sources
              }}
              {...tx}
            />
          ))}
        </tbody>
      </table>
      <WeekStats offset={offset} isFiltering={filter != ''} />
    </div>
  );
}

export default Week;
