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

const { usePopupState, bindPopover, bindTrigger } = PopupState;
function AverageWithCategories({
  numWeeks,
  startWeekEnd,
  endWeekStart,
  weeks
}) {
  const transactions = Array.prototype.concat(
    ...weeks.map((week) => week.transactions)
  );
  const categories = useSelector((state) =>
    [...state.meta.expenseCategories].reverse()
  );
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${endWeekStart}-average-popup`
  });

  const categoriesTotals = categories
    .map(({ slug, value: label }) => ({
      slug,
      label,
      amount: calculateWeeklyAverage({
        numWeeks,
        transactions: transactions.filter((t) => t.category == slug)
      })
    }))
    .filter((stat) => stat.amount > 0)
    .sort((a, b) => b.amount - a.amount);
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
            transactions
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
          <div className="explanation">
            {categoriesTotals.map(({ slug, label, amount }) => (
              <>
                <span data-cat={slug}>
                  <span className="legend">&nbsp;</span>
                  {label}
                </span>
                <span>{usd(amount)}</span>
              </>
            ))}
          </div>
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
    },
    {
      start: -1,
      end: -52,
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
          {Object.keys(yearStats)
            .sort((a, b) => Number(b) - Number(a))
            .map((year) => (
              <tr className="stat" key={year}>
                <td>{year}</td>
                <td
                  style={{ cursor: 'pointer' }}
                  title="Double click to re-calculate"
                  onDoubleClick={() => {
                    dispatch(recalculateYearStats(year));
                  }}
                >
                  {yearStats[year].updating
                    ? 'Updating...'
                    : usd(yearStats[year].weeklyAverage)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyAverages;
