import React from 'https://cdn.skypack.dev/react@16';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import Popover from 'https://cdn.skypack.dev/react-bootstrap@1/Popover';
import OverlayTrigger from 'https://cdn.skypack.dev/react-bootstrap@1/OverlayTrigger';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { ClockIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { TIMEZONE } from '../../util/constants.js';

function WeekCategory(props) {
  const { slug, label, amount, weekId, carriedOvers = [] } = props;
  const statId = `${slug}-${weekId}`;
  const popover = (
    <Popover
      id={`carried-${statId}`}
      className="carriedover-transactions"
      title="Carried-over transactions"
    >
      {carriedOvers.map((txn) => {
        const dateInZone = utcToZonedTime(txn.date, TIMEZONE);
        return (
          <li key={txn.id}>
            {format(dateInZone, 'MM/dd/yy')} ({txn.span}) {txn.merchant}{' '}
            {usd(txn.amount)}{' '}
          </li>
        );
      })}
    </Popover>
  );
  return (
    <tr key={statId} className="stat" data-cat={slug}>
      {carriedOvers.length ? (
        <OverlayTrigger trigger="click" overlay={popover}>
          <td id={statId} className={`stat-label carried-over`}>
            <span className="legend">&nbsp;</span>
            {label}
            <span className="span-hint">
              <ClockIcon />
            </span>
          </td>
        </OverlayTrigger>
      ) : (
        <td id={statId} className="stat-label">
          <span className="legend">&nbsp;</span>
          {label}
        </td>
      )}
      <td aria-labelledby={statId}>{usd(amount)}</td>
    </tr>
  );
}

export default WeekCategory;
