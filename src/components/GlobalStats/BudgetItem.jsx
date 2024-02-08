import React from 'https://esm.sh/react@18';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { NoteIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import {
  usePopupState,
  bindPopover,
  bindTrigger
} from 'https://esm.sh/material-ui-popup-state@5/hooks';

// const { usePopupState, bindPopover, bindTrigger } = PopupState;

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

  let subBudgetTallyStatus = 'match';
  if (Object.keys(subBudget).length) {
    if (details.amount < subBudgetTally) {
      subBudgetTallyStatus = 'exceed';
    } else if (details.amount > subBudgetTally) {
      subBudgetTallyStatus = 'short';
    }
  }

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
        <td className={`sub-budget-tally-${subBudgetTallyStatus}`}>
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
