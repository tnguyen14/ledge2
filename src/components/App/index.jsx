import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import {
  HashRouter,
  Switch,
  Route
} from 'https://cdn.skypack.dev/react-router-dom@5';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
import { usePageVisibility } from 'https://cdn.skypack.dev/react-page-visibility@6';

import Notification from '../Notification/index.js';
import Header from '../Header/index.js';
import Login from '../Login/index.js';
import Expense from '../Expense/index.js';
import Cashflow from '../Cashflow/index.js';
import { refreshApp, setToken } from '../../actions/app.js';
import { loadYears } from '../../actions/years.js';
import { resetForm } from '../../actions/form.js';

function AuthenticatedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return null;
  }
  return <Route component={Component} {...rest} />;
}
function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const token = useSelector((state) => state.app.token);
  const isVisible = usePageVisibility();

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
      requestIdleCallback(() => {
        dispatch(loadYears());
      });
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
        dispatch(resetForm());
        await updateToken();
        dispatch(refreshApp());
      }
    })();
  }, [isVisible]);

  return (
    <HashRouter>
      <div className="app">
        <Header />
        {!isAuthenticated &&
          (isLoading ? (
            <h2 className="auth-loading">Loading...</h2>
          ) : (
            <Login />
          ))}
        <Switch>
          <AuthenticatedRoute exact path="/" component={Expense} />
          <AuthenticatedRoute exact path="/cashflow" component={Cashflow} />
        </Switch>
        <Notification />
      </div>
    </HashRouter>
  );
}

export default App;
