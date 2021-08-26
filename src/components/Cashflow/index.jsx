import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { getPastMonthsIds } from '../../selectors/month.js';

function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);

  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  }).reverse();
  return (
    <div className="cashflow">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            {monthsIds.map((monthId) => (
              <th key={monthId}>{monthId}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            {monthsIds.map((monthId) => (
              <td key={monthId}></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Cashflow;
