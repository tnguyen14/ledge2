import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { calculateWeeklyAverages } from '../selectors/weeklyAverages';
import WeeklyAverage from '../components/weeklyAverage';

function WeeklyAverages(props) {
  const { weeklyAverages } = props;

  return (
    <div className="averages">
      <h4>Weekly Averages</h4>
      <table className="table">
        <tbody>
          {weeklyAverages.map((average, index) => (
            <WeeklyAverage key={index} {...average} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

WeeklyAverages.propTypes = {
  weeklyAverages: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weeklyAverages: calculateWeeklyAverages(state)
  };
}

export default connect(mapStateToProps)(WeeklyAverages);
