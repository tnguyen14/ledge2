import React from 'react';
import PropTypes from 'prop-types';
import { usd } from '@tridnguyen/money';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import moment from 'moment-timezone';
import { ClockIcon } from '@primer/octicons-react';

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
        return (
          <li key={txn.id}>
            {moment(txn.date).format('MM/DD/YY')} ({txn.span}) {txn.merchant}{' '}
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
