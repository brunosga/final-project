import React from 'react';

const Header = ({ toggleMenu }) => {
    return (
        <header>
        <div className="logo">
          <img src="./public/logo.png" alt="Logo" />
        </div>
        <input type="search" placeholder="Search cuisines..." />
        <div className="hamburger-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
      </header>
    );
}

export default Header;
