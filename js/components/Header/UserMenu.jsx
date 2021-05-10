import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import classNames from 'https://cdn.skypack.dev/classnames@2';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { logout } from '../../actions/user.js';

function UserMenu(props) {
  const dispatch = useDispatch();
  const [profileActive, setProfileActive] = useState(false);
  const user = useSelector((state) => state.user);
  const { authenticated, profile, expiresAt, idToken } = user;

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
        <li>Logged in until {format(new Date(expiresAt), 'hh:mm:ss a')}</li>
        <li className="jwt-token">{idToken}</li>
        <li className="logout" onClick={() => dispatch(logout())}>
          Log Out
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
