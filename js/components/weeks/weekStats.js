import React from 'react';
import WeekCategory from './weekCategory';
import {
  calculateWeeklyTotal,
  getCategoriesTotalsStats
} from '../../selectors';
import { getWeekId } from '../../selectors/week';
import { getWeekById } from '../../selectors/transactions';
import { useSelector } from 'react-redux';
import { usd } from '@tridnguyen/money';
import { sum, average } from '../../util/calculate';

function WeekStats(props) {
  const { week, label } = props;
  const { weekId, transactions } = week;
  const categories = useSelector((state) => state.account.categories);
  const past4Weeks = useSelector((state) => [
    week,
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -1 })
    }),
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -2 })
    }),
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -3 })
    })
  ]);

  const rawTotal = sum(
    transactions.filter((tx) => !tx.carriedOver).map((t) => t.amount)
  );
  const rawTotalId = `raw-total-${weekId}`;

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
  const totalId = `total-${weekId}`;

  const past4WeeksSum = sum(past4Weeks.map(calculateWeeklyTotal));
  const past4WeeksAverage = average(past4Weeks.map(calculateWeeklyTotal));
  const past4WeeksAverageId = `average-past-4-weeks-${weekId}`;

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
          <tr key={totalId} className="stat" data-cat="total">
            <td id={totalId} className="stat-label">
              Total
            </td>
            <td aria-labelledby={totalId}>{usd(total)}</td>
          </tr>
          <tr
            key={past4WeeksAverageId}
            className="stat"
            data-cat="4-week-average"
          >
            <td id={past4WeeksAverageId} className="stat-label">
              4-week average
            </td>
            <td aria-labelledby={past4WeeksAverageId} data-sum={past4WeeksSum}>
              {usd(past4WeeksAverage)}
            </td>
          </tr>
          <tr key={rawTotalId} className="stat" data-cat="raw-total">
            <td id={rawTotalId} className="stat-label">
              Raw Total
            </td>
            <td aria-labelledby={rawTotalId}>{usd(rawTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WeekStats;
