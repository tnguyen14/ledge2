import React, {
  useMemo,
  useState,
  useEffect
} from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Table from 'https://cdn.skypack.dev/react-bootstrap@1/Table';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import {
  getPastMonthsIds,
  getWeekStartFromWeekId
} from '../../selectors/week.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
import { useTable, useRowState } from 'https://cdn.skypack.dev/react-table@7';
import { getValueFromOptions } from '../../util/slug.js';

function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const transactions = useSelector((state) => state.transactions);
  const types = useSelector((state) => state.meta.types);
  const months = getMonths({ transactions });
  const [monthsIds, setMonthsIds] = useState([]);
  useEffect(() => {
    // months will start with the month of the start of the week for displayFrom
    setMonthsIds(
      getPastMonthsIds({
        date: getWeekStartFromWeekId({
          weekId: displayFrom
        }),
        numMonths: 12
      })
    );
  }, [displayFrom]);

  const [monthsCashflow, setMonthsCashflow] = useState({});

  useEffect(() => {
    setMonthsCashflow(
      getMonthsCashflow({
        transactions: months,
        monthsIds,
        types
      })
    );
  }, [monthsIds, types, months]);

  const years = monthsIds.reduce((aggregate, monthId) => {
    const year = monthId.substr(0, 4);
    if (!aggregate[year]) {
      aggregate[year] = [monthId];
    } else {
      aggregate[year].push(monthId);
    }
    return aggregate;
  }, {});

  const columns = useMemo(
    () =>
      [
        {
          accessor: 'type'
        }
      ].concat(
        Object.entries(years)
          .reverse()
          .map(([year, months]) => ({
            Header: year,
            columns: months.map((month) => ({
              Header: month,
              accessor: month,
              Cell: ({ value }) => usd(value)
            }))
          }))
      ),
    [monthsIds]
  );

  // shape of data - array - each item is a row
  // [
  //   {
  //     "type": "Regular Income",
  //     "2021-08": 123456,
  //     "2021-07": 78912,
  //     ...
  //   },
  //   {
  //     "type": "IN",
  //     "2021-08": 123456,
  //     ...
  //   },
  //   ...
  // ]
  const data = useMemo(() => {
    // shape of rows
    // {
    //   "Regular Income": {
    //     "2021-08": 123456,
    //     "2021-07": 78912,
    //   },
    //   "Regular Expense": {
    //   }
    // }
    const rows = {};
    Object.entries(monthsCashflow).forEach(([monthId, monthData]) => {
      Object.entries(monthData).forEach(([flow, flowData]) => {
        const flowLabel = flow.toUpperCase();
        Object.entries(flowData.types).forEach(([type, total]) => {
          const typeLabel = getValueFromOptions(types[flow], type);
          if (!rows[typeLabel]) {
            rows[typeLabel] = {};
          }
          rows[typeLabel][monthId] = total;
        });
        if (!rows[flowLabel]) {
          rows[flowLabel] = {};
        }
        rows[flowLabel][monthId] = flowData.total;
      });
      if (!rows.Balance) {
        rows.Balance = {};
      }
      rows.Balance[monthId] = rows.IN[monthId] - rows.OUT[monthId];
    });
    return Object.entries(rows).map(([rowLabel, row]) => {
      row.type = rowLabel;
      return row;
    });
  }, [monthsCashflow]);

  const rowStateData = useMemo(
    () =>
      data.map((rowData) => {
        const rowState = {};
        const highlightRows = ['IN', 'OUT', 'Balance'];
        if (highlightRows.includes(rowData.type)) {
          rowState.highlight = true;
        }
        return rowState;
      }),
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: { rowState: rowStateData }
    },
    useRowState
  );
  return (
    <div className="cashflow">
      <Table responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className={classnames({
                  highlight: row.state.highlight
                })}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Cashflow;
