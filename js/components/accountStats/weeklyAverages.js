import React from 'react';
import { useSelector } from 'react-redux';
import { usd } from '@tridnguyen/money';
import { average, weeklyTotal } from '../../util/calculate';
import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week';
import { getWeekById } from '../../selectors/transactions';

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
                {span.startWeekEnd.format('MMM D')} -{' '}
                {span.endWeekStart.format('MMM D')} ({span.start - span.end}{' '}
                weeks)
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
