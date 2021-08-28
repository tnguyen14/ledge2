import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import ChartBar from './ChartBar.js';
import { getCategoriesTotalsStats } from '../../selectors/stats.js';
import {
  getWeekId,
  getWeekStartFromWeekId,
  getPastWeeksIds
} from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';
import { setDisplayFrom } from '../../actions/app.js';

const numWeeksToShow = 12;

function CategoriesChart() {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    [...state.account.categories['regular-expense']].reverse()
  );
  const transactions = useSelector((state) => state.transactions);
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const MAX_WEEK_AMOUNT = 2500; // heuristic
  const INTERVAL_AMOUNT = 500;
  const NUM_INTERVALS = MAX_WEEK_AMOUNT / INTERVAL_AMOUNT;
  const BAR_HEIGHT = 500; // bar height
  const HEIGHT_FACTOR = BAR_HEIGHT / MAX_WEEK_AMOUNT;
  const INTERVAL_HEIGHT = INTERVAL_AMOUNT * HEIGHT_FACTOR;
  const visibleWeeksIds = getPastWeeksIds({
    weekId: displayFrom,
    numWeeks: numWeeksToShow
  });

  const weeks = visibleWeeksIds
    .map((weekId) => {
      return getWeekById({ transactions, weekId });
    })
    .map((week) => {
      if (!week || !week.start) {
        return {};
      }
      const stats = getCategoriesTotalsStats({
        transactions: week.transactions,
        categories
      });
      // add a space after / to allow label to "break" to new line
      // on small screen
      const label = format(utcToZonedTime(week.start, TIMEZONE), 'M/ d');
      const categoryTotals = stats.reduce((totals, stat) => {
        totals[stat.slug] = {
          ...stat
        };
        return totals;
      }, {});
      return {
        ...week,
        categoryTotals,
        label
      };
    });

  return (
    <div className="categories-chart">
      <div className="nav">
        <Button
          variant="light"
          onClick={() => {
            dispatch(
              setDisplayFrom(
                getWeekId({
                  date: getWeekStartFromWeekId({
                    weekId: visibleWeeksIds[0]
                  }),
                  offset: -1
                })
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
                getWeekId({
                  date: getWeekStartFromWeekId({
                    weekId: visibleWeeksIds[0]
                  }),
                  offset: 1
                })
              )
            )
          }
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="y-axis">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            >
              <span className="label">{INTERVAL_AMOUNT * (index + 1)}</span>
            </div>
          );
        })}
      </div>
      <div className="grid-lines">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            ></div>
          );
        })}
      </div>
      <div className="chart">
        {weeks.map((week) => {
          return (
            <ChartBar
              categories={categories}
              week={week}
              heightFactor={HEIGHT_FACTOR}
            />
          );
        })}
      </div>
      <div className="spacer"></div>
      <div className="x-axis">
        {weeks.map((week) => {
          return <div class="week-label">{week.label}</div>;
        })}
      </div>
    </div>
  );
}

export default CategoriesChart;
