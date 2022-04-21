import React from 'https://cdn.skypack.dev/react@17';

function CashflowBar(props) {
  const { data } = props;
  if (!data) {
    return null;
  }
  return (
    <div className="cashflow-graph">
      <div className="debit-column">
        {Object.entries(data.debit.accounts).map(([account, total], index) => (
          <div
            key={account}
            className="bar-piece"
            data-account={account}
            data-account-index={index}
            style={{
              height: `calc(${total / 100} * var(--px-per-unit-height))`
            }}
          ></div>
        ))}
      </div>
      <div className="credit-column">
        {Object.entries(data.credit.accounts).map(([account, total], index) => (
          <div
            key={account}
            className="bar-piece"
            data-account={account}
            data-account-index={index}
            style={{
              height: `calc(${total / 100} * var(--px-per-unit-height))`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default CashflowBar;
