import React from 'https://cdn.skypack.dev/react@17';

function CashflowGraph(props) {
  const { data } = props;
  if (!data) {
    return null;
  }
  const inData = data.debit;
  const outData = data.credit;
  return (
    <div className="cashflow-graph">
      <div className="in-column">
        {Object.entries(inData.accounts).map(([account, total]) => (
          <div
            className="bar-piece"
            data-type={account}
            style={{
              height: `calc(${total / 100} * var(--px-per-unit-height))`
            }}
          ></div>
        ))}
      </div>
      <div className="out-column">
        {Object.entries(outData.accounts).map(([account, total]) => (
          <div
            className="bar-piece"
            data-type={account}
            style={{
              height: `calc(${total / 100} * var(--px-per-unit-height))`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default CashflowGraph;
