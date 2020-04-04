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
			{Object.keys(weeks).map(week => {
				return (
					<Week key={week} offset={Number(week)} {...weeks[week]} />
				);
			})}
			<div className="show-more">
				<Button variant="success" onClick={showMore}>
					Show More
				</Button>
			</div>
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

export default connect(
	mapStateToProps,
	{
		showMore
	}
)(Weeks);
