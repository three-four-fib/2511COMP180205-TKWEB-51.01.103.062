import React from "react";
import { NavLink, Link } from "react-router-dom"; // use react-router links

import "./Header.css"; // import css

function Header() {
  return (
    <header className="header-section">
      <nav className="nav-bar">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span>◆ Home</span>
          </Link>

          <ul className="nav-links">
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/properties">Properties</NavLink>
            </li>
            <li>
              <NavLink to="/member1">Member 1</NavLink>
            </li>
            <li>
              <NavLink to="/member2">Member2</NavLink>
            </li>
            <li>
              <NavLink to="/member3">Member 3</NavLink>
            </li>
            <li>
              <NavLink to="/member4">Member 4</NavLink>
            </li>
            <li>
              <NavLink to="/member5">Member 5</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
