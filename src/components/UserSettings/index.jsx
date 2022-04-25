import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Dialog from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Dialog';
import DialogTitle from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogTitle';
import DialogContent from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContent';
import DialogContentText from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContentText';
import DialogActions from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogActions';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import {
  TrashIcon,
  XCircleIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import {
  setUserSettingsOpen,
  addAccount,
  removeAccount,
  cancelRemoveAccount,
  addCategory,
  removeCategory,
  cancelRemoveCategory
} from '../../actions/app.js';
import Field from '../Form/Field.js';

function UserSettings() {
  const [newAccount, setNewAccount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useDispatch();
  const open = useSelector((state) => state.app.isUserSettingsOpen);
  const { accounts, expenseCategories } = useSelector((state) => state.meta);

  return (
    <Dialog
      className="user-settings"
      open={open}
      onClose={() => dispatch(setUserSettingsOpen(false))}
    >
      <DialogTitle>User Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h4>Accounts</h4>
          {accounts.map((account) => (
            <div
              key={account.slug}
              className={classnames({
                'to-be-added': account.toBeAdded,
                'to-be-removed': account.toBeRemoved
              })}
            >
              <span>{account.value}</span>
              {!account.builtIn && account.toBeRemoved ? (
                <Button
                  onClick={() => {
                    dispatch(cancelRemoveAccount(account.value));
                  }}
                >
                  <XCircleIcon />
                </Button>
              ) : null}
              {!account.builtIn && !account.toBeRemoved ? (
                <Button
                  onClick={() => {
                    dispatch(removeAccount(account.value));
                  }}
                >
                  <TrashIcon />
                </Button>
              ) : null}
            </div>
          ))}

          <Field
            type="text"
            value={newAccount}
            handleChange={(e) => setNewAccount(e.target.value)}
          />
          <Button
            onClick={() => {
              dispatch(addAccount(newAccount));
              setNewAccount('');
            }}
          >
            Add
          </Button>
          <h4>Expense Categories</h4>
          {expenseCategories.map((cat) => (
            <div
              key={cat.slug}
              className={classnames({
                'to-be-added': cat.toBeAdded,
                'to-be-removed': cat.toBeRemoved
              })}
            >
              <span>{cat.value}</span>
              {cat.toBeRemoved ? (
                <Button
                  onClick={() => {
                    dispatch(cancelRemoveCategory(cat.value));
                  }}
                >
                  <XCircleIcon />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    dispatch(removeCategory(cat.value));
                  }}
                >
                  <TrashIcon />
                </Button>
              )}
            </div>
          ))}
          <Field
            type="text"
            value={newCategory}
            handleChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            onClick={() => {
              dispatch(addCategory(newCategory));
              setNewCategory('');
            }}
          >
            Add
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => dispatch(setUserSettingsOpen(false))}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={() => dispatch()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserSettings;
