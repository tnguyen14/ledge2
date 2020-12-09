import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Badge from 'react-bootstrap/Badge';
import { usd } from '@tridnguyen/money';
import useToggle from '../hooks/useToggle';
import classnames from 'classnames';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { PencilIcon, XIcon, ClockIcon } from '@primer/octicons-react';

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
  const displayDate = moment(date).format('ddd');
  return (
    <tr
      className={classnames('transaction', {
        'table-active': active
      })}
      onClick={toggleActive}
      data-day={displayDate}
    >
      <td data-field="day">{displayDate}</td>
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
