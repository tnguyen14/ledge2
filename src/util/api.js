import qs from 'https://cdn.skypack.dev/qs@6';
import { getJson, postJson, patchJson, deleteJson } from './fetch.js';
import { LEDGE_URL, USERMETA_URL } from './constants.js';
import store from '../store.js';

export async function getTransaction(id) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transaction');
  }
  return await getJson(`${LEDGE_URL}/${listName}/items/${id}`);
}

export async function getTransactions(startDate, endDate) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transactions');
  }
  // convert time to UTC first, because time is stored in UTC on the server
  // as UTC is the value returned by JavaScript Date's toISOString method
  const start = startDate.toUTC().toISO();
  const end = endDate.toUTC().toISO();
  const query = qs.stringify({
    where: [
      {
        field: 'date',
        op: '>=',
        value: start
      },
      {
        field: 'date',
        op: '<',
        value: end
      }
    ]
  });
  const transactions = await getJson(`${LEDGE_URL}/${listName}/items?${query}`);
  console.log(
    `Received ${transactions.length} transactions for ${start} to ${end}`
  );
  return transactions;
}

export async function getTransactionsWithMerchantName(merchant) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transactions');
  }
  return await getJson(
    `${LEDGE_URL}/${listName}/items?${qs.stringify({
      where: [
        {
          field: 'merchant',
          op: '==',
          value: merchant
        }
      ]
    })}`
  );
}

export async function postTransaction(data) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to create transaction');
  }
  return await postJson(`${LEDGE_URL}/${listName}/items`, data);
}

export async function patchTransaction(data) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to update transaction');
  }
  return await patchJson(`${LEDGE_URL}/${listName}/items/${data.id}`, data);
}

export async function deleteTransaction(id) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to delete transaction');
  }
  return await deleteJson(`${LEDGE_URL}/${listName}/items/${id}`);
}

export async function getMeta() {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to load meta');
  }
  return await getJson(`${LEDGE_URL}/${listName}/meta`);
}

export async function patchMeta(data) {
  const {
    app: { listName }
  } = store.getState();
  return await patchJson(`${LEDGE_URL}/${listName}/meta`, data);
}

export async function getUserMeta(userId) {
  return await getJson(`${USERMETA_URL}/items/${encodeURIComponent(userId)}`);
}
