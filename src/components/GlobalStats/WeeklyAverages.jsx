import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';

import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week.js';
import {
  getWeekById,
  calculateWeeklyAverage,
  getCurrentYearWeeklyAverage
} from '../../selectors/transactions.js';
import { recalculateYearStats } from '../../actions/meta.js';

const YEARS = [2021, 2020, 2019, 2018];

function WeeklyAverages() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);
  const yearStats = useSelector((state) => state.meta.stats);
  const currentYearAverage = getCurrentYearWeeklyAverage({
    transactions
  });
  const timespans = [
    {
      start: -1,
      end: -4
    },
    {
      start: -1,
      end: -12
    },
    {
      start: -1,
      end: -24
    }
  ].map((span) => {
    const weeks = [];
    for (let offset = span.start; offset >= span.end; offset--) {
      const weekId = getWeekId({ date: new Date(), offset });
      weeks.push(getWeekById({ transactions, weekId }));
    }
    return {
      ...span,
      numWeeks: span.start - span.end + 1,
      startWeekEnd: getWeekEnd({ date: new Date(), offset: span.start }),
      endWeekStart: getWeekStart({ date: new Date(), offset: span.end }),
      weeks
    };
  });

  return (
    <div className="averages">
      <table className="table table-borderless">
        <tbody>
          {timespans.map(
            ({ numWeeks, startWeekEnd, endWeekStart, weeks }, index) => (
              <tr className="stat" key={index}>
                <td>
                  <span>
                    Prev. {numWeeks} weeks (
                    {`${startWeekEnd.toFormat(
                      'LLL d'
                    )} - ${endWeekStart.toFormat('LLL d')}`}
                    )
                  </span>
                </td>
                <td>
                  {usd(
                    calculateWeeklyAverage({
                      numWeeks,
                      transactions: Array.prototype.concat(
                        ...weeks.map((week) => week.transactions)
                      )
                    })
                  )}
                </td>
              </tr>
            )
          )}
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr className="stat" key={currentYearAverage.year}>
            <td>
              {currentYearAverage.year} ({currentYearAverage.numWeeks} weeks)
            </td>
            <td>{usd(currentYearAverage.value)}</td>
          </tr>
          {YEARS.map((year) => (
            <tr className="stat" key={year}>
              <td>{year}</td>
              <td
                style={{ cursor: 'pointer' }}
                title="Double click to re-calculate"
                onDoubleClick={() => {
                  dispatch(recalculateYearStats(year));
                }}
              >
                {yearStats &&
                  yearStats[year] &&
                  (yearStats[year].updating
                    ? 'Updating...'
                    : usd(yearStats[year].weeklyAverage))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyAverages;
