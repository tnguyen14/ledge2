import React, {
  useEffect,
  useCallback,
  useState
} from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import { loadTransactions } from '../../slices/transactions.js';
import {
  getWeekById,
  getSortedTransactions
} from '../../selectors/transactions.js';
import { getWeekStart, getWeekStartFromWeekId } from '../../selectors/week.js';
import Transaction from './Transaction.js';
import WeekStats from './WeekStats.js';

function Week(props) {
  const dispatch = useDispatch();
  const { weekId } = props;
  const transactions = useSelector((state) => state.transactions);
  const recurring = useSelector((state) => state.meta.recurring);
  const {
    transactions: weekTransactions,
    start,
    end
  } = getWeekById({
    transactions,
    weekId
  });

  const displayTransactions = getSortedTransactions({
    transactions: weekTransactions
  }).filter((tx) => !tx.carriedOver);

  const loadWeek = useCallback(
    async (weekId) => {
      dispatch(
        loadTransactions({
          start: getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
          end: getWeekStart({
            date: getWeekStartFromWeekId({ weekId }),
            offset: 1
          })
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (!displayTransactions.length) {
      dispatch(loadWeek.bind(null, weekId));
    }
  }, [weekId]);

  if (!start || !end) {
    return null;
  }

  return (
    <div className="weekly transactions-container">
      <h3 className="week-title">
        {start.toFormat('LLL d')} - {end.toFormat('LLL d, yyyy')}
      </h3>
      {/*
        add a extra wrapping div over the table
        so the table height does't expand to fill the height of the grid item
        in the scenario where there are too few transactions on the left,
        while the weekstats container is longer
      */}
      <div className="transactions-list">
        <table className="weekly-transactions table table-striped">
          <tbody>
            {displayTransactions.map((tx) => (
              <Transaction key={tx.id} transaction={tx} />
            ))}
          </tbody>
        </table>
      </div>
      <WeekStats weekId={weekId} label="Regular Expenses" />
    </div>
  );
}

export default Week;
