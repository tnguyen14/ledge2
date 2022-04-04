import qs from 'https://cdn.skypack.dev/qs@6';
import { getJson, postJson, patchJson, deleteJson } from './fetch.js';
import { SERVER_URL } from './constants.js';

export async function getTransaction(idToken, id) {
  return await getJson(idToken, `${SERVER_URL}/items/${id}`);
}

export async function getTransactions(idToken, startDate, endDate) {
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
  const transactions = await getJson(idToken, `${SERVER_URL}/items?${query}`);
  console.log(
    `Received ${transactions.length} transactions for ${start} to ${end}`
  );
  return transactions;
}

export async function getTransactionsWithMerchantName(idToken, merchant) {
  return await getJson(
    idToken,
    `${SERVER_URL}/items?${qs.stringify({
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

export async function postTransaction(idToken, data) {
  return await postJson(idToken, `${SERVER_URL}/items`, data);
}

export async function patchTransaction(idToken, data) {
  return await patchJson(idToken, `${SERVER_URL}/items/${data.id}`, data);
}

export async function deleteTransaction(idToken, id) {
  return await deleteJson(idToken, `${SERVER_URL}/items/${id}`);
}

export async function getAccount(idToken) {
  return await getJson(idToken, `${SERVER_URL}/meta`);
}

export async function patchAccount(idToken, data) {
  return await patchJson(idToken, `${SERVER_URL}/meta`, data);
}
