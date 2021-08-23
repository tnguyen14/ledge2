import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { getPastMonthsIds } from '../../selectors/month.js';

function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);

  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  });
  return (
    <>
      {monthsIds.map((monthId) => (
        <div key={monthId}>{monthId}</div>
      ))}
    </>
  );
}

export default Cashflow;
