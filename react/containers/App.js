import React from 'react';
import Form from './form';
import Weeks from './weeks';
import DeleteDialog from './deleteDialog';

function App() {
	return (
		<div>
			<Form />
			<Weeks />
			<DeleteDialog />
		</div>
	);
}

export default App;
