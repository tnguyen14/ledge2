import React from 'https://cdn.skypack.dev/react@16';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { average, weeklyTotal } from '../../util/calculate.js';
import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week.js';
import { getWeekById } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';

function WeeklyAverages(props) {
  const transactions = useSelector((state) => state.transactions);
  const timespans = [
    {
      start: 0,
      end: -4
    },
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
      const weekId = getWeekId({ offset });
      weeks.push(getWeekById({ transactions, weekId }));
    }
    return {
      ...span,
      startWeekEnd: getWeekEnd({ offset: span.start }),
      endWeekStart: getWeekStart({ offset: span.end }),
      weeks
    };
  });

  return (
    <div className="averages">
      <h4>Weekly Averages</h4>
      <table className="table">
        <tbody>
          {timespans.map((span, index) => (
            <tr className="stat" key={index}>
              <td>
                {format(utcToZonedTime(span.startWeekEnd, TIMEZONE), 'MMM d')} -{' '}
                {format(utcToZonedTime(span.endWeekStart, TIMEZONE), 'MMM d')} (
                {span.start - span.end} weeks)
              </td>
              <td>{usd(average(span.weeks.map(weeklyTotal)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyAverages;
