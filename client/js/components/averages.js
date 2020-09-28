import React from 'react';
import PropTypes from 'prop-types';
import WeeklyAverage from '../components/weeklyAverage';

function Averages(props) {
  const { averages } = props;

  return (
    <div className="averages">
      <h4>Weekly Averages</h4>
      <table className="table">
        <tbody>
          {averages.map((average, index) => (
            <WeeklyAverage key={index} {...average} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

Averages.propTypes = {
  averages: PropTypes.array
};

export default Averages;
