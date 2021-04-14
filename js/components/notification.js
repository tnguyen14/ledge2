import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'react-bootstrap/Toast';

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
