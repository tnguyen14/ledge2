import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usd } from '@tridnguyen/money';
import { getYearAverages } from '../../selectors/transactions';

function YearAverages(props) {
  const yearsToLoad = useSelector((state) => state.app.yearsToLoad);
  const averages = useSelector(getYearAverages);
  return (
    <div>
      <h4>Weekly Averages - Past {yearsToLoad} Years</h4>
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

export default YearAverages;
