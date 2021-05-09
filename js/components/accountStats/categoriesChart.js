import React, { useState } from 'https://cdn.skypack.dev/react@16';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'https://cdn.skypack.dev/recharts@1';
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { getCategoriesTotalsStats } from '../../selectors/stats.js';
import { getWeekId } from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';

// duplicate the badge and legend styles in style.scss
const colorMaps = {
  dineout: 'purple',
  groceries: 'deep-orange',
  gas: 'green',
  household: 'cyan',
  entertainment: 'light-green',
  health: 'red',
  transportation: 'amber',
  shopping: 'orange',
  misc: 'lime',
  donation: 'blue-grey',
  residence: 'light-blue-700',
  investment: 'teal',
  utilities: 'light-blue',
  mark: 'grey',
  travel: 'indigo'
};

function CategoriesChart() {
  const categories = useSelector((state) => state.account.categories);
  const transactions = useSelector((state) => state.transactions);
  const [start, setStart] = useState(0);
  const numWeeks = 12;

  // reverse to keep the newest week to the right
  const weeks = [...Array(numWeeks).keys()]
    .reverse()
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
      const weekData = {
        weekStart: format(utcToZonedTime(week.start, TIMEZONE), 'MMM d')
      };
      stats.forEach((stat) => {
        weekData[stat.slug] = (stat.amount / 100).toFixed(2);
      });
      return weekData;
    });

  return (
    <div className="chart categories">
      <h4>{numWeeks} weeks chart</h4>
      <div className="nav">
        <button className="btn btn-light" onClick={() => setStart(start - 1)}>
          <ChevronLeftIcon />
        </button>
        <button
          className="btn btn-light"
          disabled={start == 0}
          onClick={() => setStart(start + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart width={400} height={400} data={weeks}>
          <XAxis dataKey="weekStart" />
          <YAxis />
          {/* use itemSorter to reverse order because by default,
           * the order of items in tooltip is the opposite (visually)
           * of the stacked bars
           * reversal is done by passing negative index of category
           */}
          <Tooltip
            itemSorter={(item, index) => {
              return -categories.findIndex((cat) => cat.slug == item.dataKey);
            }}
          />
          <Legend />
          {categories.map((cat) => {
            return (
              <Bar
                key={cat.slug}
                dataKey={cat.slug}
                name={cat.value}
                stackId="a"
                fill={`var(--color-${colorMaps[cat.slug]})`}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoriesChart;
