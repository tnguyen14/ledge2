import React from 'react';
import auth from '../auth';

function Login() {
	return (
		<button
			onClick={() =>
				auth.authorize({
					redirect_uri: `${window.location.href}callback.html`
				})
			}
		>
			Log In
		</button>
	);
}

export default Login;
