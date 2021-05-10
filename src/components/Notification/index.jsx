import React, { useState, useEffect } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Snackbar from 'https://cdn.skypack.dev/@material-ui/core@4/Snackbar';

function Notification() {
  const { content, title, type, autohide } = useSelector(
    (state) => state.app.notification
  );
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(content != '');
  }, [content]);
  return (
    <div aria-live="polite" aria-atomic="true" className="notification">
      <Snackbar
        open={show}
        onClose={() => setShow(false)}
        autoHideDuration={autohide}
        message={content}
      >
        {/* consider using Alert and AlertTitle when they're available
            potentially in material-ui/core@5
        <Alert variant="outlined" severity={type}>
          <AlertTitle>{title}</AlertTitle>
        {content}
        </Alert> */}
      </Snackbar>
    </div>
  );
}

export default Notification;
