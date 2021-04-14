import React from 'react';
import WeekCategory from './weekCategory';
import {
  calculateWeeklyAverage,
  calculateWeeklyTotal,
  getCategoriesTotalsStats
} from '../../selectors';
import { useSelector } from 'react-redux';
import { usd } from '@tridnguyen/money';
import { sum } from '../../util/calculate';

function WeekStats(props) {
  const { offset, label } = props;
  const categories = useSelector((state) => state.account.categories);
  const transactions = useSelector((state) => state.weeks[offset].transactions);
  const filter = useSelector((state) => state.app.filter);
  const past4Weeks = useSelector((state) => [
    state.weeks[offset],
    state.weeks[offset - 1],
    state.weeks[offset - 2],
    state.weeks[offset - 3]
  ]);

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

  // don't show stats when filtering
  if (filter != '') {
    return null;
  }
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
          <tr key={totalStatId} className="stat" data-cat="total">
            <td id={totalStatId} className="stat-label">
              Total
            </td>
            <td aria-labelledby={totalStatId}>{usd(total)}</td>
          </tr>
          <tr key={past4WeeksId} className="stat" data-cat={past4WeeksId}>
            <td className={past4WeeksId} className="stat-label">
              4-week average
            </td>
            <td data-sum={sum(past4Weeks.map(calculateWeeklyTotal))}>
              {usd(calculateWeeklyAverage(past4Weeks))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WeekStats;
