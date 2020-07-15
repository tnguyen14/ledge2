import React from 'react';
import WeeklyAverages from './WeeklyAverages';
import Carousel from 'react-bootstrap/Carousel';

function AccountStats() {
  return (
    <Carousel className="stats account-stats" controls={false}>
      <Carousel.Item>
        <WeeklyAverages />
      </Carousel.Item>
    </Carousel>
  );
}

export default AccountStats;
