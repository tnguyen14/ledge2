import React from 'react';
import PropTypes from 'prop-types';

function Login(props) {
  return (
    <div className="login">
      <button className="btn" onClick={props.login}>
        Log In
      </button>
    </div>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired
};

export default Login;
