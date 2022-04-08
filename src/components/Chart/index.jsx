import React from 'https://cdn.skypack.dev/react@17';

function Chart(props) {
  const { chartTop, chartBody, xLabels } = props;
  const MAX_AMOUNT = 2500;
  const GRID_INTERVAL_AMOUNT = 500;
  const MAX_BAR_HEIGHT = 500;
  const PX_PER_UNIT = MAX_BAR_HEIGHT / MAX_AMOUNT;
  const NUM_INTERVALS = MAX_AMOUNT / GRID_INTERVAL_AMOUNT;
  const INTERVAL_HEIGHT = GRID_INTERVAL_AMOUNT * PX_PER_UNIT;
  return (
    <div
      className="chart"
      style={{ '--px-per-unit-height': `${PX_PER_UNIT}px` }}
    >
      <div className="chart-top">{chartTop}</div>
      <div className="y-axis">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            >
              <span className="label">
                {GRID_INTERVAL_AMOUNT * (index + 1)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid-lines">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            ></div>
          );
        })}
      </div>
      <div className="chart-body">{chartBody}</div>
      <div className="spacer"></div>
      <div className="x-axis">{xLabels}</div>
    </div>
  );
}

export default Chart;
