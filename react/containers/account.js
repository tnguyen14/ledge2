import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAccount } from '../actions/account';
import Week from './week';

class Account extends Component {
	componentWillMount() {
		this.props.loadAccount();
	}
	render() {
		const { weeks } = this.props;
		return (
			<div className="transactions">
				{weeks.map(week => {
					return <Week offset={week} />;
				})}
			</div>
		);
	}
}

Account.propTypes = {
	weeks: PropTypes.array.isRequired
};
function mapStateToProps(state) {
	return state.account;
}
export default connect(mapStateToProps, {
	loadAccount
})(Account);
