import React from 'https://cdn.skypack.dev/react@17';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { NoteIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import classnames from 'https://cdn.skypack.dev/classnames@2';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function BudgetSubCategoryItem({ category, details }) {
  const memoPopupState = usePopupState({
    variant: 'popover',
    popupId: `${category}-memo`
  });
  return (
    <>
      <tr>
        <td>
          {category}
          {details.memo && (
            <button className="icon-button" {...bindTrigger(memoPopupState)}>
              <NoteIcon />
            </button>
          )}
        </td>
        <td>{usd(details.amount * 100)}</td>
      </tr>
      <Popover {...bindPopover(memoPopupState)}>
        {details.memo && <div className="text-popover">{details.memo}</div>}
      </Popover>
    </>
  );
}

function BudgetItem({ category, details }) {
  const memoPopupState = usePopupState({
    variant: 'popover',
    popupId: `${category}-memo`
  });

  let subBudgetTally = 0;

  const subBudget = Object.entries(details).reduce(
    (budget, [subCategory, subDetails]) => {
      if (subCategory == 'amount' || subCategory == 'memo') {
        return budget;
      }
      budget[subCategory] = subDetails;
      subBudgetTally += subDetails.amount;
      return budget;
    },
    {}
  );

  const matchSubBudgetTally = Object.keys(subBudget).length
    ? details.amount == subBudgetTally
    : true;

  return (
    <>
      <tr className="stat">
        <td>
          {Object.keys(subBudget).length ? (
            <details>
              <summary>
                {category}
                {details.memo && (
                  <button
                    className="icon-button"
                    {...bindTrigger(memoPopupState)}
                  >
                    <NoteIcon />
                  </button>
                )}
              </summary>
              <table className="table table-borderless">
                <tbody>
                  {details &&
                    Object.entries(subBudget).map(
                      ([subCategory, subDetails]) => {
                        return (
                          <BudgetSubCategoryItem
                            key={subCategory}
                            category={subCategory}
                            details={subDetails}
                          />
                        );
                      }
                    )}
                </tbody>
              </table>
            </details>
          ) : (
            <div>
              {category}
              {details.memo && (
                <button
                  className="icon-button"
                  {...bindTrigger(memoPopupState)}
                >
                  <NoteIcon />
                </button>
              )}
            </div>
          )}
        </td>
        <td className={classnames({ matchSubBudgetTally })}>
          {usd(details.amount * 100)}
        </td>
      </tr>
      <Popover {...bindPopover(memoPopupState)}>
        {details.memo && <div className="text-popover">{details.memo}</div>}
      </Popover>
    </>
  );
}

export default BudgetItem;
