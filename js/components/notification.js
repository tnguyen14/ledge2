import React, { useState, useEffect } from 'https://cdn.skypack.dev/react@16';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Toast from 'https://cdn.skypack.dev/react-bootstrap@1/Toast';

function Notification() {
  const { content, title, autohide } = useSelector(
    (state) => state.app.notification
  );
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(content != '');
  }, [content]);
  return (
    <div aria-live="polite" aria-atomic="true" className="notification">
      <Toast show={show} onClose={() => setShow(false)} autohide={autohide}>
        <Toast.Header>{title}</Toast.Header>
        <Toast.Body>{content}</Toast.Body>
      </Toast>
    </div>
  );
}

export default Notification;
