import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { sortTransactions } from '../../util/transaction.js';
import { getSearchResult } from '../../selectors/transactions.js';
import Transaction from './Transaction.js';

function SearchResult() {
  const transactions = useSelector((state) => state.transactions);
  const search = useSelector((state) => state.app.search);

  const displayTransactions = sortTransactions(
    getSearchResult({
      transactions,
      search
    })
  );
  return (
    <div className="search-results transactions-container">
      <table className="transactions-list table table-striped">
        <tbody>
          {displayTransactions.map((tx) => (
            <Transaction key={tx.id} transaction={tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchResult;
