import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import ChartBar from './ChartBar.js';
import { getCategoriesTotalsStats } from '../../selectors/stats.js';
import { getWeekId } from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';

function CategoriesChart() {
  const categories = useSelector((state) => state.account.categories);
  const transactions = useSelector((state) => state.transactions);
  const [start, setStart] = useState(0);
  const NUM_WEEKS = 12;
  const MAX_WEEK_AMOUNT = 2000; // assumption
  const INTERVAL_AMOUNT = 400;
  const HEIGHT_FACTOR = 500 / MAX_WEEK_AMOUNT; // 500px is height of a bar

  const weeks = [...Array(NUM_WEEKS).keys()]
    .map((index) => {
      const weekId = getWeekId({ offset: start - index });
      return getWeekById({ transactions, weekId });
    })
    .map((week) => {
      if (!week) {
        return {};
      }
      const stats = getCategoriesTotalsStats({
        transactions: week.transactions,
        categories
      });
      const label = format(utcToZonedTime(week.start, TIMEZONE), 'MMM d');
      const categoryTotals = stats.reduce((totals, stat) => {
        totals[stat.slug] = {
          ...stat
        };
        return totals;
      }, {});
      return {
        ...week,
        categoryTotals,
        label
      };
    });

  return (
    <div className="categories-chart">
      <div className="nav">
        <Button variant="light" onClick={() => setStart(start - 1)}>
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="light"
          disabled={start == 0}
          onClick={() => setStart(start + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="y-axis">
        {[...Array(MAX_WEEK_AMOUNT / INTERVAL_AMOUNT).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_AMOUNT * HEIGHT_FACTOR}px` }}
            >
              {INTERVAL_AMOUNT * (index + 1)}
            </div>
          );
        })}
      </div>
      <div className="chart">
        {weeks.map((week) => {
          return (
            <ChartBar
              categories={categories}
              week={week}
              heightFactor={HEIGHT_FACTOR}
            />
          );
        })}
      </div>
      <div className="spacer"></div>
      <div className="x-axis">
        {weeks.map((week) => {
          return <div class="week-label">{week.label}</div>;
        })}
      </div>
    </div>
  );
}

export default CategoriesChart;
