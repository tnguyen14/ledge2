import { toCents } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getTransaction } from './api.js';

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {string} idToken JWT token
 * @param {number} id The id as a number to check
 */
export async function getUniqueTransactionId(idToken, id) {
  try {
    await getTransaction(idToken, String(id));
    return await getUniqueTransactionId(idToken, ++id);
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

  const { description, merchant, type, category, source } = params;
  const date = new Date(`${params.date} ${params.time}`).toISOString();
  const amount = toCents(params.amount);
  const span = parseInt(params.span, 10);
  return {
    date,
    amount,
    description,
    merchant,
    type,
    category,
    source,
    span
  };
}
