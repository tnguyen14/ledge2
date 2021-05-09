import React, { useEffect } from 'https://cdn.skypack.dev/react@16';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getYearAverages } from '../../selectors/transactions.js';

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
