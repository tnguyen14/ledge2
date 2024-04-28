import React, {
  useMemo,
  useState,
  useEffect
} from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9';
import Table from 'https://esm.sh/react-bootstrap@2/Table';
import {
  useReactTable,
  flexRender,
  getCoreRowModel
} from 'https://esm.sh/@tanstack/react-table@8';
import classnames from 'https://esm.sh/classnames@2';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import {
  getPastMonthsIds,
  getWeekStartFromWeekId
} from '../../selectors/week.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
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

  const years = useMemo(
    () =>
      monthsIds.reduce((aggregate, monthId) => {
        const year = monthId.substr(0, 4);
        if (!aggregate[year]) {
          aggregate[year] = [monthId];
        } else {
          aggregate[year].push(monthId);
        }
        return aggregate;
      }, {}),
    [monthsIds]
  );

  const columns = useMemo(
    () =>
      [
        {
          id: 'label',
          header: '',
          accessorKey: 'label'
        }
      ].concat(
        Object.entries(years)
          .reverse()
          .map(([year, months]) => ({
            id: 'year',
            header: year,
            columns: months.map((month) => ({
              header: month,
              accessorKey: month,
              cell: ({ getValue }) => usd(getValue())
            }))
          }))
      ),
    [years]
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

  const highlightRows = ['debit', 'credit', 'balance'];

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div className="cashflow">
      <Table responsive>
        <thead>
          {getHeaderGroups().map((headerGroup, j) => (
            <tr key={`header-group-${j}`}>
              {headerGroup.headers.map((header) => (
                <th key={`column-${header.index}`} colSpan={header.colSpan}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row, l) => {
            return (
              <tr
                key={`row-${l}`}
                className={classnames({
                  highlight: highlightRows.includes(row.original.label)
                })}
              >
                {row.getVisibleCells().map((cell, m) => (
                  <td key={`cell-${m}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
