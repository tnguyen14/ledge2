import React, { useState } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@7';
import Dialog from 'https://esm.sh/@mui/material@5/Dialog';
import DialogTitle from 'https://esm.sh/@mui/material@5/DialogTitle';
import DialogContent from 'https://esm.sh/@mui/material@5/DialogContent';
import DialogActions from 'https://esm.sh/@mui/material@5/DialogActions';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import classnames from 'https://esm.sh/classnames@2';
import {
  TrashIcon,
  XCircleIcon
} from 'https://esm.sh/@primer/octicons-react@15';
import {
  addAccount,
  removeAccount,
  cancelRemoveAccount,
  addCategory,
  removeCategory,
  cancelRemoveCategory
} from '../../actions/app.js';
import { setUserSettingsOpen } from '../../slices/app.js';
import { saveUserSettings } from '../../actions/meta.js';
import Field from '../Form/Field.js';

function UserSettings() {
  const [newAccount, setNewAccount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useDispatch();
  const open = useSelector((state) => state.app.isUserSettingsOpen);
  const saving = useSelector((state) => state.app.savingUserSettings);
  const { accounts, expenseCategories, timezoneToStore } = useSelector(
    (state) => state.meta
  );

  return (
    <Dialog
      className="user-settings"
      open={open}
      onClose={() => dispatch(setUserSettingsOpen(false))}
    >
      <DialogTitle>User Settings</DialogTitle>
      <DialogContent>
        <div className="profile">
          <h4>Profile</h4>
          <div className="profile-fields">
            <div className="field-label">
              Timezone to store transaction date
            </div>
            <div className="field-value">{timezoneToStore}</div>
          </div>
        </div>
        <div className="list">
          <h4>Accounts</h4>
          {accounts.map((account) => (
            <div
              key={account.slug}
              className={classnames('item', {
                'to-be-added': account.toBeAdded,
                'to-be-removed': account.toBeRemoved
              })}
            >
              <span>{account.value}</span>
              {!account.builtIn && account.toBeRemoved ? (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  title="Put back"
                  onClick={() => {
                    dispatch(cancelRemoveAccount(account.value));
                  }}
                >
                  <XCircleIcon />
                </Button>
              ) : null}
              {!account.builtIn && !account.toBeRemoved ? (
                <Button
                  size="sm"
                  variant="outline-danger"
                  title="Remove"
                  onClick={() => {
                    dispatch(removeAccount(account.value));
                  }}
                >
                  <TrashIcon />
                </Button>
              ) : null}
            </div>
          ))}

          <div className="item">
            <Field
              type="text"
              placeholder="New account"
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
          </div>
        </div>
        <div className="list">
          <h4>Expense Categories</h4>
          {expenseCategories.map((cat) => (
            <div
              key={cat.slug}
              className={classnames('item', {
                'to-be-added': cat.toBeAdded,
                'to-be-removed': cat.toBeRemoved
              })}
            >
              <span>{cat.value}</span>
              {cat.toBeRemoved ? (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  title="Put back"
                  onClick={() => {
                    dispatch(cancelRemoveCategory(cat.value));
                  }}
                >
                  <XCircleIcon />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline-danger"
                  title="Remove"
                  onClick={() => {
                    dispatch(removeCategory(cat.value));
                  }}
                >
                  <TrashIcon />
                </Button>
              )}
            </div>
          ))}
          <div className="item">
            <Field
              type="text"
              placeholder="New expense category"
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
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => dispatch(setUserSettingsOpen(false))}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => dispatch(saveUserSettings())}
          disabled={saving}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserSettings;
