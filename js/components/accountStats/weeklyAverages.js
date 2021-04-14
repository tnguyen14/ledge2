import React from 'react';
import { useSelector } from 'react-redux';
import WeeklyAverage from './weeklyAverage';
import { getWeeklyAverages } from '../../selectors';

function WeeklyAverages(props) {
  const averages = useSelector((state) => getWeeklyAverages(state));

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

export default WeeklyAverages;
