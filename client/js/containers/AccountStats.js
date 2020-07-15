import React from 'react';
import WeeklyAverages from './WeeklyAverages';
import CategoriesChart from './CategoriesChart';
import Carousel from 'react-bootstrap/Carousel';

function AccountStats() {
  return (
    <Carousel className="stats account-stats" controls={false} interval={null}>
      <Carousel.Item>
        <WeeklyAverages />
      </Carousel.Item>
      <Carousel.Item>
        <CategoriesChart />
      </Carousel.Item>
    </Carousel>
  );
}

export default AccountStats;
