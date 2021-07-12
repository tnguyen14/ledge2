import React from 'https://cdn.skypack.dev/react@17';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import Badge from 'https://cdn.skypack.dev/react-bootstrap@1/Badge';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import {
  PencilIcon,
  XIcon,
  ClockIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import useToggle from '../../hooks/useToggle.js';
import {
  TIMEZONE,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DAY_FORMAT
} from '../../util/constants.js';

function getValueFromOptions(options, slug) {
  let option = options.find((opt) => opt.slug === slug);
  if (option) {
    return option.value;
  }
}

function Transaction(props) {
  const [active, toggleActive] = useToggle(false);
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

  // show day as in origin timezone, while date in local timezone
  const displayDay = format(utcToZonedTime(date, TIMEZONE), DISPLAY_DAY_FORMAT);
  const displayDate = format(date, DISPLAY_DATE_FORMAT);
  return (
    <tr
      id={id}
      className={classnames('transaction', {
        'table-active': active
      })}
      onClick={toggleActive}
      data-day={displayDay}
      data-date={date}
    >
      <td data-field="day">
        <Tooltip title={displayDate}>
          <span>{displayDay}</span>
        </Tooltip>
      </td>
      <td data-field="merchant">{merchant}</td>
      <td data-field="amount" data-cat={category}>
        <Badge pill>{usd(amount)}</Badge>
        {span > 1 ? (
          <Tooltip title={`Span ${span} weeks`}>
            <span className="span-hint">
              <ClockIcon />
            </span>
          </Tooltip>
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

export default Transaction;
