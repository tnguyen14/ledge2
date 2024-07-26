import React, {
  useEffect,
  useCallback,
  useState
} from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import { getDate, getDayOfYear, getYear } from 'https://esm.sh/date-fns@2';
import { DateTime } from 'https://esm.sh/luxon@3';
import { loadTransactions } from '../../slices/transactions.js';
import {
  getWeekById,
  getSortedTransactions
} from '../../selectors/transactions.js';
import {
  getWeekStart,
  getWeekStartFromWeekId,
  getWeeksDifference,
  getMonthsDifference,
  getYearsDifference
} from '../../selectors/week.js';
import { TIMEZONE } from '../../util/constants.js';
import Transaction from './Transaction.jsx';
import WeekStats from './WeekStats.jsx';
import { getRecurringTransactions } from '../../selectors/meta.js';
import { RecurringTransaction } from '../UserSettings/Recurring.jsx';

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
    if (!start || !end) {
      return;
    }
    setEffectiveRecurring(
      activeRecurring.reduce((applicable, recurringItem) => {
        if (recurringItem.recurrencePeriod == 'week') {
          const numWeeksSinceSet = getWeeksDifference({
            dateStart: start,
            dateEnd: recurringItem.date
          });
          // recurring item's date is after the current week
          if (numWeeksSinceSet < 0) {
            return applicable;
          }
          if (numWeeksSinceSet % recurringItem.recurrenceFrequency == 0) {
            return [...applicable, recurringItem];
          }
          return applicable;
        }
        if (recurringItem.recurrencePeriod == 'month') {
          const weekStartDate = getDate(start.toJSDate());
          const weekEndDate = getDate(end.toJSDate());
          const recurringDate = Number(recurringItem.recurrenceDay);
          let isRecurringWithinWeek =
            weekStartDate <= recurringDate && recurringDate <= weekEndDate;
          // start at the end of a month, so start date is higher than end date
          if (weekStartDate > weekEndDate) {
            isRecurringWithinWeek =
              weekStartDate <= recurringDate || recurringDate <= weekEndDate;
          }
          if (isRecurringWithinWeek) {
            const numMonthsSinceSet = getMonthsDifference({
              dateStart: start,
              dateEnd: recurringItem.date
            });
            if (numMonthsSinceSet < 0) {
              return applicable;
            }
            if (numMonthsSinceSet % recurringItem.recurrenceFrequency == 0) {
              return [...applicable, recurringItem];
            }
          }
          return applicable;
        }
        if (recurringItem.recurrencePeriod == 'year') {
          const recurringDateInThisYear = DateTime.fromFormat(
            `${recurringItem.recurrenceDay}, ${getYear(new Date())}`,
            'MMM d, yyyy',
            { zone: TIMEZONE }
          );
          if (
            getDayOfYear(start.toJSDate()) <=
              getDayOfYear(recurringDateInThisYear.toJSDate()) &&
            getDayOfYear(end.toJSDate()) >=
              getDayOfYear(recurringDateInThisYear.toJSDate())
          ) {
            const numYearsSinceSet = getYearsDifference({
              dateStart: recurringDateInThisYear,
              dateEnd: recurringItem.date
            });
            if (numYearsSinceSet < 0) {
              return applicable;
            }
            if (numYearsSinceSet % recurringItem.recurrenceFrequency == 0) {
              return [...applicable, recurringItem];
            }
          }
          return applicable;
        }
      }, [])
    );
  }, [activeRecurring, start, end]);
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
      <div className="week-secondary">
        <WeekStats weekId={weekId} label="Regular Expenses" />
        <div>
          <h4>Applicable Recurring</h4>
          {effectiveRecurring.map((txn) => (
            <div>
              <RecurringTransaction {...txn} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Week;
