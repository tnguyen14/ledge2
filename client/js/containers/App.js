import React, { useEffect } from 'react';
import Form from './form';
import AverageStats from './averageStats';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from '../components/login';
import Notification from '../components/notification';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, handleAuthentication } from '../actions/user';
import history from '../history';

function App(props) {
  const {
    login,
    authenticated,
    isAuthenticating,
    isRenewing,
    location,
    handleAuthentication
  } = props;

  useEffect(() => {
    const callbackRegex = /callback\.html/;
    const isCallback = callbackRegex.test(location.pathname);
    const basePath = location.pathname.replace(callbackRegex, '');
    if (isCallback) {
      if (location.hash) {
        handleAuthentication();
      }
      history.replace(basePath);
    }
  }, []);

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
      <AverageStats />
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
  handleAuthentication
})(App);
