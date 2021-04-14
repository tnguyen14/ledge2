import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageVisibility } from 'react-page-visibility';
import { useHistory, useLocation } from 'react-router-dom';
import Form from './form';
import AccountStats from './accountStats';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from './login';
import Notification from './notification';
import { handleAuthentication } from '../actions/user';
import { loadAccount } from '../actions/account';
import { loadTransactions } from '../actions/app';

function App() {
  const dispatch = useDispatch();
  const { authenticated, isAuthenticating } = useSelector(
    (state) => state.user
  );

  const yearsToLoad = [2021, 2020, 2019];

  const isVisible = usePageVisibility();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    dispatch(handleAuthentication());

    if (authenticated) {
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
