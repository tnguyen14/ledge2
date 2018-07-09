/* global localStorage */
import auth0 from 'auth0-js';
import history from './history';

// heavily copied from Auth0 documentation

const auth = new auth0.WebAuth({
	domain: 'tridnguyen.auth0.com',
	clientID: 'IxcfVZqCVF9b5FS2NVVnElOeBnoNG02Z',
	audience: 'https://tridnguyen.auth0.com/userinfo',
	responseType: 'token id_token',
	scope: 'openid'
});

export default auth;

export const handleAuthentication = () => {
	auth.parseHash((err, authResult) => {
		if (err) {
			console.error(err);
			return;
		}
		if (authResult && authResult.accessToken && authResult.idToken) {
			setSession(authResult);
			history.replace('/ledge/');
		}
	});
};

const setSession = authResult => {
	// Set the time that the Access Token will expire at
	let expiresAt = JSON.stringify(
		authResult.expiresIn * 1000 + new Date().getTime()
	);
	localStorage.setItem('access_token', authResult.accessToken);
	localStorage.setItem('id_token', authResult.idToken);
	localStorage.setItem('expires_at', expiresAt);
};

export const logout = () => {
	// Clear Access Token and ID Token from local storage
	localStorage.removeItem('access_token');
	localStorage.removeItem('id_token');
	localStorage.removeItem('expires_at');
	// navigate to the home route
	history.replace('/home');
};

export const isAuthenticated = () => {
	// Check whether the current time is past the
	// Access Token's expiry time
	let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	return new Date().getTime() < expiresAt;
};
