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
import AccountStats from '../AccountStats/index.js';
import Transactions from '../Transactions/index.js';
import { refreshApp, setToken, setDisplayFrom } from '../../actions/app.js';
import { loadAccount } from '../../actions/account.js';
import { DATE_FIELD_FORMAT } from '../../util/constants.js';

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const token = useSelector((state) => state.app.token);
  const showCashflow = useSelector((state) => state.app.showCashflow);
  const search = useSelector((state) => state.app.search);
  const isVisible = usePageVisibility();

  async function updateToken() {
    const accessToken = await getAccessTokenSilently({
      audience: 'https://lists.cloud.tridnguyen.com'
    });
    dispatch(setToken(accessToken));
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
        dispatch(loadAccount());
        dispatch(refreshApp());
        dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
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
            {!search && <AccountStats />}
          </div>
          <div className="app-bottom">
            {showCashflow ? <Cashflow /> : <Transactions />}
          </div>
          <Notification />
        </>
      )}
    </div>
  );
}

export default App;
