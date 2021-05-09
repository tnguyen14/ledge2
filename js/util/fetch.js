import simpleFetch from 'https://cdn.skypack.dev/simple-fetch@2';

function createFetchMethod(method) {
  return function fetchMethod(idToken, url, data, opts) {
    return simpleFetch(method, url, data, {
      ...opts,
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
  };
}

export const getJson = createFetchMethod('GET');
export const postJson = createFetchMethod('POST');
export const putJson = createFetchMethod('PUT');
export const patchJson = createFetchMethod('PATCH');
export const deleteJson = createFetchMethod('DELETE');
