// Import necessary dependencies
import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from './ChatContext'; 
import ChatInterface from './ChatInterface';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './firebase'; 


// Define the Header component with a prop for toggling the menu
const Header = ({ toggleMenu }) => {
  const { toggleChatVisibility } = useContext(ChatContext); // Access the chat visibility toggle function from ChatContext
  const [setChatVisible] = useState(false); // State to manage chat visibility, initially set to false
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [scrolled, setScrolled] = useState(false); // State to track if the page has been scrolled

  /* 
  const toggleChat = () => {
    console.log('Toggling chat visibility'); // Debugging line
    setChatVisible(!isChatVisible);
  };
 */

   // Effect to add scroll event listener to window object
   useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50; // Check if scrolled more than 50px
      setScrolled(isScrolled); // Update scrolled state based on scroll position
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Remove the event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to listen for authentication state changes
  useEffect(() => {
    // Subscribe to auth state changes and update isLoggedIn state accordingly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set isLoggedIn true if user exists, false otherwise
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);


  // Effect to see if the user is logged in or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in.
        setIsLoggedIn(true);
      } else {
        // User is logged out.
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Return the JSX structure of the Header component
  return (
    <>
      <header className={scrolled ? 'header-scrolled' : ''}>
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
              💬 
            </div>
          )}

        </div>
      </header>
      <ChatInterface closeChat={() => setChatVisible(false)} />
    </>
  );
}

export default Header; // Export the component for use in other parts of the app