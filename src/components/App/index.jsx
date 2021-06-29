import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { usePageVisibility } from 'https://cdn.skypack.dev/react-page-visibility@6';
import {
  useHistory,
  useLocation
} from 'https://cdn.skypack.dev/react-router-dom@5';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
import Form from '../Form/index.js';
import AccountStats from '../AccountStats/index.js';
import Weeks from '../Weeks/index.js';
import DeleteDialog from '../DeleteDialog/index.js';
import Login from '../Login/index.js';
import Notification from '../Notification/index.js';
import { loadAccount } from '../../actions/account.js';
import { loadTransactions, refreshApp, setToken } from '../../actions/app.js';

function App() {
  const dispatch = useDispatch();
  const {
    isLoading,
    isAuthenticated,
    getIdTokenClaims,
    getAccessTokenSilently
  } = useAuth0();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const token = useSelector((state) => state.app.token);

  const isVisible = usePageVisibility();

  const history = useHistory();
  const location = useLocation();

  async function updateToken() {
    const accessToken = await getAccessTokenSilently({
      audience: 'https://lists.cloud.tridnguyen.com'
    });
    dispatch(setToken(accessToken));
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    (async () => {
      await updateToken();
      dispatch(refreshApp());
      dispatch(loadTransactions());
    })();
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isVisible || !isAuthenticated) {
      return;
    }
    const now = new Date();
    // reload if haven't been loaded in an hour
    const shouldReload = now.valueOf() - lastRefreshed > 3600000;
    (async () => {
      if (shouldReload) {
        await updateToken();
        dispatch(refreshApp());
      }
    })();
  }, [isVisible]);

  if (isLoading) {
    return <h2 className="auth-loading">Loading...</h2>;
  }
  if (!isAuthenticated) {
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
