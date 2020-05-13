import simpleFetch from 'simple-fetch';
import { LOGOUT } from '../actions/user';

function handleUnauthorizedError(dispatch, err) {
  if (err.message === 'Unauthorized') {
    dispatch({
      type: LOGOUT
    });
  }
  throw err;
}

function createFetchMethod(method) {
  return function (dispatch, idToken, url, data, opts) {
    return simpleFetch(method, url, data, {
      ...opts,
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }).then(null, handleUnauthorizedError.bind(null, dispatch));
  };
}

export const getJson = createFetchMethod('GET');
export const postJson = createFetchMethod('POST');
export const putJson = createFetchMethod('PUT');
export const patchJson = createFetchMethod('PATCH');
export const deleteJson = createFetchMethod('DELETE');
