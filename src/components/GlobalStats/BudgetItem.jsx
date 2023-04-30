import React from 'https://cdn.skypack.dev/react@17';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';

function BudgetSubCategoryItem({ category, details }) {
  return (
    <tr>
      <td>{category}</td>
      <td>{usd(details.amount * 100)}</td>
    </tr>
  );
}

function BudgetItem({ category, details }) {
  return (
    <tr className="stat">
      <td>
        <details>
          <summary>{category}</summary>
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
  );
}

export default BudgetItem;
