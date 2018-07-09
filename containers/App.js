import React from 'react';
import Form from './form';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';
import Login from './login';

import { isAuthenticated } from '../auth';

function App() {
	const authenticated = isAuthenticated();
	return (
		<div>
			{!authenticated && <Login />}
			{authenticated && (
				<div>
					<Form />
					<Weeks />
					<DeleteDialog />
				</div>
			)}
		</div>
	);
}

export default App;
