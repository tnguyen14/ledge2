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
  const accounts = useSelector((state) => state.meta.accounts);
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

  const [monthsCashflow, setMonthsCashflow] = useState({ months: {} });

  useEffect(() => {
    setMonthsCashflow(
      getMonthsCashflow({
        transactions: months,
        monthsIds
      })
    );
  }, [monthsIds, months]);

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
          accessor: 'label'
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
  //     "label": "Cash",
  //     "2021-08": 123456,
  //     "2021-07": 78912,
  //     ...
  //   },
  //   {
  //     "label": "debit",
  //     "2021-08": 123456,
  //     ...
  //   },
  //   ...
  // ]
  const data = useMemo(() => {
    // shape of rows
    // {
    //   "Income - debit": {
    //     "2021-08": 123456,
    //     "2021-07": 78912,
    //   },
    //   ...
    //   "debit": {
    //     "2021-08": 123456,
    //   },
    //   "Expense - credit": {
    //   }
    // }
    const rows = {};
    Object.entries(monthsCashflow.months).forEach(([monthId, monthData]) => {
      Object.entries(monthData).forEach(([flow, flowData]) => {
        monthsCashflow.accounts[flow].forEach((account) => {
          const accountName = getValueFromOptions(accounts, account);
          const rowLabel = `${accountName}|${flow}`;
          if (!rows[rowLabel]) {
            rows[rowLabel] = {};
          }
          rows[rowLabel][monthId] = flowData.accounts[account];
        });
        if (!rows[flow]) {
          rows[flow] = {};
        }
        rows[flow][monthId] = flowData.total;
      });
      if (!rows.balance) {
        rows.balance = {};
      }
      rows.balance[monthId] = rows.debit[monthId] - rows.credit[monthId];
    });
    return Object.entries(rows).map(([rowLabel, row]) => {
      row.label = rowLabel.split('|')[0];
      return row;
    });
  }, [monthsCashflow]);

  const rowStateData = useMemo(
    () =>
      data.map((rowData) => {
        const rowState = {};
        const highlightRows = ['debit', 'credit', 'balance'];
        if (highlightRows.includes(rowData.label)) {
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
          {headerGroups.map((headerGroup, j) => (
            <tr
              key={`header-group-${j}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, k) => (
                <th key={`column-${k}`} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, l) => {
            prepareRow(row);
            return (
              <tr
                key={`row-${l}`}
                className={classnames({
                  highlight: row.state.highlight
                })}
                {...row.getRowProps()}
              >
                {row.cells.map((cell, m) => (
                  <td key={`cell-${m}`} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
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
