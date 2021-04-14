import React from 'react';
import Averages from './averages';
import CategoriesChart from './categoriesChart';
import YearAverages from '../containers/yearAverages';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';
import { getWeeklyAverages } from '../selectors';

function AccountStats(props) {
  const averages = useSelector((state) => getWeeklyAverages(state));
  const categories = useSelector((state) => state.account.categories);
  const weeks = useSelector((state) => state.weeks);
  return (
    <Carousel className="stats account-stats" controls={false} interval={null}>
      <Carousel.Item>
        <Averages averages={averages} />
      </Carousel.Item>
      <Carousel.Item>
        <CategoriesChart categories={categories} weeks={weeks} />
      </Carousel.Item>
      <Carousel.Item>
        <YearAverages />
      </Carousel.Item>
    </Carousel>
  );
}

export default AccountStats;
