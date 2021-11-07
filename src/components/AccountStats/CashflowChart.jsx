import React, { useState, useEffect } from 'https://cdn.skypack.dev/react@17';
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
import {
  getPastMonthsIds,
  getMonthEnd,
  getWeekStartFromWeekId
} from '../../selectors/week.js';
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

  const [monthsIds, setMonthsIds] = useState([]);
  useEffect(() => {
    setMonthsIds(
      getPastMonthsIds({
        date: getWeekStartFromWeekId({
          weekId: displayFrom
        }),
        numMonths: 12
      })
    );
  }, [displayFrom]);

  const [monthsCashflow, setMonthsCashflow] = useState({});

  useEffect(() => {
    setMonthsCashflow(
      getMonthsCashflow({
        transactions: months,
        monthsIds,
        types
      })
    );
  }, [monthsIds, types, months]);

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
                    getMonthEnd({
                      date: getWeekStartFromWeekId({
                        weekId: displayFrom
                      }),
                      offset: -1
                    }).toISODate()
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
                    getMonthEnd({
                      date: getWeekStartFromWeekId({
                        weekId: displayFrom
                      }),
                      offset: 1
                    }).toISODate()
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
                {format(new Date(`${id}-01 00:00`), 'MMM yy')}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default CashflowChart;
