import React from 'https://cdn.skypack.dev/react@16';
import Carousel from 'https://cdn.skypack.dev/react-bootstrap@1/Carousel';
import WeeklyAverages from './weeklyAverages.js';
import CategoriesChart from './categoriesChart.js';
import YearAverages from './yearAverages.js';

function AccountStats(props) {
  return (
    <Carousel className="stats account-stats" controls={false} interval={null}>
      <Carousel.Item>
        <WeeklyAverages />
      </Carousel.Item>
      <Carousel.Item>
        <CategoriesChart />
      </Carousel.Item>
      <Carousel.Item>
        <YearAverages />
      </Carousel.Item>
    </Carousel>
  );
}

export default AccountStats;
