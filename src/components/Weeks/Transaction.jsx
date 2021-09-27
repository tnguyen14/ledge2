import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import Badge from 'https://cdn.skypack.dev/react-bootstrap@1/Badge';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import {
  KebabHorizontalIcon,
  ClockIcon,
  NoteIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import useToggle from '../../hooks/useToggle.js';
import { TIMEZONE, DISPLAY_DATE_FORMAT } from '../../util/constants.js';
import { getValueFromOptions } from '../../util/slug.js';
import {
  editTransaction,
  intendToRemoveTransaction
} from '../../actions/app.js';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function Transaction(props) {
  const dispatch = useDispatch();
  const { transaction, dateFormat } = props;
  const {
    id,
    date,
    amount,
    merchant,
    category,
    source,
    type,
    description,
    span
  } = transaction;

  const categories = useSelector((state) => state.account.categories[type]);
  const sources = useSelector((state) => state.account.sources[type]);
  const types = useSelector((state) =>
    state.account.types.in.concat(state.account.types.out)
  );

  const typePopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-type`
  });
  const notesPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-notes`
  });
  const datePopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-date`
  });
  const categoryPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-category`
  });
  const spanPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-span`
  });
  const actionsPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-actions`
  });

  // show day as in origin timezone, while date in local timezone
  const displayDay = format(
    utcToZonedTime(date, TIMEZONE),
    dateFormat || 'EEE'
  );
  const displayDate = format(new Date(date), DISPLAY_DATE_FORMAT);
  if (!transaction) {
    return null;
  }
  return (
    <>
      <tr
        id={id}
        className="transaction"
        data-day={displayDay}
        data-date={date}
      >
        <td
          data-field="type"
          data-type={type}
          {...bindTrigger(typePopupState)}
        ></td>
        <td data-field="day">
          <span {...bindTrigger(datePopupState)}>{displayDay}</span>
        </td>
        <td data-field="merchant">
          {merchant}
          {description && (
            <button className="note" {...bindTrigger(notesPopupState)}>
              <NoteIcon />
            </button>
          )}
        </td>
        <td data-field="amount" data-cat={category}>
          <Badge pill {...bindTrigger(categoryPopupState)}>
            {usd(amount)}
          </Badge>
          {span > 1 ? (
            <span className="span-hint" {...bindTrigger(spanPopupState)}>
              <ClockIcon />
            </span>
          ) : null}
        </td>
        <td data-field="action">
          <button {...bindTrigger(actionsPopupState)}>
            <KebabHorizontalIcon />
          </button>
        </td>
      </tr>
      <Popover
        {...bindPopover(typePopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="type-popover">
          <h4>{getValueFromOptions(types, type)}</h4>
        </div>
      </Popover>
      <Popover
        {...bindPopover(datePopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="date-popover">{displayDate}</div>
      </Popover>
      <Popover
        {...bindPopover(categoryPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="category-popover">
          <h4>Category</h4>
          <div>{getValueFromOptions(categories, category)}</div>
          <h4>Source</h4>
          <div>{getValueFromOptions(sources, source)}</div>
        </div>
      </Popover>
      <Popover
        {...bindPopover(spanPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="span-popover">Span {span} weeks</div>
      </Popover>
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
        <div className="notes-popover">{description}</div>
      </Popover>
      <Popover
        {...bindPopover(actionsPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizonal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="actions-popover">
          <div
            onClick={() => {
              actionsPopupState.close();
              dispatch(editTransaction(transaction));
              document.querySelector('.new-transaction').scrollIntoView();
            }}
          >
            Edit
          </div>
          <div
            onClick={() => {
              actionsPopupState.close();
              dispatch(intendToRemoveTransaction(transaction));
            }}
          >
            Delete
          </div>
        </div>
      </Popover>
    </>
  );
}

export default Transaction;
