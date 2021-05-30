import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { usePageVisibility } from 'https://cdn.skypack.dev/react-page-visibility@6';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import {
  useHistory,
  useLocation
} from 'https://cdn.skypack.dev/react-router-dom@5';
import Form from '../Form/index.js';
import AccountStats from '../AccountStats/index.js';
import Weeks from '../Weeks/index.js';
import DeleteDialog from '../DeleteDialog/index.js';
import Login from '../Login/index.js';
import Notification from '../Notification/index.js';
import { handleAuthentication } from '../../actions/user.js';
import { loadAccount } from '../../actions/account.js';
import { loadTransactions, setDisplayFrom } from '../../actions/app.js';
import { DATE_FIELD_FORMAT } from '../../util/constants.js';

function App() {
  const dispatch = useDispatch();
  const { authenticated, isAuthenticating } = useSelector(
    (state) => state.user
  );
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);

  const yearsToLoad = [2021, 2020, 2019];

  const isVisible = usePageVisibility();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    dispatch(handleAuthentication());

    const now = new Date();
    dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
    // only load if authenticated and haven't been loaded in an hour
    if (authenticated && now.valueOf() - lastRefreshed > 3600000) {
      dispatch(loadAccount());
      dispatch(loadTransactions(yearsToLoad));
    }
  }, [authenticated, isVisible]);

  if (isAuthenticating) {
    return <h2 className="auth-loading">Loading...</h2>;
  }
  if (!authenticated) {
    return <Login />;
  }
  return (
    <div className="app">
      <Form />
      <AccountStats />
      <Weeks />
      <DeleteDialog />
      <Notification />
    </div>
  );
}

export default App;
