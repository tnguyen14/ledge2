import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { getSearchResult } from '../../selectors/transactions.js';
import { DISPLAY_DATE_WITH_DAY_FORMAT } from '../../util/constants.js';
import Transaction from './Transaction.js';

function SearchResult() {
  const transactions = useSelector((state) => state.transactions);
  const search = useSelector((state) => state.app.search);

  const results = getSearchResult({
    transactions: Object.keys(transactions).map((id) => transactions[id]),
    search
  });
  return (
    <div className="search-results transactions-container">
      <table className="transactions-list table table-striped">
        <tbody>
          {results.map((tx) => (
            <Transaction
              key={tx.id}
              transaction={tx}
              dateFormat={DISPLAY_DATE_WITH_DAY_FORMAT}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchResult;
