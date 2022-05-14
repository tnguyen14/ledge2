import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import WeekCategory from './WeekCategory.js';
import { getCategoriesTotals } from '../../selectors/stats.js';
import { getPastWeeksIds } from '../../selectors/week.js';
import {
  getWeekById,
  calculateSum,
  calculateWeeklyAverage
} from '../../selectors/transactions.js';
import { sum } from '../../util/calculate.js';

function WeekStats({ weekId, label }) {
  const numWeeks = 4;
  const categories = useSelector((state) => state.meta.expenseCategories);
  const pastWeeks = useSelector((state) =>
    getPastWeeksIds({
      weekId,
      numWeeks
    }).map((weekId) =>
      getWeekById({
        ...state,
        weekId
      })
    )
  );

  const thisWeek = pastWeeks[0];

  const rawTotal = calculateSum(thisWeek);
  const rawTotalId = `raw-total-${weekId}`;

  const transactions = thisWeek.transactions.filter(
    (tx) => tx.syntheticType == 'expense'
  );
  const transactionsByCategory = transactions.reduce((txnsByCat, txn) => {
    if (!txnsByCat[txn.category]) {
      txnsByCat[txn.category] = [txn];
    } else {
      txnsByCat[txn.category].push(txn);
    }
    return txnsByCat;
  }, {});

  const categoriesTotals = getCategoriesTotals({
    transactions,
    categories
  });

  const budgetTotal = sum(categoriesTotals.map((s) => s.amount));
  const budgetTotalId = `budget-total-${weekId}`;

  const pastWeeksAverage = calculateWeeklyAverage({
    transactions: Array.prototype.concat(
      ...pastWeeks.map((week) => week.transactions)
    ),
    numWeeks
  });
  const pastWeeksAverageId = `past-weeks-average-${weekId}`;

  return (
    <div className="stats week-stats">
      {label && <h4>{label}</h4>}
      <table className="table table-borderless">
        <tbody>
          <tr key={rawTotalId} className="stat" data-cat="raw-total">
            <td id={rawTotalId} className="stat-label">
              Raw Total
            </td>
            <td aria-labelledby={rawTotalId}>{usd(rawTotal)}</td>
          </tr>
          <tr key={pastWeeksAverageId} className="stat">
            <td id={pastWeeksAverageId} className="stat-label">
              Raw {numWeeks}-week Average
            </td>
            <td aria-labelledby={pastWeeksAverageId}>
              {usd(pastWeeksAverage)}
            </td>
          </tr>
          <tr key={budgetTotalId} className="stat" data-cat={budgetTotalId}>
            <td id={budgetTotalId} className="stat-label">
              Budget Total
            </td>
            <td aria-labelledby={budgetTotalId}>{usd(budgetTotal)}</td>
          </tr>
        </tbody>
      </table>
      <details>
        <summary>Category breakdown</summary>
        <table className="table table-borderless categories-stats">
          <tbody>
            {categoriesTotals.map((stat) => {
              const { slug, label, amount } = stat;
              return (
                <WeekCategory
                  key={slug}
                  slug={slug}
                  label={label}
                  amount={amount}
                  weekId={weekId}
                  transactions={transactionsByCategory[slug]}
                />
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default WeekStats;
