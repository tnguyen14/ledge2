import React, { useState } from 'https://cdn.skypack.dev/react@16';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import { showMore } from '../../actions/weeks.js';
import { setFilter } from '../../actions/app.js';
import Week from './week.js';
import Field from '../field.js';
import PulseLoader from 'https://cdn.skypack.dev/react-spinners@0/PulseLoader';
import { getWeeks } from '../../selectors/transactions.js';

function Weeks(props) {
  const dispatch = useDispatch();
  const weeks = useSelector(getWeeks);
  const isLoading = useSelector((state) => state.app.isLoading);
  const filter = useSelector((state) => state.app.filter);

  return (
    <div className="transactions">
      <div className="top-actions">
        <Button onClick={() => dispatch(showMore(true))}>Look Ahead</Button>
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
        <PulseLoader loading={isLoading} />
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
