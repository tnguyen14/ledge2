import simpleFetch from 'https://cdn.skypack.dev/simple-fetch@2';
import store from '../store.js';

function createFetchMethod(method) {
  return function fetchMethod(url, data, opts) {
    const {
      app: { token }
    } = store.getState();
    return simpleFetch(method, url, data, {
      ...opts,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
}

export const getJson = createFetchMethod('GET');
export const postJson = createFetchMethod('POST');
export const putJson = createFetchMethod('PUT');
export const patchJson = createFetchMethod('PATCH');
export const deleteJson = createFetchMethod('DELETE');
