import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../actions/user';
import moment from 'moment-timezone';

function UserMenu(props) {
  const [profileActive, setProfileActive] = useState(false);

  const { authenticated, profile, logout, expiresAt } = props;
  if (!authenticated) {
    return null;
  }
  return (
    <div
      className={classNames('user', {
        'profile-active': profileActive
      })}
    >
      <img
        src={profile.picture}
        onClick={() => {
          setProfileActive(!profileActive);
        }}
      />
      <ul className="profile">
        <li>{profile.name}</li>
        <li>Logged in until {moment(expiresAt).format('hh:mm:ss A')}</li>
        <li className="logout" onClick={logout}>
          Log Out
        </li>
      </ul>
    </div>
  );
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
