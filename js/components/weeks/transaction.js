import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Badge from 'react-bootstrap/Badge';
import { usd } from '@tridnguyen/money';
import classnames from 'classnames';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { PencilIcon, XIcon, ClockIcon } from '@primer/octicons-react';
import useToggle from '../../hooks/useToggle';
import {
  TIMEZONE,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DAY_FORMAT
} from '../../util/constants';

function getValueFromOptions(options, slug) {
  let option = options.find((opt) => opt.slug === slug);
  if (option) {
    return option.value;
  }
}

function Transaction(props) {
  const [active, toggleActive] = useToggle(false);
  const [showSpanHint, toggleSpanHint] = useToggle(false);
  const [spanHintTarget, setSpanHintTarget] = useState();

  const {
    id,
    date,
    amount,
    merchant,
    category,
    source,
    description,
    span,
    handleEdit,
    handleRemove,
    options
  } = props;
  const dateInZone = utcToZonedTime(date, TIMEZONE);
  const displayDate = format(dateInZone, DISPLAY_DATE_FORMAT);
  const displayDay = format(dateInZone, DISPLAY_DAY_FORMAT);
  return (
    <tr
      className={classnames('transaction', {
        'table-active': active
      })}
      onClick={toggleActive}
      data-day={displayDay}
    >
      <td data-field="day" title={displayDate}>
        {displayDay}
      </td>
      <td data-field="merchant">{merchant}</td>
      <td data-field="amount" data-cat={category}>
        <Badge pill>{usd(amount)}</Badge>
        {span > 1 ? (
          <span>
            <Overlay
              target={spanHintTarget}
              show={showSpanHint}
              placement="top"
            >
              <Tooltip id={`${id}-span-hint`}>Span {span} weeks</Tooltip>
            </Overlay>
            <span
              ref={setSpanHintTarget}
              className="span-hint"
              onClick={(e) => {
                toggleSpanHint();
                e.stopPropagation();
              }}
            >
              <ClockIcon />
            </span>
          </span>
        ) : null}
      </td>
      <td data-field="source">
        {getValueFromOptions(options.sources, source)}
      </td>
      <td data-field="description">{description}</td>
      <td data-field="category">
        {getValueFromOptions(options.categories, category)}
      </td>
      <td data-field="action">
        <a className="edit" onClick={handleEdit}>
          <PencilIcon />
        </a>
        <a className="remove" onClick={handleRemove}>
          <XIcon />
        </a>
      </td>
    </tr>
  );
}

Transaction.propTypes = {
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  merchant: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  span: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  description: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  options: PropTypes.shape({
    categories: PropTypes.array,
    sources: PropTypes.array
  })
};

export default Transaction;
