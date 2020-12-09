import React, { useEffect } from 'react';
import Form from './form';
import AccountStats from './accountStats';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from '../components/login';
import Notification from '../components/notification';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { usePageVisibility } from 'react-page-visibility';
import { login, handleAuthentication, LOGOUT } from '../actions/user';
import { loadInitialWeeks } from '../actions/weeks';
import { LOAD_ACCOUNT_SUCCESS } from '../actions/account';
import history from '../history';

function loadAccount() {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    try {
      const account = await getJson(idToken, `${SERVER_URL}/meta`);
      dispatch({
        type: LOAD_ACCOUNT_SUCCESS,
        data: account
      });
    } catch (err) {
      if (err.message == 'Unauthorized') {
        dispatch({
          type: LOGOUT
        });
        return;
      }
      throw err;
    }
  };
}

function App(props) {
  const {
    login,
    authenticated,
    isAuthenticating,
    isRenewing,
    location,
    handleAuthentication,
    loadAccount,
    loadInitialWeeks
  } = props;

  const isVisible = usePageVisibility();

  useEffect(() => {
    const callbackRegex = /callback\.html/;
    const isCallback = callbackRegex.test(location.pathname);
    const basePath = location.pathname.replace(callbackRegex, '');
    if (!isVisible) {
      return;
    }
    if (isCallback) {
      if (location.hash) {
        handleAuthentication();
      }
      history.replace(basePath);
    }

    if (authenticated) {
      loadAccount();
      loadInitialWeeks();
    }
  }, [authenticated, isVisible]);

  const notification = isRenewing
    ? {
        title: 'Authentication',
        content: 'Renewing session..'
      }
    : {};
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
  loadInitialWeeks: PropTypes.func,
  isAuthenticating: PropTypes.bool,
  isRenewing: PropTypes.bool,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {
    ...state.user
  };
}
export default connect(mapStateToProps, {
  login,
  handleAuthentication,
  loadAccount,
  loadInitialWeeks
})(App);
