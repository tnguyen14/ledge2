import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { showMore } from '../actions/weeks';
import { setFilter } from '../actions/app';
import Week from './week';
import Field from '../components/field';
import PulseLoader from 'react-spinners/PulseLoader';

function Weeks(props) {
  const { weeks, showMore, isLoading, filter, setFilter } = props;
  return (
    <div className="transactions">
      <div className="top-actions">
        <Button onClick={showMore.bind(null, true)}>Look Ahead</Button>
        <Field
          type="text"
          value={filter}
          label="Search"
          placeholder="Search"
          handleChange={(event) => {
            setFilter(event.target.value);
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
      <Button variant="success" onClick={showMore.bind(null, false)}>
        Show More
      </Button>
    </div>
  );
}

Weeks.propTypes = {
  weeks: PropTypes.object.isRequired,
  showMore: PropTypes.func.isRequired,
  filter: PropTypes.string,
  setFilter: PropTypes.func,
  isLoading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    weeks: state.weeks,
    isLoading: state.app.isLoading,
    filter: state.app.filter
  };
}

export default connect(mapStateToProps, {
  showMore,
  setFilter
})(Weeks);
