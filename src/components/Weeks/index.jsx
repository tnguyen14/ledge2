import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import { showMore } from '../../actions/weeks.js';
import { setFilter } from '../../actions/app.js';
import Week from './Week.js';
import Field from '../Field.js';
import { getWeeks } from '../../selectors/transactions.js';

function Weeks(props) {
  const dispatch = useDispatch();
  const weeks = useSelector(getWeeks);
  const isLoading = useSelector((state) => state.app.isLoading);
  const filter = useSelector((state) => state.app.filter);

  return (
    <div className="transactions">
      <div className="top-actions">
        <Button variant="primary" onClick={() => dispatch(showMore(true))}>
          Look Ahead
        </Button>
        <Field
          type="text"
          value={filter}
          label="Search"
          placeholder="Search"
          handleChange={(event) => {
            dispatch(setFilter(event.target.value.toLowerCase()));
          }}
        />
      </div>
      <div className="transactions-loading">
        {isLoading && <Spinner animation="border" variant="success" />}
      </div>
      <div className="weeks">
        {Object.keys(weeks)
          .sort()
          .reverse()
          .map((weekId) => {
            return <Week key={weekId} week={weeks[weekId]} />;
          })}
      </div>
      <Button variant="success" onClick={() => dispatch(showMore(false))}>
        Show More
      </Button>
    </div>
  );
}

export default Weeks;
