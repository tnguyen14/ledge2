import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getLoadedWeeks,
	calculateWeeklyAverages
} from '../selectors/weeklyAverages';
import WeeklyAverage from '../components/weeklyAverage';
import { addWeek } from '../actions/weeks';
import { scheduleRenewal } from '../actions/user';

class AverageStats extends Component {
	shouldComponentUpdate(nextProps) {
		const { loadedWeeks: currentWeeks } = this.props;
		const { loadedWeeks: newWeeks } = nextProps;
		// only render (and trigger componentDidUpdate) if a new week
		// has been loaded
		return newWeeks.length > currentWeeks.length;
	}
	render() {
		const { weeklyAverages } = this.props;

		return (
			<div className="stats averages">
				<h4>Weekly Averages</h4>
				<table className="table">
					<tbody>
						{weeklyAverages.map((average, index) => (
							<WeeklyAverage key={index} {...average} />
						))}
					</tbody>
				</table>
			</div>
		);
	}
	componentDidUpdate() {
		const { loadedWeeks, addWeek, scheduleRenewal } = this.props;
		// wait until the first 4 weeks are loaded, then keep adding
		// until 6 months
		// once loading weeks, renew session
		if (loadedWeeks.length >= 4) {
			if (loadedWeeks.length < 25) {
				addWeek();
			} else {
				scheduleRenewal();
			}
		}
	}
}

AverageStats.propTypes = {
	loadedWeeks: PropTypes.array,
	weeklyAverages: PropTypes.array,
	addWeek: PropTypes.func,
	scheduleRenewal: PropTypes.func
};

function mapStateToProps(state) {
	return {
		loadedWeeks: getLoadedWeeks(state),
		weeklyAverages: calculateWeeklyAverages(state)
	};
}

export default connect(
	mapStateToProps,
	{ addWeek, scheduleRenewal }
)(AverageStats);
