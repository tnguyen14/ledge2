import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import classNames from 'https://cdn.skypack.dev/classnames@2';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';

function UserMenu(props) {
  const [profileActive, setProfileActive] = useState(false);
  const { isAuthenticated, user, logout } = useAuth0();
  const token = useSelector((state) => state.app.token);
  const expiresAt = useSelector((state) => state.app.tokenExp);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div
      className={classNames('user', {
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
        {expiresAt && (
          <li>Logged in until {format(new Date(expiresAt), 'hh:mm:ss a')}</li>
        )}
        <li className="jwt-token">{token}</li>
        <li
          className="logout"
          onClick={() =>
            logout({
              returnTo: window.location.origin
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
