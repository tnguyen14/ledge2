import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { setDisplayFrom } from '../../actions/app.js';
import { getPastMonthsIds, getMonthEnd } from '../../selectors/month.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
import { DATE_FIELD_FORMAT } from '../../util/constants.js';
import Chart from '../Chart/index.js';
import CashflowGraph from './CashflowGraph.js';

function CashflowChart() {
  const dispatch = useDispatch();
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
        chartTop={
          <div className="nav">
            <Button
              variant="light"
              onClick={() => {
                dispatch(
                  setDisplayFrom(
                    format(
                      getMonthEnd({
                        date: displayFrom,
                        offset: -1
                      }),
                      DATE_FIELD_FORMAT
                    )
                  )
                );
              }}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="light"
              onClick={() =>
                dispatch(
                  setDisplayFrom(
                    format(
                      getMonthEnd({
                        date: displayFrom,
                        offset: 1
                      }),
                      DATE_FIELD_FORMAT
                    )
                  )
                )
              }
            >
              <ChevronRightIcon />
            </Button>
          </div>
        }
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
