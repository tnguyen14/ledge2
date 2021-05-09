import React from 'https://cdn.skypack.dev/react@16';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { ClockIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { TIMEZONE } from '../../util/constants.js';

function WeekCategory(props) {
  const { slug, label, amount, weekId, carriedOvers = [] } = props;
  const statId = `${slug}-${weekId}`;
  return (
    <tr key={statId} id={statId} className="stat" data-cat={slug}>
      <td className="stat-label">
        <span className="legend">&nbsp;</span>
        {label}
        {carriedOvers.length && (
          <details className="span-hint">
            <summary>
              <ClockIcon />
            </summary>
            <ul>
              {carriedOvers.map((txn) => {
                const dateInZone = utcToZonedTime(txn.date, TIMEZONE);
                return (
                  <li key={txn.id}>
                    {format(dateInZone, 'MM/dd/yy')} ({txn.span}) {txn.merchant}{' '}
                    {usd(txn.amount)}{' '}
                  </li>
                );
              })}
            </ul>
          </details>
        )}
      </td>
      <td aria-labelledby={statId}>{usd(amount)}</td>
    </tr>
  );
}

export default WeekCategory;
