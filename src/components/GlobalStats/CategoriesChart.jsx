import React from 'https:///esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@7';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'https://esm.sh/@primer/octicons-react@11';
import CategoryBar from './CategoryBar.js';
import { getCategoriesTotals } from '../../selectors/stats.js';
import {
  getWeekStart,
  getWeekStartFromWeekId,
  getPastWeeksIds
} from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { setDisplayFrom } from '../../actions/app.js';
import Chart from '../Chart/index.js';

const numWeeksToShow = 12;

function CategoriesChart() {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    [...state.meta.expenseCategories].reverse()
  );
  const transactions = useSelector((state) => state.transactions);
  const displayFrom = useSelector((state) => state.app.displayFrom);
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
      const transactions = week.transactions.filter(
        (tx) => tx.syntheticType == 'expense'
      );
      // add a space after / to allow label to "break" to new line
      // on small screen
      const label = week.start.toFormat('LLL dd');
      const categoriesTotals = getCategoriesTotals({
        transactions,
        categories
      }).reduce((totals, stat) => {
        totals[stat.slug] = {
          ...stat
        };
        return totals;
      }, {});
      return {
        ...week,
        categoriesTotals,
        label
      };
    });

  return (
    <div className="categories-chart">
      <Chart
        maxAmount={2500}
        intervalAmount={500}
        chartTop={
          <div className="nav">
            <Button
              variant="light"
              onClick={() => {
                dispatch(
                  setDisplayFrom(
                    getWeekStart({
                      date: getWeekStartFromWeekId({
                        weekId: visibleWeeksIds[0]
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
                    getWeekStart({
                      date: getWeekStartFromWeekId({
                        weekId: visibleWeeksIds[0]
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
          <div className="weeks-columns">
            {weeks.map((week) => (
              <CategoryBar
                key={week.weekId}
                categories={categories}
                week={week}
              />
            ))}
          </div>
        }
        xLabels={
          <div className="weeks-labels">
            {weeks.map((week) => (
              <div key={week.weekId} className="week-label">
                {week.label}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default CategoriesChart;
