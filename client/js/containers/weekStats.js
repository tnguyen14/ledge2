import React from 'react';
import PropTypes from 'prop-types';
import WeekCategory from '../components/weekCategory';
import { getCategoriesTotalsStats, getTotalStat } from '../selectors/totals';
import { connect } from 'react-redux';

function WeekStats(props) {
  const { label, offset, transactions, categories } = props;
  const weekId = `week-${offset}`;
  const carriedOvers = transactions.filter((tx) => tx.carriedOver);
  const carriedOversByCategory = carriedOvers.reduce((txnsByCat, txn) => {
    if (!txnsByCat[txn.category]) {
      txnsByCat[txn.category] = [txn];
    } else {
      txnsByCat[txn.category].push(txn);
    }
    return txnsByCat;
  }, {});

  const stats = getCategoriesTotalsStats({
    transactions,
    categories
  }).concat(
    getTotalStat({
      transactions
    })
  );

  return (
    <div className="stats week-stats">
      {label && <h4>{label}</h4>}
      <table className="table">
        <tbody>
          {stats.map((stat) => {
            const { slug, label, amount } = stat;
            return (
              <WeekCategory
                key={slug}
                slug={slug}
                label={label}
                amount={amount}
                weekId={weekId}
                carriedOvers={carriedOversByCategory[slug]}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

WeekStats.propTypes = {
  label: PropTypes.string,
  offset: PropTypes.number.isRequired,
  transactions: PropTypes.array,
  categories: PropTypes.array
};

function mapStateToProps(state, ownProps) {
  return {
    categories: state.account.categories,
    transactions: state.weeks[ownProps.offset].transactions
  };
}

export default connect(mapStateToProps, null)(WeekStats);
