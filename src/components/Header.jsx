import React from "react";
import { Link } from "react-router-dom"; // use react-router links

import "./Header.css"; // import css

function Header() {
  return (
    <header className="header-section">
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/group">🏠 Home</Link>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <Link to="/member1">👤 Member 1</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
