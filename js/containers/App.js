import React, { useEffect } from 'react';
import Form from './form';
import AccountStats from '../components/accountStats';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from '../components/login';
import Notification from '../components/notification';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { usePageVisibility } from 'react-page-visibility';
import { login, handleAuthentication } from '../actions/user';
import { loadAccount } from '../actions/account';
import { loadTransactions } from '../actions/app';
import { useHistory, useLocation } from 'react-router-dom';

function App(props) {
  const {
    login,
    authenticated,
    isAuthenticating,
    handleAuthentication,
    loadAccount,
    loadTransactions,
    notification
  } = props;

  const yearsToLoad = [2021, 2020, 2019];

  const isVisible = usePageVisibility();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    handleAuthentication();

    if (authenticated) {
      loadAccount();
      loadTransactions(yearsToLoad);
    }
  }, [authenticated, isVisible]);

  if (isAuthenticating) {
    return <h2 className="auth-loading">Loading...</h2>;
  }
  if (!authenticated) {
    return <Login login={login} />;
  }
  return (
    <div className="app">
      <Form />
      <AccountStats />
      <Weeks />
      <DeleteDialog />
      <Notification {...notification} />
    </div>
  );
}

App.propTypes = {
  login: PropTypes.func.isRequired,
  handleAuthentication: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  loadAccount: PropTypes.func,
  isAuthenticating: PropTypes.bool,
  notification: PropTypes.object
};

function mapStateToProps(state) {
  return {
    ...state.user,
    notification: state.app.notification
  };
}
export default connect(mapStateToProps, {
  login,
  handleAuthentication,
  loadAccount,
  loadTransactions
})(App);
