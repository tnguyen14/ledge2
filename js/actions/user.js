import { createAuth } from 'https://cdn.skypack.dev/@tridnguyen/auth@5';

const auth = createAuth();

export function login() {
  return function loginAsync(dispatch) {
    dispatch({
      type: AUTHENTICATING
    });
    auth.silentAuth();
  };
}

export const AUTHENTICATING = 'AUTHENTICATING';
export const AUTHENTICATED = 'AUTHENTICATED';

export function handleAuthentication() {
  return function handleAuthenticationAsync(dispatch) {
    auth.handleCallback((err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      if (result) {
        dispatch({
          type: AUTHENTICATED
        });
      }
    });
  };
}

export const RENEWING_SESSION = 'RENEWING_SESSION';
export const RENEWED_SESSION = 'RENEWED_SESSION';

function renewSession() {
  return function renewSessionAsync(dispatch) {
    dispatch({
      type: RENEWING_SESSION
    });
    auth.renewSession((err) => {
      if (err) {
        console.error(err);
        return;
      }
      dispatch({
        type: RENEWED_SESSION
      });
    });
  };
}

export const SCHEDULE_RENEWAL = 'SCHEDULE_RENEWAL';

export function scheduleRenewal(delay = 1000) {
  return function scheduleRenewalAsync(dispatch, getState) {
    const {
      user: { expiresAt, renewTimeout }
    } = getState();
    // only renew if there's no ongoing renewal,
    // and the session is still valid
    if (renewTimeout) {
      console.log('Renew is already scheduled');
      return;
    }
    if (expiresAt > Date.now()) {
      const timeout = setTimeout(() => {
        dispatch(renewSession());
      }, delay);
      dispatch({
        type: SCHEDULE_RENEWAL,
        data: timeout
      });
    }
  };
}

export const LOGOUT = 'LOGOUT';

export function logout() {
  return {
    type: LOGOUT
  };
}
