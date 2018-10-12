import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyAverage(props) {
	const { numWeeks, weeklyAverage } = props;
	const numMonths = numWeeks / 4;
	const label = numWeeks
		? `Last ${numWeeks} weeks (~${numMonths} ${
				numMonths === 1 ? 'month' : 'months'
		  })`
		: 'Calculating average...';
	const value = weeklyAverage ? money(weeklyAverage) : '';
	return (
		<tr className="stat">
			<td>{label}</td>
			<td>{value}</td>
		</tr>
	);
}

WeeklyAverage.propTypes = {
	numWeeks: PropTypes.number,
	weeklyAverage: PropTypes.number
};

export default WeeklyAverage;
