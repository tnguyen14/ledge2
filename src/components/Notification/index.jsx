import React, { useState, useEffect } from 'https://esm.sh/react@18.3.1';
import { useSelector } from 'https://esm.sh/react-redux@9.2.0';
import Snackbar from 'https://esm.sh/@mui/material@5.15.7/Snackbar';

function Notification() {
  const { content, autohide } = useSelector((state) => state.app.notification);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(content != '');
  }, [content]);

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
  }
  return (
    <Snackbar
      open={show}
      onClose={handleClose}
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
  );
}

export default Notification;
