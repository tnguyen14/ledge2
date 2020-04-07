import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../actions/user';
import moment from 'moment-timezone';

class UserMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			profileActive: false
		};
	}

	toggleProfile() {
		this.setState({ profileActive: !this.state.profileActive });
	}

	render() {
		const { authenticated, profile, logout, expiresAt } = this.props;
		const { profileActive } = this.state;
		const toggleProfile = this.toggleProfile.bind(this);
		if (!authenticated) {
			return null;
		}
		return (
			<div
				className={classNames('user', {
					'profile-active': profileActive
				})}
			>
				<img src={profile.picture} onClick={toggleProfile} />
				<ul className="profile">
					<li>{profile.name}</li>
					<li>
						Logged in until {moment(expiresAt).format('hh:mm:ss A')}
					</li>
					<li className="logout" onClick={logout}>
						Log Out
					</li>
				</ul>
			</div>
		);
	}
}

UserMenu.propTypes = {
	isAuthenticating: PropTypes.bool,
	authenticated: PropTypes.bool,
	profile: PropTypes.shape({
		picture: PropTypes.string,
		name: PropTypes.string
	}),
	logout: PropTypes.func.isRequired,
	expiresAt: PropTypes.number,
	renewTimeout: PropTypes.number
};

function mapStateToProps(state) {
	return state.user;
}

export default connect(mapStateToProps, {
	logout
})(UserMenu);
