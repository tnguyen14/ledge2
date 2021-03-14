import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTransactions } from '../util/transaction';
import { usd } from '@tridnguyen/money';
import { loadYear } from '../actions/years';
import { getYearAverages } from '../selectors';

function YearAverages(props) {
  // const yearsToLoad = [2021, 2020, 2019];
  const yearsToLoad = [2021];
  const { averages, loadYear } = props;
  return (
    <div>
      <h4>Weekly Averages - Years</h4>
      <table className="table">
        <tbody>
          {averages.map((average) => (
            <tr className="stat" key={average.year}>
              <td>
                {average.year} ({average.numWeeks} weeks)
              </td>
              <td>{usd(average.weeklyAverage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

YearAverages.propTypes = {
  averages: PropTypes.array,
  loadYear: PropTypes.func
};

function mapStateToProps(state) {
  return {
    averages: getYearAverages(state)
  };
}
export default connect(mapStateToProps, {
  loadYear
})(YearAverages);
