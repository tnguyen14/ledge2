import React from 'react';
import Averages from '../components/averages';
import CategoriesChart from '../components/categoriesChart';
import Carousel from 'react-bootstrap/Carousel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { calculateWeeklyAverages } from '../selectors/weeklyAverages';

function AccountStats(props) {
  const { averages, categories, weeks } = props;
  const weeksForChart = Object.keys(weeks)
    .filter((weekIndex) => weekIndex <= 0 && weekIndex > -8)
    .map((weekIndex) => weeks[weekIndex]);
  return (
    <Carousel className="stats account-stats" controls={false} interval={null}>
      <Carousel.Item>
        <Averages averages={averages} />
      </Carousel.Item>
      <Carousel.Item>
        <CategoriesChart categories={categories} weeks={weeksForChart} />
      </Carousel.Item>
    </Carousel>
  );
}

AccountStats.propTypes = {
  averages: PropTypes.array,
  categories: PropTypes.array
};

function mapStateToProps(state) {
  return {
    averages: calculateWeeklyAverages(state),
    categories: state.account.categories,
    weeks: state.weeks
  };
}
export default connect(mapStateToProps, null)(AccountStats);
