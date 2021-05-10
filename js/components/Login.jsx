import React from 'https://cdn.skypack.dev/react@17';
import { useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import { login } from '../actions/user.js';

function Login() {
  const dispatch = useDispatch();
  return (
    <div className="login">
      <Button onClick={() => dispatch(login())}>
        Log In
      </Button>
    </div>
  );
}

export default Login;
