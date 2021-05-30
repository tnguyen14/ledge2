import React from 'https://cdn.skypack.dev/react@17';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state/hooks';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';

const { usePopupState, bindPopover, bindTrigger } = PopupState;

function ChartBar(props) {
  const { categories, heightFactor, week } = props;
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${week.label}-chart-popup`
  });

  if (!week.categoryTotals) {
    return;
  }
  // make bar-piece a child of data-cat to use styles
  // defined in style.css
  return (
    <>
      <div
        class={classnames('week-column', {
          'has-popup-open': popupState.isOpen
        })}
        {...bindTrigger(popupState)}
      >
        {categories.map((cat) => {
          if (!week.categoryTotals[cat.slug]) {
            return null;
          }
          return (
            <div data-cat={cat.slug}>
              <div
                className="bar-piece"
                style={{
                  height: `${
                    (week.categoryTotals[cat.slug].amount / 100) * heightFactor
                  }px`
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
        <div className="chart-bar-popover">
          <h5>{week.label}</h5>
          <div className="explanation">
            {categories
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

export default ChartBar;
