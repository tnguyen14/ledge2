import async from 'async';
import { getJson } from '../util/fetch';
import moment from 'moment-timezone';
import pick from 'lodash.pick';
import { toCents } from '@tridnguyen/money';
import qs from 'qs';

async function getTransaction(idToken, id) {
  return await getJson(idToken, `${window.SERVER_URL}/items/${id}`);
}

export async function getTransactions(idToken, start, end) {
  const query = qs.stringify({
    where: [
      {
        field: 'date',
        op: '>=',
        value: start.startOf('day').toISOString()
      },
      {
        field: 'date',
        op: '<',
        value: end.startOf('day').toISOString()
      }
    ]
  });
  return await getJson(idToken, `${window.SERVER_URL}/items?${query}`);
}

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {string} idToken JWT token
 * @param {string} date transaction date and time
 */
export async function getUniqueTransactionId(idToken, date) {
  let id = moment(date).valueOf();
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
            if (err.response.status == 404) {
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

export function decorateTransaction(params) {
  const opts = {};
  if (!(params.date && params.time)) {
    throw new Error('Date and time are required for a transaction');
  }
  if (!params.amount) {
    throw new Error('Amount is required for transaction');
  }
  if (!params.span) {
    throw new Error('Span is required for transaction');
  }
  opts.date = moment
    .tz(`${params.date} ${params.time}`, window.TIMEZONE)
    .toISOString();
  opts.amount = toCents(params.amount);
  opts.span = parseInt(params.span, 10);

  return {
    ...pick(params, [
      'description',
      'merchant',
      'status',
      'category',
      'source'
    ]),
    ...opts
  };
}

export function sortTransactions(transactions) {
  return transactions.sort((a, b) => {
    // sort by id, which is the transaction timestamp
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  });
}
