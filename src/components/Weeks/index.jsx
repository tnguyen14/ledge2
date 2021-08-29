import React from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import { setFilter } from '../../actions/app.js';
import Week from './Week.js';
import Field from '../Form/Field.js';
import DeleteDialog from '../DeleteDialog/index.js';
import { getPastWeeksIds } from '../../selectors/week.js';

function Weeks(props) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.app.isLoading);
  const initialLoad = useSelector((state) => state.app.initialLoad);
  const filter = useSelector((state) => state.app.filter);
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const visibleWeeksIds = getPastWeeksIds({
    weekId: displayFrom,
    numWeeks: filter ? 10 : 3
  });

  return (
    <div className="transactions">
      <Field
        className="filter"
        type="text"
        value={filter}
        placeholder="Filter"
        handleChange={(event) => {
          dispatch(setFilter(event.target.value.toLowerCase()));
        }}
      />
      <div className="transactions-loading">
        {isLoading && <Spinner animation="border" variant="success" />}
      </div>
      {initialLoad && (
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
