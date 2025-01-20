import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="login">
      <Button onClick={loginWithRedirect}>Log In</Button>
    </div>
  );
}

export default Login;
