import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyAverage(props) {
  const { numWeeks, loaded, weeklyAverage, start } = props;
  let duration;
  let relative;
  let moreInfo;
  switch (numWeeks) {
    case 4:
      duration = 'month';
      break;
    case 12:
      duration = 'quarter';
      break;
    case 24:
      duration = '6 months';
      break;
    default:
      duration = `${numWeeks} weeks`;
  }
  if (start > 0) {
    relative = 'Future';
    moreInfo = `(projecting ${start} weeks ahead)`;
  }
  if (start == 0) {
    relative = 'Current';
  } else if (start == -1) {
    relative = 'Previous';
  }
  const label = `${relative} ${duration}`;
  const value = loaded ? money(weeklyAverage) : 'Calculating...';
  return (
    <tr className="stat">
      <td>
        {relative} {duration}
        {moreInfo && <div>{moreInfo}</div>}
      </td>
      <td>{value}</td>
    </tr>
  );
}

WeeklyAverage.propTypes = {
  numWeeks: PropTypes.number,
  loaded: PropTypes.bool,
  weeklyAverage: PropTypes.number
};

export default WeeklyAverage;
