import React from 'https://cdn.skypack.dev/react@17';
import Form from '../Form/index.js';
import AccountStats from '../AccountStats/index.js';
import Weeks from '../Weeks/index.js';
import DeleteDialog from '../DeleteDialog/index.js';

function Expense() {
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
