import React, { useState } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@7';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { setUserSettingsOpen } from '../../actions/app.js';

function UserMenu() {
  const [profileActive, setProfileActive] = useState(false);
  const { isAuthenticated, user, logout } = useAuth0();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div
      className={classnames('user', {
        'profile-active': profileActive
      })}
    >
      <img
        src={user.picture}
        onClick={() => {
          setProfileActive(!profileActive);
        }}
      />
      <ul className="profile">
        <li>{user.name}</li>
        <li
          className="settings"
          onClick={() => dispatch(setUserSettingsOpen(true))}
        >
          Settings
        </li>
        <li className="jwt-token">
          <details>
            <summary>JWT Token</summary>
            {token}
          </details>
        </li>
        <li
          className="logout"
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.href
              }
            })
          }
        >
          Log Out
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
