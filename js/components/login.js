import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../actions/user';

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
