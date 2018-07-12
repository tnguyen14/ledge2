import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../actions/user';

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
		const { authenticated, profile, logout } = this.props;
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
					<li className="logout" onClick={logout}>
						Log Out
					</li>
				</ul>
			</div>
		);
	}
}

UserMenu.propTypes = {
	authenticated: PropTypes.bool,
	profile: PropTypes.shape({
		picture: PropTypes.string
	}),
	logout: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return state.user;
}

export default connect(mapStateToProps, {
	logout
})(UserMenu);
