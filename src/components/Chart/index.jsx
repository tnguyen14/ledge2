import React from 'https://esm.sh/react@18.2.0';

function Chart(props) {
  const { chartTop, chartBody, xLabels, maxAmount, intervalAmount } = props;
  const MAX_BAR_HEIGHT = 500;
  const PX_PER_UNIT = MAX_BAR_HEIGHT / maxAmount;
  const NUM_INTERVALS = maxAmount / intervalAmount;
  const INTERVAL_HEIGHT = intervalAmount * PX_PER_UNIT;
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
              key={index}
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            >
              <span className="label">{intervalAmount * (index + 1)}</span>
            </div>
          );
        })}
      </div>
      <div className="grid-lines">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              key={index}
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
