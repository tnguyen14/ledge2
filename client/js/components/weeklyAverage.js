import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyAverage(props) {
	const { numWeeks, weeks, weeklyAverage } = props;
	const numMonths = numWeeks / 4;
	const label = `Last ${numWeeks} weeks (~${numMonths} ${
		numMonths === 1 ? 'month' : 'months'
	})`;
	const value = weeks.length ? money(weeklyAverage) : 'Calculating...';
	return (
		<tr className="stat">
			<td>{label}</td>
			<td>{value}</td>
		</tr>
	);
}

WeeklyAverage.propTypes = {
	numWeeks: PropTypes.number,
	weeks: PropTypes.array,
	weeklyAverage: PropTypes.number
};

export default WeeklyAverage;
