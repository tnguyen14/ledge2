import React, { useMemo, useCallback } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Table from 'https://cdn.skypack.dev/react-bootstrap@1/Table';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getPastMonthsIds } from '../../selectors/month.js';
import { getMonths } from '../../selectors/transactions.js';
import { useTable } from 'https://cdn.skypack.dev/react-table@7';
import { sum } from '../../util/calculate.js';

function getTypeTotal(type) {}
function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const transactions = useSelector((state) => state.transactions);
  const types = useSelector((state) =>
    [...state.account.types.in].concat(state.account.types.out)
  );
  const months = getMonths({ transactions });
  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  });

  const getTypeTotals = useCallback(
    (type) =>
      monthsIds.reduce((totals, monthId) => {
        const transactionsOfType = months[monthId].filter((tx) => {
          if (type != 'regular-expense') {
            return tx.type == type;
          }
          return tx.type == undefined || tx.type == 'regular-expense';
        });
        if (type == 'regular-expense') console.log(transactionsOfType);
        totals[monthId] = sum(transactionsOfType.map((t) => t.amount));
        return totals;
      }, {}),
    [months, monthsIds]
  );

  const columns = useMemo(
    () =>
      [
        {
          accessor: 'type'
        }
      ].concat(
        monthsIds.map((monthId) => ({
          Header: monthId,
          accessor: monthId,
          Cell: ({ value }) => usd(value)
        }))
      ),
    [monthsIds]
  );
  const data = useMemo(
    () =>
      types.map((type) => ({
        type: type.value,
        ...getTypeTotals(type.slug)
      })),
    [types, months, monthsIds]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });
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
              <tr {...row.getRowProps()}>
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
