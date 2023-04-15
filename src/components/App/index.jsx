import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@2';
import { usePageVisibility } from 'https://cdn.skypack.dev/react-page-visibility@6';
import { format } from 'https://cdn.skypack.dev/date-fns@2';

import Notification from '../Notification/index.js';
import Header from '../Header/index.js';
import Login from '../Login/index.js';
import Cashflow from '../Cashflow/index.js';
import Form from '../Form/index.js';
import GlobalStats from '../GlobalStats/index.js';
import Transactions from '../Transactions/index.js';
import UserSettings from '../UserSettings/index.js';
import {
  refreshApp,
  setToken,
  setListName,
  setDisplayFrom,
  loadPastYears,
  setAppError
} from '../../actions/app.js';
import { loadMeta } from '../../actions/meta.js';
import { DATE_FIELD_FORMAT } from '../../util/constants.js';
import { getUserMeta } from '../../util/api.js';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();
  const dispatch = useDispatch();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const showCashflow = useSelector((state) => state.app.showCashflow);
  const search = useSelector((state) => state.app.search);
  const appError = useSelector((state) => state.app.error);
  const isVisible = usePageVisibility();

  async function updateToken() {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://lists.cloud.tridnguyen.com',
        scope: 'openid profile email'
      }
    });
    dispatch(setToken(accessToken));
    const {
      ledge: { listName }
    } = await getUserMeta(user.sub);
    dispatch(setListName(listName));
  }

  useEffect(() => {
    if (!isAuthenticated || !isVisible) {
      return;
    }
    const now = new Date();
    // reload if haven't been refreshed in an hour
    const shouldReload = now.valueOf() - lastRefreshed > 3600000;
    (async () => {
      if (shouldReload) {
        try {
          await updateToken();
          dispatch(loadMeta());
          dispatch(refreshApp());
          requestIdleCallback(() => {
            dispatch(loadPastYears(1));
          });
        } catch (e) {
          console.error(e);
          dispatch(setAppError(e));
        }
        dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
      }
    })();
  }, [isAuthenticated, isVisible]);

  return (
    <div className="app">
      <Header />
      {!isAuthenticated &&
        (isLoading ? <h2 className="auth-loading">Loading...</h2> : <Login />)}
      {appError && (
        <div className="app-error">
          <p>Error loading app</p>
          <p>
            <pre>{appError.message}</pre>
            <pre>{JSON.stringify(appError)}</pre>
          </p>
        </div>
      )}
      {isAuthenticated && !appError && (
        <>
          <div className="app-top">
            <Form />
            {!search && <GlobalStats />}
          </div>
          <div className="app-bottom">
            {showCashflow ? <Cashflow /> : <Transactions />}
          </div>
          <Notification />
          <UserSettings />
        </>
      )}
    </div>
  );
}

export default App;
