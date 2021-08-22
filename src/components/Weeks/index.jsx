import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import { setFilter, setDisplayFrom } from '../../actions/app.js';
import Week from './Week.js';
import Field from '../Form/Field.js';

function Weeks(props) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.app.isLoading);
  const initialLoad = useSelector((state) => state.app.initialLoad);
  const filter = useSelector((state) => state.app.filter);
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const visibleWeeksIds = useSelector((state) => state.app.visibleWeeksIds);

  return (
    <div className="transactions">
      <div className="top-actions">
        <Field
          type="date"
          label="From"
          value={displayFrom}
          handleChange={(event) => {
            dispatch(setDisplayFrom(event.target.value));
          }}
        />
        <Field
          type="text"
          value={filter}
          label="Filter"
          placeholder="Filter"
          handleChange={(event) => {
            dispatch(setFilter(event.target.value.toLowerCase()));
          }}
        />
      </div>
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
    </div>
  );
}

export default Weeks;
