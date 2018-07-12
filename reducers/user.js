/* global localStorage */
import { AUTHENTICATING, AUTHENTICATED, LOGOUT } from '../actions/user';
import getUser from '../util/user';

const initialState = {
	authenticated: false,
	isAuthenticating: false
};

function isAuthenticated(user) {
	return new Date().getTime() < user.expiresAt;
}

function storeSession(user) {
	localStorage.setItem('access_token', user.accessToken);
	localStorage.setItem('id_token', user.idToken);
	localStorage.setItem('expires_at', JSON.stringify(user.expiresAt));
}

function deleteSession() {
	localStorage.removeItem('access_token');
	localStorage.removeItem('id_token');
	localStorage.removeItem('expires_at');
}

function getSession() {
	const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	if (isAuthenticated({ expiresAt })) {
		// Auth0 example does not retrieve these tokens
		// but it seems like they should be
		const accessToken = localStorage.getItem('access_token');
		const idToken = localStorage.getItem('id_token');
		return {
			authenticated: true,
			expiresAt,
			accessToken,
			idToken,
			profile: getUser(idToken)
		};
	}
	// if not authenticated, remove any existing session
	deleteSession();
}

export default function user(state = initialState, action) {
	switch (action.type) {
		case AUTHENTICATING:
			return {
				...state,
				isAuthenticating: true,
				authenticated: false
			};
		case AUTHENTICATED:
			const { accessToken, idToken, expiresIn } = action.data;
			const expiresAt = expiresIn * 1000 + new Date().getTime();
			const newState = {
				...state,
				isAuthenticating: false,
				authenticated: isAuthenticated({ expiresAt }),
				expiresAt,
				accessToken,
				idToken,
				profile: getUser(idToken)
			};
			storeSession(newState);
			return newState;
		case LOGOUT:
			deleteSession();
			return initialState;
		default:
			return getSession() || state;
	}
}
