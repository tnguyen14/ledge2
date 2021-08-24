import React from 'https://cdn.skypack.dev/react@17';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import Badge from 'https://cdn.skypack.dev/react-bootstrap@1/Badge';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import {
  PencilIcon,
  XIcon,
  ClockIcon,
  NoteIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import useToggle from '../../hooks/useToggle.js';
import {
  TIMEZONE,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DAY_FORMAT
} from '../../util/constants.js';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

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

  const notesPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-notes`
  });

  // show day as in origin timezone, while date in local timezone
  const displayDay = format(utcToZonedTime(date, TIMEZONE), DISPLAY_DAY_FORMAT);
  const displayDate = format(new Date(date), DISPLAY_DATE_FORMAT);
  return (
    <>
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
        <td data-field="category">
          {getValueFromOptions(options.categories, category)}
        </td>
        <td data-field="action">
          <button
            className={classnames({
              'has-description': !!description
            })}
            {...bindTrigger(notesPopupState)}
          >
            <NoteIcon />
          </button>
          <button onClick={handleEdit}>
            <PencilIcon />
          </button>
          <button onClick={handleRemove}>
            <XIcon />
          </button>
        </td>
      </tr>
      <Popover
        {...bindPopover(notesPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="notes-popover">
          <h4>Source</h4>
          <div>{getValueFromOptions(options.sources, source)}</div>
          {description && (
            <>
              <h4>Description</h4>
              <div>{description}</div>
            </>
          )}
        </div>
      </Popover>
    </>
  );
}

export default Transaction;
