import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';
import {
  INTEND_TO_REMOVE_TRANSACTION,
  EDIT_TRANSACTION
} from '../actions/account';
import Transaction from '../components/transaction';
import WeekStats from '../containers/weekStats';

function editTransaction(transaction, event) {
  event.stopPropagation(); // avoid toggling the transaction as active
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
  const {
    offset,
    isLoading,
    visible,
    transactions,
    start,
    end,
    editTransaction,
    intendToRemoveTransaction,
    categories,
    sources,
    filter
  } = props;

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
              handleRemove={intendToRemoveTransaction.bind(null, tx)}
              handleEdit={editTransaction.bind(null, tx)}
              options={{
                categories,
                sources
              }}
              {...tx}
            />
          ))}
        </tbody>
      </table>
      <WeekStats offset={offset} />
    </div>
  );
}

Week.propTypes = {
  offset: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  visible: PropTypes.bool,
  transactions: PropTypes.array,
  start: PropTypes.object,
  end: PropTypes.object,
  editTransaction: PropTypes.func,
  intendToRemoveTransaction: PropTypes.func,
  stats: PropTypes.array,
  categories: PropTypes.array,
  sources: PropTypes.array,
  filter: PropTypes.string
};

function mapStateToProps(state, ownProps) {
  return {
    ...state.weeks[ownProps.offset],
    categories: state.account.categories,
    sources: state.account.sources
  };
}

export default connect(mapStateToProps, {
  editTransaction,
  intendToRemoveTransaction
})(Week);
