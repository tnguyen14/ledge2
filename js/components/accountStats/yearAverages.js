import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTransactions } from '../../util/transaction';
import { usd } from '@tridnguyen/money';
import { getYearAverages } from '../../selectors';

function YearAverages(props) {
  const averages = useSelector((state) => getYearAverages(state));
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

export default YearAverages;
