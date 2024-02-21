import React from 'react';

const Header = ({ toggleMenu, toggleChat, isUserLoggedIn }) => {
  return (
    <header>
      <div className="logo">
        <img src="https://dl.dropbox.com/scl/fi/gnq44quehl0ly2ngwtgoa/logo.png?rlkey=h5clx6fy1u2w1e8kzu7ut5u0s&" alt="Logo" />
      </div>
      <input type="search" placeholder="Search cuisines..." />
      <div className="chat-icon" onClick={toggleChat}>
          <img src='https://dl.dropbox.com/scl/fi/83jhx3n6xnumav1fspakl/speech-bubble.svg?rlkey=bb0o1eyreh6uc2uymi2790efp&' alt="Chat" />
        </div>
      <div className="hamburger-icon" onClick={toggleMenu}>
        &#9776; {/* Unicode for hamburger icon */}
      </div>
      
    </header>
  );
}

export default Header;
