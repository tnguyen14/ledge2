import React from 'https://cdn.skypack.dev/react@17';
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
//
import { setUserSettingsOpen } from '../../actions/app.js';

function UserSettings() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.app.isUserSettingsOpen);
  const account = useSelector((state) => state.account);

  return (
    <Dialog
      className="user-settings"
      open={open}
      onClose={() => dispatch(setUserSettingsOpen(false))}
    >
      <DialogTitle>User Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>test</DialogContentText>
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
