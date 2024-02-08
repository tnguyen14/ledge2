import React, { useMemo, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import produce from 'https://esm.sh/immer@9';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import {
  usePopupState,
  bindPopover,
  bindTrigger
} from 'https://esm.sh/material-ui-popup-state@5/hooks';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';

import { patchMeta, getTransactions } from '../../util/api.js';
import {
  getWeekStart,
  getWeekEnd,
  getWeekId,
  getYearStart,
  getYearEnd
} from '../../selectors/week.js';
import {
  getWeekById,
  calculateWeeklyAverage,
  getCurrentYearWeeklyAverage
} from '../../selectors/transactions.js';
import { updateYearStats, updateYearStatsSuccess } from '../../slices/meta.js';

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
  const timespans = useMemo(() => {
    return [
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
        end: -48
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
  }, [transactions]);

  const recalculateYearStats = useCallback(
    async (year) => {
      dispatch(updateYearStats(year));
      const transactions = await getTransactions(
        getYearStart(year),
        getYearEnd(year)
      );
      const weeklyAverage = calculateWeeklyAverage({
        transactions,
        numWeeks: 52
      });
      const stats = produce(yearStats, (draft) => {
        if (!draft[year]) {
          draft[year] = {
            weeklyAverage
          };
        } else {
          draft[year].weeklyAverage = weeklyAverage;
        }
      });
      await patchMeta({
        stats
      });
      dispatch(
        updateYearStatsSuccess({
          year,
          stat: stats[year]
        })
      );
    },
    [dispatch, yearStats]
  );

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
                    dispatch(recalculateYearStats.bind(null, year));
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
