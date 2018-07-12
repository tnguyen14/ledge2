import React, { Component } from 'react';
import Form from './form';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from '../components/login';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, handleAuthentication } from '../actions/user';
import history from '../history';

class App extends Component {
	componentWillMount() {
		const { location, handleAuthentication } = this.props;
		const callbackRegex = /callback\.html/;
		const isCallback = callbackRegex.test(location.pathname);
		const basePath = location.pathname.replace(callbackRegex, '');
		if (isCallback) {
			if (location.hash) {
				handleAuthentication();
			}
			history.replace(basePath);
		}
	}
	render() {
		const { login, authenticated, isAuthenticating } = this.props;
		if (isAuthenticating) {
			return <h2>Loading...</h2>;
		}
		if (!authenticated) {
			return <Login login={login} />;
		}
		return (
			<div className="app">
				<Form />
				<Weeks />
				<DeleteDialog />
			</div>
		);
	}
}

App.propTypes = {
	login: PropTypes.func.isRequired,
	handleAuthentication: PropTypes.func.isRequired,
	authenticated: PropTypes.bool.isRequired,
	isAuthenticating: PropTypes.bool,
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
