import React from 'react';
import PropTypes from 'prop-types';
import { usd } from '@tridnguyen/money';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { ClockIcon } from '@primer/octicons-react';
import { TIMEZONE } from '../../util/constants';

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

WeekCategory.propTypes = {
  slug: PropTypes.string,
  label: PropTypes.string,
  amount: PropTypes.number,
  weekId: PropTypes.string,
  carriedOvers: PropTypes.array
};

export default WeekCategory;
