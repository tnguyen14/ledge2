import React from 'https://cdn.skypack.dev/react@16';
import UserMenu from './userMenu.js';

function Header() {
  return (
    <div className="header">
      <h1>Ledge</h1>
      <UserMenu />
    </div>
  );
}

export default Header;
