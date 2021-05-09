/* global localStorage */
import {
  AUTHENTICATING,
  AUTHENTICATED,
  RENEWING_SESSION,
  RENEWED_SESSION,
  SCHEDULE_RENEWAL,
  LOGOUT
} from '../actions/user.js';
import {
  getSession,
  storeSession,
  deleteSession
} from 'https://cdn.skypack.dev/@tridnguyen/auth@5';

const initialState = {
  authenticated: false,
  isAuthenticating: false,
  isRenewing: false
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: true,
        authenticated: false
      };
    case RENEWING_SESSION:
      return {
        ...state,
        isRenewing: true
      };
    case AUTHENTICATED:
    case RENEWED_SESSION:
      const newSession = getSession();
      const newState = {
        ...state,
        ...newSession,
        authenticated: true,
        isAuthenticating: false,
        isRenewing: false
      };
      delete newState.renewTimeout;
      return newState;
    case SCHEDULE_RENEWAL:
      return {
        ...state,
        renewTimeout: action.data
      };
    case LOGOUT:
      deleteSession();
      clearTimeout(state.renewTimeout);
      return initialState;
    default:
      const session = getSession();
      return session
        ? {
            ...session,
            authenticated: true
          }
        : state;
  }
}
