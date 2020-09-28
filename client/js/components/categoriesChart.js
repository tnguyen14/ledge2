import React, { useState } from 'react';
import PropTypes from 'prop-types';
import times from 'lodash.times';
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
import { getCategoriesTotalsStats } from '../selectors';

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
  mark: 'grey'
};

function CategoriesChart(props) {
  const { categories, weeks } = props;
  const [start, setStart] = useState(0);
  const numWeeks = 12;

  const weeksData = Object.keys(weeks)
    .filter((weekIndex) => weekIndex <= start && weekIndex > -numWeeks + start)
    .map((weekIndex) => weeks[weekIndex])
    .map((week) => {
      const stats = getCategoriesTotalsStats({
        transactions: week.transactions,
        categories
      });
      const weekData = {
        weekStart: week.start.format('MMM D')
      };
      stats.forEach((stat) => {
        weekData[stat.slug] = (stat.amount / 100).toFixed(2);
      });
      return weekData;
    })
    // newest week should be to the right
    .reverse();

  return (
    <div className="chart categories">
      <h4>Past {numWeeks} weeks</h4>
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
        <BarChart width={400} height={400} data={weeksData}>
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

CategoriesChart.propTypes = {
  categories: PropTypes.array,
  weeks: PropTypes.object
};

export default CategoriesChart;
