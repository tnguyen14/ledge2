import React, {
  useEffect,
  useState,
  useContext
} from 'https://esm.sh/react@18';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@7';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { usePageVisibility } from 'https://esm.sh/react-page-visibility@7';
import { format } from 'https://esm.sh/date-fns@2';
import { Octokit } from 'https://esm.sh/octokit@2.0.14';
import Button from 'https://esm.sh/react-bootstrap@2/Button';

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
import OctokitContext from '../../contexts/octokit.js';
import BudgetContext from '../../contexts/budget.js';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently, logout } =
    useAuth0();
  const dispatch = useDispatch();
  const [octokit, setOctokit] = useState();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const showCashflow = useSelector((state) => state.app.showCashflow);
  const isSearch = useSelector((state) => state.app.isSearch);
  const appError = useSelector((state) => state.app.error);
  const isVisible = usePageVisibility();
  const budget = useContext(BudgetContext);
  const [budgetVersions, setBudgetVersions] = useState(budget.versions);

  async function updateToken() {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://lists.cloud.tridnguyen.com',
        scope: 'openid profile email'
      }
    });
    dispatch(setToken(accessToken));
    const {
      ledge: { listName, githubAccessToken }
    } = await getUserMeta(user.sub);
    dispatch(setListName(listName));
    setOctokit(
      new Octokit({
        auth: githubAccessToken
      })
    );
  }

  useEffect(() => {
    if (!octokit) {
      return;
    }
    (async () => {
      const commits = await octokit.rest.repos.listCommits(budget.repo);
      setBudgetVersions(
        commits.data
          .map((commit) => ({
            sha: commit.sha,
            message: commit.commit.message,
            // DO I NEED TO WORRY ABOUT TIMEZONE HERE??
            date: new Date(commit.commit.author.date)
          }))
          .reverse()
      );
    })();
  }, [octokit]);

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
          <p>
            <Button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.href
                  }
                })
              }
            >
              Log Out
            </Button>
          </p>
        </div>
      )}
      {isAuthenticated && !appError && (
        <OctokitContext.Provider value={octokit}>
          <BudgetContext.Provider
            value={{ ...budget, versions: budgetVersions }}
          >
            <div className="app-top">
              <Form />
              {!isSearch && <GlobalStats />}
            </div>
            <div className="app-bottom">
              {showCashflow ? <Cashflow /> : <Transactions />}
            </div>
            <Notification />
            <UserSettings />
          </BudgetContext.Provider>
        </OctokitContext.Provider>
      )}
    </div>
  );
}

export default App;
