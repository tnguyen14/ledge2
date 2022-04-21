import React from 'https://cdn.skypack.dev/react@17';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function CashflowBar({ data, monthId }) {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${monthId}-cashflow-bar-popup`
  });
  if (!data) {
    return null;
  }
  return (
    <>
      <div
        className={classnames('chart-column', 'cashflow-column', {
          'has-popup-open': popupState.isOpen
        })}
        {...bindTrigger(popupState)}
      >
        <div className="debit-column">
          {Object.entries(data.debit.accounts).map(
            ([account, total], index) => (
              <div
                key={account}
                className="bar-piece"
                data-account={account}
                data-account-index={index}
                style={{
                  height: `calc(${total / 100} * var(--px-per-unit-height))`
                }}
              ></div>
            )
          )}
        </div>
        <div className="credit-column">
          {Object.entries(data.credit.accounts).map(
            ([account, total], index) => (
              <div
                key={account}
                className="bar-piece"
                data-account={account}
                data-account-index={index}
                style={{
                  height: `calc(${total / 100} * var(--px-per-unit-height))`
                }}
              ></div>
            )
          )}
        </div>
      </div>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <div className="chart-bar-popover">
          <h5>{monthId}</h5>
          <div className="explanation">
            {Object.entries(data.debit.accounts).map(
              ([account, accountTotal]) => {
                return (
                  <>
                    <span key={account}>{account}</span>
                    <span>{usd(accountTotal)}</span>
                  </>
                );
              }
            )}
          </div>
        </div>
      </Popover>
    </>
  );
}

export default CashflowBar;
