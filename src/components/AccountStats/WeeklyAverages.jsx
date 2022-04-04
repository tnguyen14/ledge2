import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import { SyncIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';

import { average, weeklyTotal } from '../../util/calculate.js';
import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week.js';
import { getWeekById, getYearAverages } from '../../selectors/transactions.js';
import { loadYear } from '../../actions/app.js';
import { recalculateYearStats } from '../../actions/account.js';
import { TIMEZONE } from '../../util/constants.js';

const YEARS = [2021, 2020, 2019, 2018];

function WeeklyAverages(props) {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);
  const yearStats = useSelector((state) => state.account.stats);
  const yearAverages = getYearAverages({
    transactions
  });
  const timespans = [
    {
      start: -1,
      end: -5
    },
    {
      start: -1,
      end: -13
    },
    {
      start: -1,
      end: -25
    }
  ].map((span) => {
    const weeks = [];
    for (let offset = span.start; offset > span.end; offset--) {
      const weekId = getWeekId({ date: new Date(), offset });
      weeks.push(getWeekById({ transactions, weekId }));
    }
    return {
      ...span,
      startWeekEnd: getWeekEnd({ date: new Date(), offset: span.start }),
      endWeekStart: getWeekStart({ date: new Date(), offset: span.end }),
      weeks
    };
  });

  return (
    <div className="averages">
      <table className="table table-borderless">
        <tbody>
          {timespans.map((span, index) => (
            <tr className="stat" key={index}>
              <td>
                <Tooltip
                  title={`${span.startWeekEnd.toFormat(
                    'LLL d'
                  )} - ${span.endWeekStart.toFormat('LLL d')}`}
                >
                  <span>Last {span.start - span.end} weeks</span>
                </Tooltip>
              </td>
              <td>{usd(average(span.weeks.map(weeklyTotal)))}</td>
            </tr>
          ))}
          <tr>
            <td>&nbsp;</td>
          </tr>
          {YEARS.map((year) => (
            <tr className="stat" key={year}>
              <td>{year}</td>
              <td>
                {yearStats &&
                  yearStats[year] &&
                  (yearStats[year].updating
                    ? 'Updating...'
                    : usd(yearStats[year].weeklyAverage))}
              </td>
              <td>
                <Button
                  variant="light"
                  title={`Recalculate ${year}`}
                  onClick={() => {
                    dispatch(recalculateYearStats(year));
                  }}
                >
                  <SyncIcon />
                </Button>
              </td>
            </tr>
          ))}
          {yearAverages.map((average) => (
            <tr className="stat" key={average.year}>
              <td>
                {average.year} ({average.numWeeks} weeks)
              </td>
              <td>{usd(average.weeklyAverage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          dispatch(loadYear(2021));
        }}
      >
        Get transactions for 2021
      </button>
    </div>
  );
}

export default WeeklyAverages;
