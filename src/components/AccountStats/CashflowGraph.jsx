import React from 'https://cdn.skypack.dev/react@17';

function CashflowGraph(props) {
  const { monthId, data } = props;
  const inData = data.in;
  const outData = data.out;
  return (
    <div className="cashflow-graph">
      <div className="in-column">
        {Object.entries(inData.categories).map(([category, total]) => (
          <div
            className="bar-piece"
            data-type={category}
            style={{
              height: `calc(${total / 100} * var(--px-per-unit-height))`
            }}
          ></div>
        ))}
      </div>
      <div className="out-column">
        {Object.entries(outData.categories).map(([category, total]) => (
          <div
            className="bar-piece"
            data-type={category}
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
