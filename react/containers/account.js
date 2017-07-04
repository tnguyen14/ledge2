import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAccount } from '../actions/account';

class Account extends Component {
	componentWillMount() {
		this.props.loadAccount();
	}
	render() {
		return <div className="transactions" />;
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
