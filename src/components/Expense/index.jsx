import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import { useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import Form from '../Form/index.js';
import AccountStats from '../AccountStats/index.js';
import Weeks from '../Weeks/index.js';
import DeleteDialog from '../DeleteDialog/index.js';
import { setDisplayFrom } from '../../actions/app.js';
import { DATE_FIELD_FORMAT } from '../../util/constants.js';

function Expense() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDisplayFrom(format(new Date(), DATE_FIELD_FORMAT)));
  }, []);
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
