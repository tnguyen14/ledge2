import React from 'https://cdn.skypack.dev/react@17';
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
import { TIMEZONE } from '../../util/constants.js';
import CategoryBar from './CategoryBar.js';
import { getCategoriesTotals } from '../../selectors/stats.js';
import {
  getWeekId,
  getWeekStartFromWeekId,
  getPastWeeksIds
} from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { setDisplayFrom } from '../../actions/app.js';
import Chart from '../Chart/index.js';

const numWeeksToShow = 12;

const filterType = 'regular-expense';

function CategoriesChart() {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    [...state.account.categories[filterType]].reverse()
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
        (tx) => tx.type == filterType
      );
      const stats = getCategoriesTotals({
        transactions,
        categories
      });
      // add a space after / to allow label to "break" to new line
      // on small screen
      const label = format(utcToZonedTime(week.start, TIMEZONE), 'MMM dd');
      const categoryTotals = stats.reduce((totals, stat) => {
        totals[stat.slug] = {
          ...stat
        };
        return totals;
      }, {});
      return {
        ...week,
        transactions,
        categoryTotals,
        label
      };
    });

  return (
    <div className="categories-chart">
      <Chart
        maxHeight={2500}
        interval={500}
        chartTop={
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
        }
        chartBody={
          <div className="weeks-columns">
            {weeks.map((week) => (
              <CategoryBar categories={categories} week={week} />
            ))}
          </div>
        }
        xLabels={
          <div className="weeks-labels">
            {weeks.map((week) => (
              <div class="week-label">{week.label}</div>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default CategoriesChart;
