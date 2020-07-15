import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getCategoriesStats } from '../selectors/weeklyStats';

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
  const numWeeks = 8;
  const { categories, weeks } = props;
  const weeksData = Object.keys(weeks)
    .filter((weekIndex) => weekIndex <= 0 && weekIndex > -numWeeks)
    .map((weekIndex) => weeks[weekIndex])
    .map((week) => {
      const stats = getCategoriesStats({
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart width={400} height={400} data={weeksData}>
          <XAxis dataKey="weekStart" />
          <YAxis />
          <Tooltip />
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

function mapStateToProps(state) {
  return {
    categories: state.account.categories,
    weeks: state.weeks
  };
}

export default connect(mapStateToProps, null)(CategoriesChart);
