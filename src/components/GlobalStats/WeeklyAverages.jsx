import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';

import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week.js';
import {
  getWeekById,
  calculateWeeklyAverage,
  getCurrentYearWeeklyAverage
} from '../../selectors/transactions.js';
import { recalculateYearStats } from '../../actions/meta.js';

const YEARS = [2021, 2020, 2019, 2018];

const { usePopupState, bindPopover, bindTrigger } = PopupState;
function AverageWithCategories({
  numWeeks,
  startWeekEnd,
  endWeekStart,
  weeks
}) {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${endWeekStart}-average-popup`
  });
  return (
    <tr className="stat">
      <td>
        <span {...bindTrigger(popupState)}>
          Prev. {numWeeks} weeks (
          {`${startWeekEnd.toFormat('LLL d')} - ${endWeekStart.toFormat(
            'LLL d'
          )}`}
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
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="stat-popover">
          <h5>Prev. {numWeeks} weeks</h5>
          <div className="categories-list"></div>
        </div>
      </Popover>
    </tr>
  );
}

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
          {timespans.map((span) => (
            <AverageWithCategories key={span.endWeekStart} {...span} />
          ))}
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
