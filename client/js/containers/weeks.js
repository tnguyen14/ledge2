import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import { addWeek } from '../actions/weeks';
import Week from './week';

function Weeks(props) {
	const { weeks, addWeek } = props;
	return (
		<div className="transactions">
			{Object.keys(weeks).map(week => {
				return (
					<Week key={week} offset={Number(week)} {...weeks[week]} />
				);
			})}
			<div className="show-more">
				<Button variant="success" onClick={addWeek}>
					Show More
				</Button>
			</div>
		</div>
	);
}

Weeks.propTypes = {
	weeks: PropTypes.object.isRequired,
	addWeek: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		weeks: state.weeks
	};
}

export default connect(
	mapStateToProps,
	{
		addWeek
	}
)(Weeks);
