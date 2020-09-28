import React from 'react';
import PropTypes from 'prop-types';
import WeekCategory from '../components/weekCategory';
import { getCategoriesTotalsStats, getTotalStat } from '../selectors/totals';
import { connect } from 'react-redux';
import { usd } from '@tridnguyen/money';

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

  const categoriesStats = getCategoriesTotalsStats({
    transactions,
    categories
  });

  const totalStat = getTotalStat({ transactions });
  const totalStatId = `${totalStat.slug}-${weekId}`;

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
          <tr key={totalStatId} className="stat">
            <td id={totalStatId} className="stat-label">
              {totalStat.label}
            </td>
            <td aria-labelledby={totalStatId}>{usd(totalStat.amount)}</td>
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
  categories: PropTypes.array
};

function mapStateToProps(state, ownProps) {
  return {
    categories: state.account.categories,
    transactions: state.weeks[ownProps.offset].transactions
  };
}

export default connect(mapStateToProps, null)(WeekStats);
