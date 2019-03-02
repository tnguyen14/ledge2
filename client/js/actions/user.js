import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
	domain: 'tridnguyen.auth0.com',
	clientID: 'IxcfVZqCVF9b5FS2NVVnElOeBnoNG02Z',
	audience: 'https://tridnguyen.auth0.com/userinfo',
	responseType: 'token id_token',
	scope: 'openid profile'
});

const redirectUrl = `${window.location.href}callback.html`;

export function login() {
	auth.authorize({
		redirect_uri: redirectUrl,
		prompt: 'none'
	});
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
				if (err.error === 'login_required') {
					auth.authorize({
						redirect_uri: redirectUrl
					});
				} else {
					console.error(err);
				}
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

export const RENEWING_SESSION = 'RENEWING_SESSION';
export const RENEWED_SESSION = 'RENEWED_SESSION';

function renewSession() {
	return function(dispatch) {
		dispatch({
			type: RENEWING_SESSION
		});
		auth.checkSession((err, authResult) => {
			if (err) {
				console.error(err);
				return;
			}
			if (authResult && authResult.accessToken && authResult.idToken) {
				dispatch({
					type: RENEWED_SESSION,
					data: authResult
				});
			}
		});
	};
}

export const SCHEDULE_RENEWAL = 'SCHEDULE_RENEWAL';

export function scheduleRenewal(renewDelay) {
	const timeout = setTimeout(renewSession, renewDelay);
	return {
		type: SCHEDULE_RENEWAL,
		data: timeout
	};
}

export const LOGOUT = 'LOGOUT';

export function logout() {
	return {
		type: LOGOUT
	};
}
