import React from 'react';
import PropTypes from 'prop-types';
import WeekCategory from '../components/weekCategory';
import { calculateWeeklyAverage, getCategoriesTotalsStats } from '../selectors';
import { connect } from 'react-redux';
import { usd } from '@tridnguyen/money';
import { sum } from '../util/calculate';

function WeekStats(props) {
  const { label, offset, transactions, categories, past4Weeks } = props;
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

  const categoriesStats = getCategoriesTotalsStats({
    transactions,
    categories
  });

  const total = sum(categoriesStats.map((s) => s.amount));
  const totalStatId = `total-${weekId}`;

  const past4WeeksId = `average-past-4-weeks`;

  return (
    <div className="stats week-stats">
      {label && <h4>{label}</h4>}
      <table className="table">
        <tbody>
          {categoriesStats.map((stat) => {
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
          <tr key={totalStatId} className="stat total">
            <td id={totalStatId} className="stat-label">
              Total
            </td>
            <td aria-labelledby={totalStatId}>{usd(total)}</td>
          </tr>
          <tr key={past4WeeksId} className="stat">
            <td id={past4WeeksId} className="stat-label">
              4-week average
            </td>
            <td>{usd(calculateWeeklyAverage(past4Weeks))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

WeekStats.propTypes = {
  label: PropTypes.string,
  offset: PropTypes.number.isRequired,
  transactions: PropTypes.array,
  categories: PropTypes.array,
  past4Weeks: PropTypes.array
};

function mapStateToProps(state, ownProps) {
  return {
    categories: state.account.categories,
    transactions: state.weeks[ownProps.offset].transactions,
    past4Weeks: [
      state.weeks[ownProps.offset],
      state.weeks[ownProps.offset - 1],
      state.weeks[ownProps.offset - 2],
      state.weeks[ownProps.offset - 3]
    ]
  };
}

export default connect(mapStateToProps, null)(WeekStats);
