import React, { useMemo } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Table from 'https://cdn.skypack.dev/react-bootstrap@1/Table';
import { getPastMonthsIds } from '../../selectors/month.js';
import { useTable } from 'https://cdn.skypack.dev/react-table@7';

function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);

  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  }).reverse();
  const columns = useMemo(
    () =>
      [
        {
          accessor: 'type'
        }
      ].concat(
        monthsIds.map((monthId) => ({
          Header: monthId,
          accessor: monthId
        }))
      ),
    [monthsIds]
  );
  const data = useMemo(
    () => [
      {
        type: 'Regular Income'
      },
      {
        type: 'Passive Income'
      },
      {
        type: 'Transfer In'
      },
      {
        type: 'Regular Expense'
      },
      {
        type: 'Passive Investment'
      },
      {
        type: 'Transfer Out'
      }
    ],
    [monthsIds]
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
