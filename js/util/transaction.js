import { toCents } from '@tridnguyen/money';
import { getTransaction } from './api';

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {string} idToken JWT token
 * @param {number} id The id as a number to check
 */
export async function getUniqueTransactionId(idToken, id) {
  try {
    await getTransaction(idToken, String(id));
    return await getUniqueTransactionId(idToken, id++);
  } catch (e) {
    if (e.response.status == 404) {
      return String(id);
    }
    throw e;
  }
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

  const { description, merchant, status, category, source } = params;
  const date = new Date().toISOString();
  const amount = toCents(params.amount);
  const span = parseInt(params.span, 10);
  return {
    date,
    amount,
    description,
    merchant,
    status,
    category,
    source,
    span
  };
}

export function sortTransactions(transactions) {
  return transactions.sort((a, b) => {
    // sort by id, which is the transaction timestamp
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  });
}
