import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from './ChatContext'; // Import the ChatContext
import ChatInterface from './ChatInterface'; // Import the ChatInterface component
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


const Header = ({ toggleMenu }) => {
  const { toggleChatVisibility } = useContext(ChatContext);
  // State to manage chat interface visibility
  const [setChatVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  /* // Function to toggle chat visibility
  const toggleChat = () => {
    console.log('Toggling chat visibility'); // Debugging line
    setChatVisible(!isChatVisible);
  };
 */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setIsLoggedIn(true);
      } else {
        // User is signed out.
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);


  return (
    <>
      <header>
      <div className="hamburger-icon" onClick={toggleMenu}>
            &#9776; {/* Unicode for hamburger icon */}
          </div>
        <div className="logo">
          <a href="/home">
            <img src="https://dl.dropbox.com/scl/fi/y1b4spd70dn0tdj3m9eh7/logo1w1-Photoroom-1.png?rlkey=b26muhf3bihl2y4k20np81ldi&" alt="Logo" />
          </a>
        </div>
        <div className="header-right">
          {isLoggedIn && (
            <div className="chat-icon" onClick={toggleChatVisibility}>
              💬 {/* This can be replaced with an actual icon */}
            </div>
          )}
          
        </div>
      </header>
      <ChatInterface closeChat={() => setChatVisible(false)} />
    </>
  );
}

export default Header;