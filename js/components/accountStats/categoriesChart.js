import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Button from 'react-bootstrap/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { getCategoriesTotalsStats } from '../../selectors/stats';
import { getWeekId } from '../../selectors/week';
import { getWeekById } from '../../selectors/transactions';
import { TIMEZONE } from '../../util/constants';

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
