import React, {
  useEffect,
  useCallback,
  useState
} from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import { loadTransactions } from '../../slices/transactions.js';
import {
  getWeekById,
  getSortedTransactions
} from '../../selectors/transactions.js';
import {
  getWeekStart,
  getWeekStartFromWeekId,
  getDate,
  getWeeksDifference
} from '../../selectors/week.js';
import Transaction from './Transaction.js';
import WeekStats from './WeekStats.js';
import { getRecurringTransactions } from '../../selectors/meta.js';
import { RecurringTransaction } from '../UserSettings/Recurring.js';

function Week(props) {
  const dispatch = useDispatch();
  const { weekId } = props;
  const transactions = useSelector((state) => state.transactions);
  const recurring = useSelector((state) => state.meta.recurring);
  const [effectiveRecurring, setEffectiveRecurring] = useState([]);
  const { active: activeRecurring } = getRecurringTransactions({ recurring });
  const {
    transactions: weekTransactions,
    start,
    end
  } = getWeekById({
    transactions,
    weekId
  });

  useEffect(() => {
    setEffectiveRecurring(
      activeRecurring.reduce((applicable, recurringItem) => {
        if (recurringItem.recurrencePeriod == 'week') {
          const numWeeksSinceSet = getWeeksDifference({
            dateStart: start,
            dateEnd: recurringItem.date
          });
          console.log(`${start}, ${weekId}, ${numWeeksSinceSet}`);
          // recurring item's date is after the current week
          if (numWeeksSinceSet < 0) {
            return applicable;
          }
          if (numWeeksSinceSet % recurringItem.recurrenceFrequency == 0) {
            return [...applicable, recurringItem];
          }
          return applicable;
        }
      }, [])
    );
  }, [activeRecurring, start]);
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
      <p>
        {effectiveRecurring.map((txn) => (
          <div>
            <RecurringTransaction {...txn} />
          </div>
        ))}
      </p>
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
