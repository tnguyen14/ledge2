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
  const types = useSelector((state) => state.account.types);
  const months = getMonths({ transactions });
  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  });

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

  const getTypeTotals = useCallback(
    (type) =>
      monthsIds.reduce((totals, monthId) => {
        const transactionsOfType = months[monthId].filter(
          (tx) => tx.type == type
        );
        totals[monthId] = sum(transactionsOfType.map((t) => t.amount));
        return totals;
      }, {}),
    [months, monthsIds]
  );

  const flows = ['in', 'out'];

  const getFlowTotals = useCallback(
    (flow, flowData) =>
      monthsIds.reduce((totals, monthId) => {
        totals[monthId] = sum(flowData.map((typeData) => typeData[monthId]));
        return totals;
      }, {}),
    [months, monthsIds]
  );

  const data = useMemo(
    () =>
      flows.reduce((allData, flow) => {
        const flowData = types[flow].map((type) => ({
          type: type.value,
          ...getTypeTotals(type.slug)
        }));
        allData.push({
          type: flow.toUpperCase(),
          ...getFlowTotals(flow, flowData)
        });
        return allData.concat(flowData);
      }, []),
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
