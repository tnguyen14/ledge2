import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { setDisplayFrom } from '../../slices/app.js';
import UserMenu from './UserMenu.jsx';
import Field from '../Form/Field.jsx';

function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth0();
  const displayFrom = useSelector((state) => state.app.displayFrom);
  return (
    <div className="header">
      <h1>Ledge</h1>
      {isAuthenticated && (
        <Field
          className="display-from"
          type="date"
          value={displayFrom}
          handleChange={(event) => {
            dispatch(setDisplayFrom(event.target.value));
          }}
        />
      )}
      <UserMenu />
    </div>
  );
}

export default Header;
