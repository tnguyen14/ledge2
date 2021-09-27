import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { loadWeek } from '../../actions/app.js';
import { sortTransactions } from '../../util/transaction.js';
import { getWeekById } from '../../selectors/transactions.js';
import Transaction from './Transaction.js';
import WeekStats from './WeekStats.js';

function Week(props) {
  const dispatch = useDispatch();
  const { weekId } = props;
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const initialLoad = useSelector((state) => state.app.initialLoad);
  const transactions = useSelector((state) => state.transactions);
  const { transactions: weekTransactions, start, end } = getWeekById({
    transactions,
    weekId
  });

  const displayTransactions = sortTransactions(weekTransactions).filter(
    (tx) => !tx.carriedOver
  );

  useEffect(() => {
    if (!initialLoad) {
      return;
    }
    if (!displayTransactions.length) {
      dispatch(loadWeek({ weekId }));
    }
  }, []);

  if (!start || !end) {
    return null;
  }

  return (
    <div className="weekly transactions-container">
      <h3 className="week-title">
        {format(start, 'MMM d')} - {format(end, 'MMM d')}
      </h3>
      <table className="weekly-transactions transactions-list table table-striped">
        <tbody>
          {displayTransactions.map((tx) => (
            <Transaction key={tx.id} transaction={tx} />
          ))}
        </tbody>
      </table>
      <WeekStats weekId={weekId} label="Regular Expenses" />
    </div>
  );
}

export default Week;
