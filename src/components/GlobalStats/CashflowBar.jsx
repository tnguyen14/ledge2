import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import {
  usePopupState,
  bindPopover,
  bindTrigger
} from 'https://esm.sh/material-ui-popup-state@5/hooks';
import classnames from 'https://esm.sh/classnames@2';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';

// const { usePopupState, bindPopover, bindTrigger } = PopupState;

function CashflowBar({ data, monthId }) {
  const accounts = useSelector((state) => state.meta.accounts);
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
        {['debit', 'credit'].map((flow) => (
          <div key={flow} className={`${flow}-column`}>
            {Object.entries(data[flow].accounts).map(
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
        ))}
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
        <div className="stat-popover">
          <h4>{monthId}</h4>
          {['debit', 'credit'].map((flow) => (
            <div key={flow} className="flow-details">
              <h5>{flow}</h5>
              <div className="explanation">
                {Object.entries(data[flow].accounts).map(
                  ([account, accountTotal]) => {
                    return (
                      <>
                        <span key={account}>
                          {getValueFromOptions(accounts, account)}
                        </span>
                        <span>{usd(accountTotal)}</span>
                      </>
                    );
                  }
                )}
                <span className="total">Total</span>
                <span className="total">{usd(data[flow].total)}</span>
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
}

export default CashflowBar;
