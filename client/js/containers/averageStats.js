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
import { addWeek } from '../actions/weeks';
import { scheduleRenewal } from '../actions/user';

class AverageStats extends Component {
  shouldComponentUpdate(nextProps) {
    const { timeSpans: currentSpans } = this.props;
    const { timeSpans: newSpans } = nextProps;
    // trigger componentDidUpdate to load the next week when a week
    // has been loaded
    return !fromJS(currentSpans).equals(fromJS(newSpans));
  }
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
  componentDidUpdate() {
    const { hasNotFullyLoaded, addWeek, scheduleRenewal } = this.props;
    // once loading weeks, renew session
    if (hasNotFullyLoaded) {
      addWeek();
    } else {
      scheduleRenewal();
    }
  }
}

AverageStats.propTypes = {
  timeSpans: PropTypes.array,
  hasNotFullyLoaded: PropTypes.bool,
  weeklyAverages: PropTypes.array,
  addWeek: PropTypes.func,
  scheduleRenewal: PropTypes.func
};

function mapStateToProps(state) {
  return {
    timeSpans: getTimeSpans(state),
    hasNotFullyLoaded: hasNotFullyLoaded(state),
    weeklyAverages: calculateWeeklyAverages(state)
  };
}

export default connect(mapStateToProps, { addWeek, scheduleRenewal })(
  AverageStats
);
