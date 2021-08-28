import React from 'https://cdn.skypack.dev/react@17';

function Chart(props) {
  const { maxHeight, interval, chartTop, chartBody, xLabels } = props;
  const NUM_INTERVALS = maxHeight / interval;
  const BAR_HEIGHT = 500; // bar height
  const HEIGHT_FACTOR = BAR_HEIGHT / maxHeight;
  const INTERVAL_HEIGHT = interval * HEIGHT_FACTOR;
  return (
    <div
      className="chart"
      style={{ '--px-per-unit-height': `${HEIGHT_FACTOR}px` }}
    >
      <div className="chart-top">{chartTop}</div>
      <div className="y-axis">
        {[...Array(NUM_INTERVALS).keys()].map((index) => {
          return (
            <div
              className="interval"
              style={{ height: `${INTERVAL_HEIGHT}px` }}
            >
              <span className="label">{interval * (index + 1)}</span>
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
