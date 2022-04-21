import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { ClockIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';

function CompactTransaction({ transaction }) {
  const accounts = useSelector((state) => state.meta.accounts);
  if (!transaction) {
    return null;
  }
  const { date, merchant, amount, debitAccount, carriedOver } = transaction;
  return (
    <div className="compact-transaction">
      <div>{format(new Date(date), 'MM/dd/yy')}</div>
      <div>
        {merchant ? merchant : getValueFromOptions(accounts, debitAccount)}
      </div>
      <div>{usd(amount)}</div>
      <div className="status">{carriedOver ? <ClockIcon /> : ''}</div>
    </div>
  );
}

export default CompactTransaction;
