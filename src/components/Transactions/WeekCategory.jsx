import React from 'react';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import CompactTransaction from './CompactTransaction.jsx';

function WeekCategory(props) {
  const { slug, label, amount, weekId, transactions = [] } = props;
  const statId = `${slug}-${weekId}`;
  return (
    <tr key={statId} id={statId} className="stat" data-cat={slug}>
      <td className="stat-label">
        <span className="legend">&nbsp;</span>
        {label}
        <details>
          <summary></summary>
          <table className="table table-borderless category-transactions">
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <CompactTransaction transaction={txn} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </td>
      <td aria-labelledby={statId}>{usd(amount)}</td>
    </tr>
  );
}

export default WeekCategory;
