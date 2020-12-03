// @ts-check

// import("../../@types/global.d.ts")

import async from 'async';
import { getJson } from '../util/fetch';

async function getTransaction(idToken, id) {
  return await getJson(idToken, `${SERVER_URL}/items/${id}`);
}

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {string} idToken JWT token
 * @param {Object} date moment object that represents the date and time of transaction
 */
export function getUniqueTransactionId(idToken, date) {
  let id = date.valueOf();
  let notFound = false;
  return new Promise((resolve, reject) => {
    async.until(
      function () {
        return notFound;
      },
      function (cb) {
        getTransaction(idToken, String(id)).then(
          () => {
            // transaction ID already exists, increment and try again
            id++;
            cb(null);
          },
          (err) => {
            if (
              err.response.status == 404 &&
              err.response.statusText == 'Not Found'
            ) {
              notFound = true;
              return cb(null, id);
            }
            return cb(err);
          }
        );
      },
      function (err, id) {
        if (err) {
          return reject(err);
        }
        resolve(String(id));
      }
    );
  });
}
