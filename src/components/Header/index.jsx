import React from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { setDisplayFrom } from '../../actions/app.js';
import UserMenu from './UserMenu.js';
import Field from '../Form/Field.js';

function Header() {
  const dispatch = useDispatch();
  const displayFrom = useSelector((state) => state.app.displayFrom);
  return (
    <div className="header">
      <h1>Ledge</h1>
      <Field
        className="display-from"
        type="date"
        value={displayFrom}
        handleChange={(event) => {
          dispatch(setDisplayFrom(event.target.value));
        }}
      />
      <UserMenu />
    </div>
  );
}

export default Header;
