import React from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import {
  PencilIcon,
  TrashIcon
} from 'https://esm.sh/@primer/octicons-react@15';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import {
  editTransaction,
  intendToRemoveTransaction,
  setUserSettingsOpen
} from '../../slices/app.js';
import { getValueFromOptions } from '../../util/slug.js';

function displayMonthDay(day) {
  if (day == 1) {
    return '1st';
  } else if (day == 2) {
    return '2nd';
  } else if (day == 3) {
    return '3rd';
  } else if (day == 21) {
    return '21st';
  } else if (day == 22) {
    return '22nd';
  } else if (day == 23) {
    return '23rd';
  } else if (day == 31) {
    return '31st';
  } else {
    return `${day}th`;
  }
}

function displayPlural(str, num) {
  if (num == 1) {
    return str;
  } else {
    return `${str}s`;
  }
}

function displayFrequency(str, num) {
  if (num == 1) {
    return `every ${str}`;
  } else {
    return `every ${num} ${displayPlural(str, num)}`;
  }
}

/*
 * [merchant] [amount] ([category]) : every [frequency] [period] on [day]
 */

/**
 * @returns {JSX.Element}
 */
function Recurring() {
  const { recurring } = useSelector((state) => state.meta);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.meta.expenseCategories);
  return (
    <div className="recurring">
      <h4>Recurring Transactions</h4>
      {recurring.map((txn) => (
        <div className="item" key={txn.id}>
          <span>
            {txn.merchant} {usd(txn.amount)} (
            {getValueFromOptions(categories, txn.category)}):{' '}
            {displayFrequency(txn.recurrencePeriod, txn.recurrenceFrequency)} on{' '}
            {txn.recurrencePeriod == 'month'
              ? `the ${displayMonthDay(txn.recurrenceDay)}`
              : txn.recurrenceDay}
          </span>
          <Button
            size="sm"
            variant="outline-info"
            title="Edit"
            onClick={() => {
              dispatch(
                editTransaction({
                  ...txn,
                  syntheticType: 'recurring'
                })
              );
              dispatch(setUserSettingsOpen(false));
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            title="Remove"
            onClick={() => {
              dispatch(
                intendToRemoveTransaction({
                  ...txn,
                  syntheticType: 'recurring'
                })
              );
              dispatch(setUserSettingsOpen(false));
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default Recurring;
