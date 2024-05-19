import React from 'https://esm.sh/react@18.2.0';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import {
  usePopupState,
  bindPopover,
  bindTrigger
} from 'https://esm.sh/material-ui-popup-state@5.1.0/hooks';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import classnames from 'https://esm.sh/classnames@2';

function CategoryBar(props) {
  const {
    categories,
    week: { label, categoriesTotals }
  } = props;
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${label}-chart-popup`
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
        {categoriesTotals &&
          categories.map((cat) => {
            if (!categoriesTotals[cat.slug]) {
              return null;
            }
            return (
              <div key={cat.slug} data-cat={cat.slug}>
                <div
                  className="bar-piece"
                  style={{
                    height: `calc(${
                      categoriesTotals[cat.slug].amount / 100
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
          <h5>{label}</h5>
          <div className="explanation">
            {categoriesTotals &&
              categories
                .map(({ slug }) => {
                  if (!categoriesTotals[slug]) {
                    return null;
                  }
                  const { label, amount } = categoriesTotals[slug];
                  return (
                    <>
                      <span data-cat={slug}>
                        <span className="legend">&nbsp;</span>
                        {label}
                      </span>
                      <span>{usd(amount)}</span>
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
