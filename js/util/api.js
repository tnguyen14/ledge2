import qs from 'qs';
import { getJson, postJson, patchJson, deleteJson } from './fetch';
import { SERVER_URL } from './constants';
import { startOfDay } from 'date-fns';

export async function getTransaction(idToken, id) {
  return await getJson(idToken, `${SERVER_URL}/items/${id}`);
}

export async function getTransactions(idToken, start, end) {
  const query = qs.stringify({
    where: [
      {
        field: 'date',
        op: '>=',
        value: startOfDay(start).toISOString()
      },
      {
        field: 'date',
        op: '<',
        value: startOfDay(end).toISOString()
      }
    ]
  });
  return await getJson(idToken, `${SERVER_URL}/items?${query}`);
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
