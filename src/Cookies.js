import React, { useState, useEffect } from 'react';
import './css/Cookies.css';

const Cookies = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/">Learn more</a></p>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
};

export default Cookies;