import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
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
  const weeksData = weeks
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
      <h4>Past {weeks.length} weeks</h4>
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
  weeks: PropTypes.array
};

export default CategoriesChart;
