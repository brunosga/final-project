// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import './css/Cookies.css';

// Define the Cookies component
const Cookies = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Use effect to check if cookie consent has been given
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  // Function to handle the acceptance of cookies
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/privacy">Learn more</a></p>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
};

export default Cookies; // Export the component for use in other parts of the app