import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addWeek } from '../actions/weeks';
import Week from './week';

function Weeks(props) {
	const { weeks, addWeek } = props;
	return (
		<div className="transactions">
			{Object.keys(weeks).map(week => {
				return <Week key={week} offset={Number(week)} {...weeks[week]} />;
			})}
			<button className="btn btn-success" onClick={addWeek}>
				Show More
			</button>
		</div>
	);
}

Weeks.propTypes = {
	weeks: PropTypes.object.isRequired
};
function mapStateToProps(state) {
	return {
		weeks: state.weeks
	};
}
export default connect(mapStateToProps, {
	addWeek
})(Weeks);
