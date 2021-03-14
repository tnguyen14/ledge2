import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Toast from 'react-bootstrap/Toast';

function Notification(props) {
  const { content = '', title = '', autohide } = props;
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

Notification.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  autohide: PropTypes.bool
};

export default Notification;
