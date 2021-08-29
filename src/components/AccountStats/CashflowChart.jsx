import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { getPastMonthsIds } from '../../selectors/month.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
import Chart from '../Chart/index.js';
import CashflowGraph from './CashflowGraph.js';

function CashflowChart() {
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const transactions = useSelector((state) => state.transactions);
  const types = useSelector((state) => state.account.types);
  const months = getMonths({ transactions });
  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 12
  });

  const monthsCashflow = getMonthsCashflow({
    transactions: months,
    monthsIds,
    types
  });

  return (
    <div className="cashflow-chart">
      <Chart
        maxHeight={18000}
        interval={3000}
        chartBody={
          <div className="months-graph">
            {monthsIds.map((id) => (
              <CashflowGraph monthId={id} data={monthsCashflow[id]} />
            ))}
          </div>
        }
        xLabels={
          <div className="months-labels">
            {monthsIds.map((id) => (
              <div class="month-label">
                {format(new Date(`${id}-01 00:00`), 'M/ yy')}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default CashflowChart;
