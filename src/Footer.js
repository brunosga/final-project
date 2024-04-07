// Import necessary dependencies
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faFacebook, faPinterest, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './css/Footer.css'; 

// Define the Footer component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
      <div className="logo2">
          <a href="/home">
            <img src="https://dl.dropbox.com/scl/fi/y1b4spd70dn0tdj3m9eh7/logo1w1-Photoroom-1.png?rlkey=b26muhf3bihl2y4k20np81ldi&" alt="Logo" />
          </a>
        </div>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/login">Join as a chef</a>
        </div>
        <div className="footer-legal-social">
        <div className="footer-legal">
          <a href="/terms">Terms & Conditions</a> {/* future implementation */}
          <span> | </span>
          <a href="/privacy">Privacy Policy</a>
          <p >
          ©2024 Dinning In. All Rights Reserved.
        </p>
        </div>
        <div className="footer-social">
        <a href="youtube-link" aria-label="YouTube">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a href="instagram-link" aria-label="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="Twitter-link" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a>
        <a href="facebook-link" aria-label="Facebook">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="pinterest-link" aria-label="Pinterest">
          <FontAwesomeIcon icon={faPinterest} />
        </a>
      </div>
      </div>  
    </div>
    </footer>
  );
}

export default Footer; // Export the component for use in other parts of the app