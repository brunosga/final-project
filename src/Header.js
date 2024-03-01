import React, { useContext, useState } from 'react';
import { ChatContext } from './ChatContext'; // Import the ChatContext
import ChatInterface from './ChatInterface'; // Import the ChatInterface component


const Header = ({ toggleMenu }) => {
  const { toggleChatVisibility } = useContext(ChatContext);
  // State to manage chat interface visibility
  const [setChatVisible] = useState(false);
  
  
  /* // Function to toggle chat visibility
  const toggleChat = () => {
    console.log('Toggling chat visibility'); // Debugging line
    setChatVisible(!isChatVisible);
  };
 */
  return (
    <>
    <header>
        <div className="logo">
            <img src="https://dl.dropbox.com/scl/fi/gnq44quehl0ly2ngwtgoa/logo.png?rlkey=h5clx6fy1u2w1e8kzu7ut5u0s&" alt="Logo" />
        </div>
        <input type="search" placeholder="Search cuisines..." />
        <div className="chat-icon" onClick={toggleChatVisibility}>
            💬 {/* This can be replaced with an actual icon */}
        </div>
        <div className="hamburger-icon" onClick={toggleMenu}>
            &#9776; {/* Unicode for hamburger icon */}
        </div>
    </header>   
        <ChatInterface closeChat={() => setChatVisible(false)} />
</>
  );
}

export default Header;
