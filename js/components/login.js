import React from 'https://cdn.skypack.dev/react@16';
import { useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import { login } from '../actions/user.js';

function Login() {
  const dispatch = useDispatch();
  return (
    <div className="login">
      <button className="btn" onClick={() => dispatch(login())}>
        Log In
      </button>
    </div>
  );
}

export default Login;
