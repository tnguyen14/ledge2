import React from 'https://cdn.skypack.dev/react@17';
import UserMenu from './UserMenu.js';

function Header() {
  return (
    <div className="header">
      <h1>Ledge</h1>
      <UserMenu />
    </div>
  );
}

export default Header;
