import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faFacebook, faPinterest, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './css/Footer.css'; // Make sure to create a Footer.css file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h1>Dinning In</h1>
        <div className="footer-links">
          <a href="/about">About Dinning In</a>
          <a href="/join">Join as a chef</a>
        </div>
        <div className="footer-legal-social">
        <div className="footer-legal">
          <a href="/terms">Terms & Conditions</a>
          <span> | </span>
          <a href="/privacy">Privacy Policy</a>
          <p >
          ©2024 Dinning In. All Rights Reserved.
        </p>
        </div>
        <div className="footer-social">
        <a href="your-youtube-link" aria-label="YouTube">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a href="your-instagram-link" aria-label="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="your-Twitter-link" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a>
        <a href="your-facebook-link" aria-label="Facebook">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="your-pinterest-link" aria-label="Pinterest">
          <FontAwesomeIcon icon={faPinterest} />
        </a>
      </div>
      </div>  
    </div>
    </footer>
  );
}

export default Footer;