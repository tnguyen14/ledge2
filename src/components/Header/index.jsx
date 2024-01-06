import React from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { setDisplayFrom } from '../../slices/app.js';
import UserMenu from './UserMenu.js';
import Field from '../Form/Field.js';

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
