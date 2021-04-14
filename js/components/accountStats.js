import React from 'react';
import WeeklyAverages from './weeklyAverages';
import CategoriesChart from './categoriesChart';
import YearAverages from './yearAverages';
import Carousel from 'react-bootstrap/Carousel';

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
