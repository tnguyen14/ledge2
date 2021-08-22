import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import Form from '../Form/index.js';
import AccountStats from '../AccountStats/index.js';
import Weeks from '../Weeks/index.js';
import DeleteDialog from '../DeleteDialog/index.js';
import { setDisplayFrom } from '../../actions/app.js';
import { resetForm } from '../../actions/form.js';
import { WEEK_ID_FORMAT } from '../../util/constants.js';

function Expense() {
  const today = useSelector((state) => state.app.today);
  const lastRefreshed = useSelector((state) => state.app.lastRefreshed);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetForm());
    dispatch(setDisplayFrom(format(today, WEEK_ID_FORMAT)));
  }, [today, lastRefreshed]);
  return (
    <div className="expense">
      <div className="app-top">
        <Form />
        <AccountStats />
      </div>
      <Weeks />
      <DeleteDialog />
    </div>
  );
}

export default Expense;
