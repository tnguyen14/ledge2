import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
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
  loadPastYears
} from '../../actions/app.js';
import { loadMeta } from '../../actions/meta.js';
import { DATE_FIELD_FORMAT, AUTH0_DOMAIN } from '../../util/constants.js';
import { getJson } from '../../util/fetch.js';

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const showCashflow = useSelector((state) => state.app.showCashflow);
  const search = useSelector((state) => state.app.search);
  const isVisible = usePageVisibility();

  async function updateToken() {
    const accessToken = await getAccessTokenSilently({
      audience: 'https://lists.cloud.tridnguyen.com',
      scope: 'openid profile email user_metadata'
    });
    dispatch(setToken(accessToken));
    const userInfo = await getJson(`https://${AUTH0_DOMAIN}/userinfo`);
    const {
      ledge: { listName }
    } = userInfo[`https://${AUTH0_DOMAIN.replaceAll('.', ':')}/user_metadata`];
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
        } catch (e) {
          console.error(e);
        }
        dispatch(loadMeta());
        dispatch(refreshApp());
        dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
        requestIdleCallback(() => {
          dispatch(loadPastYears(1));
        });
      }
    })();
  }, [isAuthenticated, isVisible]);

  return (
    <div className="app">
      <Header />
      {!isAuthenticated &&
        (isLoading ? <h2 className="auth-loading">Loading...</h2> : <Login />)}
      {isAuthenticated && (
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
