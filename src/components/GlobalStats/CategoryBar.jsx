import React from 'https://cdn.skypack.dev/react@17';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state@1/hooks';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function CategoryBar(props) {
  const { categories, week } = props;
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${week.label}-chart-popup`
  });

  // make bar-piece a child of data-cat to use styles
  // defined in style.css
  return (
    <>
      <div
        className={classnames('chart-column', 'week-column', {
          'has-popup-open': popupState.isOpen
        })}
        {...bindTrigger(popupState)}
      >
        {week.categoryTotals &&
          categories.map((cat) => {
            if (!week.categoryTotals[cat.slug]) {
              return null;
            }
            return (
              <div key={cat.slug} data-cat={cat.slug}>
                <div
                  className="bar-piece"
                  style={{
                    height: `calc(${
                      week.categoryTotals[cat.slug].amount / 100
                    } * var(--px-per-unit-height)
                  )`
                  }}
                ></div>
              </div>
            );
          })}
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
          <h5>{week.label}</h5>
          <div className="categories-list">
            {week.categoryTotals &&
              categories
                .map((cat) => {
                  if (!week.categoryTotals[cat.slug]) {
                    return null;
                  }
                  const stat = week.categoryTotals[cat.slug];
                  return (
                    <>
                      <span data-cat={stat.slug}>
                        <span className="legend">&nbsp;</span>
                        {stat.label}
                      </span>
                      <span>{usd(stat.amount)}</span>
                    </>
                  );
                })
                .reverse()}
          </div>
        </div>
      </Popover>
    </>
  );
}

export default CategoryBar;
