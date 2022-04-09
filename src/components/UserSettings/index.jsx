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
  const meta = useSelector((state) => state.meta);
  const flows = ['in', 'out'];

  return (
    <Dialog
      className="user-settings"
      open={open}
      onClose={() => dispatch(setUserSettingsOpen(false))}
    >
      <DialogTitle>User Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h3>Types</h3>
          {flows.map((flow) => (
            <>
              <h4>{flow}</h4>
              {meta.types[flow].map((type) => (
                <div key={type.slug}>{type.value}</div>
              ))}
            </>
          ))}
          <h3>Categories</h3>
          {flows.map((flow) =>
            meta.types[flow].map((type) => (
              <>
                <h4>{type.value}</h4>
                {meta.categories[type.slug].map((cat) => (
                  <div key={cat.slug}>{cat.value}</div>
                ))}
              </>
            ))
          )}
          <h3>Sources</h3>
          {flows.map((flow) =>
            meta.types[flow].map((type) => (
              <>
                <h4>{type.value}</h4>
                {meta.sources[type.slug].map((source) => (
                  <div key={source.slug}>{source.value}</div>
                ))}
              </>
            ))
          )}
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
