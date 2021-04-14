import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { showMore } from '../actions/weeks';
import { setFilter } from '../actions/app';
import Week from './week';
import Field from '../components/field';
import PulseLoader from 'react-spinners/PulseLoader';

function Weeks(props) {
  const dispatch = useDispatch();
  const weeks = useSelector((state) => state.weeks);
  const isLoading = useSelector((state) => state.app.isLoading);
  const filter = useSelector((state) => state.app.filter);

  return (
    <div className="transactions">
      <div className="top-actions">
        <Button onClick={() => dispatch(showMore(true))}>Look Ahead</Button>
        <Field
          type="text"
          value={filter}
          label="Search"
          placeholder="Search"
          handleChange={(event) => {
            dispatch(setFilter(event.target.value.toLowerCase()));
          }}
        />
      </div>
      <div className="transactions-loading">
        <PulseLoader loading={isLoading} />
      </div>
      <div className="weeks">
        {Object.keys(weeks)
          .sort((a, b) => b - a)
          .map((week) => {
            return <Week key={week} offset={Number(week)} />;
          })}
      </div>
      <Button variant="success" onClick={() => dispatch(showMore(false))}>
        Show More
      </Button>
    </div>
  );
}

export default Weeks;
