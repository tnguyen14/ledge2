import React from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@7';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';

/*
 * Every [frequency] [period] on [day]: [merchant] [amount] ([category])
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
          Every{' '}
          {txn.recurrenceFrequency == 1 ? '' : `${txn.recurrenceFrequency} `}
          {txn.recurrenceFrequency == 1
            ? txn.recurrencePeriod
            : `${txn.recurrenceyPeriod}s`}{' '}
          on{' '}
          {txn.recurrencePeriod == 'month'
            ? `the ${txn.recurrenceDay}`
            : txn.recurrenceDay}
          : {txn.merchant} {usd(txn.amount)} (
          {getValueFromOptions(categories, txn.category)})
        </div>
      ))}
    </div>
  );
}

export default Recurring;
