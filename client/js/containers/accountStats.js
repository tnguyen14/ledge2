import React from 'react';
import Averages from '../components/averages';
import CategoriesChart from '../components/categoriesChart';
import Carousel from 'react-bootstrap/Carousel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getWeeklyAverages } from '../selectors';

function AccountStats(props) {
  const { averages, categories, weeks } = props;
  return (
    <Carousel className="stats account-stats" controls={false} interval={null}>
      <Carousel.Item>
        <Averages averages={averages} />
      </Carousel.Item>
      <Carousel.Item>
        <CategoriesChart categories={categories} weeks={weeks} />
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
    averages: getWeeklyAverages(state),
    categories: state.account.meta.categories,
    weeks: state.weeks
  };
}
export default connect(mapStateToProps, null)(AccountStats);
