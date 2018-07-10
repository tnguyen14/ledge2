import React from 'react';
import PropTypes from 'prop-types';

function Login(props) {
	const { login } = props;
	return <button onClick={login}>Log In</button>;
}

Login.propTypes = {
	login: PropTypes.func.isRequired
};

export default Login;
