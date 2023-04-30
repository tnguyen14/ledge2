import React from 'https://cdn.skypack.dev/react@17';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { NoteIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function BudgetSubCategoryItem({ category, details }) {
  return (
    <tr>
      <td>{category}</td>
      <td>{usd(details.amount * 100)}</td>
    </tr>
  );
}

function BudgetItem({ category, details }) {
  const memoPopupState = usePopupState({
    variant: 'popover',
    popupId: `${category}-memo`
  });

  return (
    <>
      <tr className="stat">
        <td>
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
                  Object.entries(details).map(([subCategory, subDetails]) => {
                    if (subCategory == 'amount') {
                      return null;
                    }
                    return (
                      <BudgetSubCategoryItem
                        key={subCategory}
                        category={subCategory}
                        details={subDetails}
                      />
                    );
                  })}
              </tbody>
            </table>
          </details>
        </td>
        <td>{usd(details.amount * 100)}</td>
      </tr>
      <Popover {...bindPopover(memoPopupState)}>
        {details.memo && <div className="text-popover">{details.memo}</div>}
      </Popover>
    </>
  );
}

export default BudgetItem;
