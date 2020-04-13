import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { showMore } from '../actions/weeks';
import Week from './week';

function Weeks(props) {
  const { weeks, showMore } = props;
  return (
    <div className="transactions">
      <Button onClick={showMore.bind(null, true)}>Look Ahead</Button>
      {Object.keys(weeks)
        .sort((a, b) => b - a)
        .map((week) => {
          return <Week key={week} offset={Number(week)} {...weeks[week]} />;
        })}
      <Button variant="success" onClick={showMore.bind(null, false)}>
        Show More
      </Button>
    </div>
  );
}

Weeks.propTypes = {
  weeks: PropTypes.object.isRequired,
  showMore: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    weeks: state.weeks
  };
}

export default connect(mapStateToProps, {
  showMore
})(Weeks);
