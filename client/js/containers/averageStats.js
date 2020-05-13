import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import {
  getTimeSpans,
  hasNotFullyLoaded,
  calculateWeeklyAverages
} from '../selectors/weeklyAverages';
import WeeklyAverage from '../components/weeklyAverage';

class AverageStats extends Component {
  render() {
    const { weeklyAverages } = this.props;

    return (
      <div className="stats averages">
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
}

AverageStats.propTypes = {
  timeSpans: PropTypes.array,
  hasNotFullyLoaded: PropTypes.bool,
  weeklyAverages: PropTypes.array
};

function mapStateToProps(state) {
  return {
    timeSpans: getTimeSpans(state),
    hasNotFullyLoaded: hasNotFullyLoaded(state),
    weeklyAverages: calculateWeeklyAverages(state)
  };
}

export default connect(mapStateToProps)(AverageStats);
