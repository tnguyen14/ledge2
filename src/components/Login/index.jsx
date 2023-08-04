import React from 'https://esm.sh/react@18';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import Button from 'https://esm.sh/react-bootstrap@2/Button';

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="login">
      <Button onClick={loginWithRedirect}>Log In</Button>
    </div>
  );
}

export default Login;
