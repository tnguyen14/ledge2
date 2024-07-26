import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import Spinner from 'https://esm.sh/react-bootstrap@2.10.2/Spinner';
import Week from './Week.jsx';
import SearchResult from './SearchResult.jsx';
import DeleteDialog from '../DeleteDialog/index.jsx';
import { getPastWeeksIds } from '../../selectors/week.js';

function Weeks() {
  const isLoading = useSelector((state) => state.app.isLoading);
  const isSearch = useSelector((state) => state.app.isSearch);
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const visibleWeeksIds = getPastWeeksIds({
    weekId: displayFrom,
    numWeeks: 4
  });

  return (
    <div className="transactions">
      <div className="transactions-loading">
        {isLoading && <Spinner animation="border" variant="success" />}
      </div>
      {isSearch ? (
        <SearchResult />
      ) : (
        <div className="weeks">
          {visibleWeeksIds.map((weekId) => {
            return <Week key={weekId} weekId={weekId} />;
          })}
        </div>
      )}
      <DeleteDialog />
    </div>
  );
}

export default Weeks;
