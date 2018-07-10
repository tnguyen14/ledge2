import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
	domain: 'tridnguyen.auth0.com',
	clientID: 'IxcfVZqCVF9b5FS2NVVnElOeBnoNG02Z',
	audience: 'https://tridnguyen.auth0.com/userinfo',
	responseType: 'token id_token',
	scope: 'openid'
});

export const LOGIN = 'LOGIN';

export function login() {
	auth.authorize({
		redirect_uri: `${window.location.href}callback.html`
	});
	return {
		type: LOGIN
	};
}

export const AUTHENTICATING = 'AUTHENTICATING';
export const AUTHENTICATED = 'AUTHENTICATED';

export function handleAuthentication() {
	return function(dispatch) {
		dispatch({
			type: AUTHENTICATING
		});
		auth.parseHash((err, authResult) => {
			if (err) {
				console.error(err);
				return;
			}
			if (authResult && authResult.accessToken && authResult.idToken) {
				dispatch({
					type: AUTHENTICATED,
					data: authResult
				});
			}
		});
	};
}

export const LOGOUT = 'LOGOUT';

export function logout() {
	return {
		type: LOGOUT
	};
}
