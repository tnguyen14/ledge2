import React from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@7';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
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
/*
 * [merchant] [amount] ([category]) : every [frequency] [period] on [day]
 */

/**
 * @returns {JSX.Element}
 */
function Recurring() {
  const { recurring } = useSelector((state) => state.meta);
  const categories = useSelector((state) => state.meta.expenseCategories);
  return (
    <div className="recurring">
      <h4>Recurring Transactions</h4>
      {recurring.map((txn) => (
        <div key={txn.id}>
          {txn.merchant} {usd(txn.amount)} (
          {getValueFromOptions(categories, txn.category)}): every{' '}
          {txn.recurrenceFrequency == 1 ? '' : `${txn.recurrenceFrequency} `}
          {txn.recurrenceFrequency == 1
            ? txn.recurrencePeriod
            : `${txn.recurrenceyPeriod}s`}{' '}
          on{' '}
          {txn.recurrencePeriod == 'month'
            ? `the ${displayMonthDay(txn.recurrenceDay)}`
            : txn.recurrenceDay}
        </div>
      ))}
    </div>
  );
}

export default Recurring;
