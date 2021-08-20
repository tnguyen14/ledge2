import React from 'https://cdn.skypack.dev/react@17';
import { NavLink } from 'https://cdn.skypack.dev/react-router-dom@5';
import UserMenu from './UserMenu.js';

function Header() {
  return (
    <div className="header">
      <h1>Ledge</h1>
      <div className="menu">
        <NavLink activeClassname="active" exact to="/">
          Expense
        </NavLink>
        <NavLink activeClassname="active" exact to="/cashflow">
          Cashflow
        </NavLink>
        <UserMenu />
      </div>
    </div>
  );
}

export default Header;
