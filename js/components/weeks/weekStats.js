import React from 'https://cdn.skypack.dev/react@16';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import {
  ChevronUpIcon,
  ChevronDownIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import reactResponsive from 'https://cdn.skypack.dev/react-responsive@8';
import WeekCategory from './weekCategory.js';
import { getCategoriesTotalsStats } from '../../selectors/stats.js';
import { getWeekId } from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { sum, average, weeklyTotal } from '../../util/calculate.js';
import useToggle from '../../hooks/useToggle.js';

const { useMediaQuery } = reactResponsive;

function WeekStats(props) {
  const { week, label } = props;
  const isBigScreen = useMediaQuery({
    query: '(min-width: 42.5em)'
  });
  const [showBreakdown, toggleShowBreakdown] = useToggle(isBigScreen);
  const { weekId, transactions } = week;
  const categories = useSelector((state) => state.account.categories);
  const past4Weeks = useSelector((state) => [
    week,
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -1 })
    }),
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -2 })
    }),
    getWeekById({
      ...state,
      weekId: getWeekId({ date: week.start, offset: -3 })
    })
  ]);

  const rawTotal = weeklyTotal(week);
  const rawTotalId = `raw-total-${weekId}`;

  const carriedOvers = transactions.filter((tx) => tx.carriedOver);
  const carriedOversByCategory = carriedOvers.reduce((txnsByCat, txn) => {
    if (!txnsByCat[txn.category]) {
      txnsByCat[txn.category] = [txn];
    } else {
      txnsByCat[txn.category].push(txn);
    }
    return txnsByCat;
  }, {});

  const categoriesStats = getCategoriesTotalsStats({
    transactions,
    categories
  });

  const total = sum(categoriesStats.map((s) => s.amount));
  const totalId = `total-${weekId}`;

  const past4WeeksSum = sum(past4Weeks.map(weeklyTotal));
  const past4WeeksAverage = average(past4Weeks.map(weeklyTotal));
  const past4WeeksAverageId = `average-past-4-weeks-${weekId}`;

  return (
    <div className="stats week-stats">
      {label && <h4>{label}</h4>}
      <table className="table">
        <tbody>
          <tr key={rawTotalId} className="stat" data-cat="raw-total">
            <td id={rawTotalId} className="stat-label">
              Total
            </td>
            <td aria-labelledby={rawTotalId}>{usd(rawTotal)}</td>
          </tr>
          <tr key={totalId} className="stat" data-cat="total">
            <td id={totalId} className="stat-label">
              Total with carried-overs
            </td>
            <td aria-labelledby={totalId}>{usd(total)}</td>
          </tr>
          <tr
            key={past4WeeksAverageId}
            className="stat"
            data-cat="4-week-average"
          >
            <td id={past4WeeksAverageId} className="stat-label">
              4-week average
            </td>
            <td aria-labelledby={past4WeeksAverageId} data-sum={past4WeeksSum}>
              {usd(past4WeeksAverage)}
            </td>
          </tr>
        </tbody>
      </table>
      <h6 onClick={toggleShowBreakdown}>
        Category breakdown
        {showBreakdown ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </h6>
      <table className="table categories-stats">
        <tbody
          className={classnames({
            hide: !showBreakdown
          })}
        >
          {categoriesStats.map((stat) => {
            const { slug, label, amount } = stat;
            return (
              <WeekCategory
                key={slug}
                slug={slug}
                label={label}
                amount={amount}
                weekId={weekId}
                carriedOvers={carriedOversByCategory[slug]}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WeekStats;
