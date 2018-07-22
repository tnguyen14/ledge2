import React from 'react';
import UserMenu from './userMenu';

function Header() {
	return (
		<div className="header">
			<h1>Ledge</h1>
			<UserMenu />
		</div>
	);
}

export default Header;
