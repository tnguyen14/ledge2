import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyAverage(props) {
	const { numWeeks, weeklyAverage } = props;
	return numWeeks ? (
		<div>{money(weeklyAverage)}</div>
	) : (
		<div>Calculating average..</div>
	);
}

WeeklyAverage.propTypes = {
	numWeeks: PropTypes.number,
	weeklyAverage: PropTypes.number
};

export default WeeklyAverage;
