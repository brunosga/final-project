import React from 'react';

const Header = ({ toggleMenu }) => {
    return (
        <header>
        <div className="logo">
          <img src="https://dl.dropbox.com/scl/fi/gnq44quehl0ly2ngwtgoa/logo.png?rlkey=h5clx6fy1u2w1e8kzu7ut5u0s&" alt="Logo" />
        </div>
        <input type="search" placeholder="Search cuisines..." />
        <div className="hamburger-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
      </header>
    );
}

export default Header;
