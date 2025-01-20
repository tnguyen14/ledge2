import React from 'react';
import { useSelector } from 'react-redux';
import { ClockIcon } from '@primer/octicons-react';
import format from 'date-fns/format';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';

function CompactTransaction({ transaction }) {
  const accounts = useSelector((state) => state.meta.accounts);
  if (!transaction) {
    return null;
  }
  const { date, merchant, amount, debitAccount, carriedOver } = transaction;
  return (
    <div className="compact-transaction">
      <div>{format(new Date(date), DISPLAY_DATE_FORMAT)}</div>
      <div>
        {merchant ? merchant : getValueFromOptions(accounts, debitAccount)}
      </div>
      <div>{usd(amount)}</div>
      <div className="status">{carriedOver ? <ClockIcon /> : ''}</div>
    </div>
  );
}

export default CompactTransaction;
