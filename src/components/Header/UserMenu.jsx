import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';

function UserMenu(props) {
  const [profileActive, setProfileActive] = useState(false);
  const { isAuthenticated, user, logout } = useAuth0();
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
              returnTo: window.location.href
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
