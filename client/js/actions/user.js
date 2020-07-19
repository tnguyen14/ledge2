import { createAuth } from '@tridnguyen/auth';

const redirectUri = `${window.location.href}callback.html`;

const auth = createAuth({
  redirectUri
});

export function login() {
  return function (dispatch) {
    auth.silentAuth();
  };
}

export const AUTHENTICATING = 'AUTHENTICATING';
export const AUTHENTICATED = 'AUTHENTICATED';

export function handleAuthentication() {
  return function (dispatch) {
    dispatch({
      type: AUTHENTICATING
    });
    auth.handleCallback((err) => {
      if (err) {
        console.error(err);
        return;
      }
      dispatch({
        type: AUTHENTICATED
      });
    });
  };
}

export const RENEWING_SESSION = 'RENEWING_SESSION';
export const RENEWED_SESSION = 'RENEWED_SESSION';

function renewSession(dispatch) {
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
}

export const SCHEDULE_RENEWAL = 'SCHEDULE_RENEWAL';

export function scheduleRenewal(delay = 1000) {
  return function (dispatch, getState) {
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
      const timeout = setTimeout(renewSession.bind(null, dispatch), delay);
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
