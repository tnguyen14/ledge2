import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import format from 'date-fns/format';
import Button from 'react-bootstrap/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import { setDisplayFrom } from '../../slices/app.js';
import {
  getPastMonthsIds,
  getMonthEnd,
  getWeekStartFromWeekId
} from '../../selectors/week.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
import Chart from '../Chart/index.jsx';
import CashflowBar from './CashflowBar.jsx';

function CashflowChart() {
  const dispatch = useDispatch();
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const transactions = useSelector((state) => state.transactions);
  const accounts = useSelector((state) => state.meta.accounts);
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
        accounts
      })
    );
  }, [monthsIds, accounts, months]);

  return (
    <div className="cashflow-chart">
      <Chart
        maxAmount={18000}
        intervalAmount={3000}
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
              <CashflowBar
                key={id}
                monthId={id}
                data={monthsCashflow.months[id]}
              />
            ))}
          </div>
        }
        xLabels={
          <div className="months-labels">
            {monthsIds.map((id) => (
              <div key={id} className="month-label">
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
