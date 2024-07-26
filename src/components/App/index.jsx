import React, {
  useEffect,
  useState,
  useContext,
  useCallback
} from 'https://esm.sh/react@18.2.0';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@9.1.1';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { usePageVisibility } from 'https://esm.sh/react-page-visibility@7';
import { DateTime } from 'https://esm.sh/luxon@3';
import { format } from 'https://esm.sh/date-fns@2';
import { Octokit } from 'https://esm.sh/octokit@2.0.14';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';

import Notification from '../Notification/index.jsx';
import Header from '../Header/index.jsx';
import Login from '../Login/index.jsx';
import Cashflow from '../Cashflow/index.jsx';
import Form from '../Form/index.jsx';
import GlobalStats from '../GlobalStats/index.jsx';
import Transactions from '../Transactions/index.jsx';
import UserSettings from '../UserSettings/index.jsx';
import {
  refreshApp,
  setAppError,
  setDisplayFrom,
  setListName,
  setToken
} from '../../slices/app.js';
import { loadMetaSuccess } from '../../slices/meta.js';
import { loadTransactions } from '../../slices/transactions.js';
import {
  DATE_FIELD_FORMAT,
  TIMEZONE,
  API_AUDIENCE,
  LISTS_SCOPE
} from '../../util/constants.js';
import { getMeta, getUserMeta } from '../../util/api.js';
import OctokitContext from '../../contexts/octokit.js';
import BudgetContext from '../../contexts/budget.js';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently, logout } =
    useAuth0();
  const dispatch = useDispatch();
  const [octokit, setOctokit] = useState();
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const showCashflow = useSelector((state) => state.app.showCashflow);
  const appError = useSelector((state) => state.app.error);
  const isVisible = usePageVisibility();
  const budget = useContext(BudgetContext);
  const [budgetVersions, setBudgetVersions] = useState(budget.versions);

  const updateToken = useCallback(async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: API_AUDIENCE,
        scope: LISTS_SCOPE
      }
    });
    dispatch(setToken(accessToken));
  }, [dispatch]);

  const loadPastYears = useCallback(
    async (yearsToLoad) => {
      const now = DateTime.now().setZone(TIMEZONE);
      const start = now.minus({
        years: yearsToLoad
      });
      const startMonday = start.startOf('week');
      const endMonday = now.startOf('week').plus({ weeks: 1 });
      await dispatch(loadTransactions({ start: startMonday, end: endMonday }));
    },
    [dispatch]
  );

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
          const {
            ledge: { listName, githubAccessToken }
          } = await getUserMeta(user.sub);
          dispatch(setListName(listName));
          setOctokit(
            new Octokit({
              auth: githubAccessToken
            })
          );
          const meta = await getMeta();
          dispatch(loadMetaSuccess(meta));
          dispatch(refreshApp());
          if (window.requestIdleCallback) {
            requestIdleCallback(() => {
              dispatch(loadPastYears.bind(null, 1));
            });
          } else {
            dispatch(loadPastYears.bind(null, 1));
          }
        } catch (e) {
          console.error(e);
          dispatch(setAppError(e));
        }
        dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
      }
    })();
  }, [isAuthenticated, isVisible, user]);

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
              Force Log Out
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
              <GlobalStats />
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
