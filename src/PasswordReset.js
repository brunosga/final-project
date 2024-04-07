// Import necessary dependencies
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom';
import './css/PasswordReset.css'; 

// PasswordReset component for handling user password reset requests
const PasswordReset = () => {
  const [emailForReset, setEmailForReset] = useState(''); // State to store the user's email input
  const navigate = useNavigate(); // Hook for navigate 

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form of submission behavior
    try {
      // Attempt to send an email to reset the password to the email that the user provides
      await sendPasswordResetEmail(auth, emailForReset);
      // Alert the user that the email to reset the password has been sent successfully
      alert('Password reset email sent successfully. Please check your email.');
      navigate('/login'); // Redirect back to login after email is sent
    } catch (error) {
      // If there is any error, an alert error message will be shown to the user
      alert(error.message);
    }
  };

  // Render the paassword reset form
  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <div className="password-reset-title">Reset Password</div>
        <form onSubmit={handleSubmit} className="password-reset-form">
          <input
            type="email" // Specify that in this input accepts email
            value={emailForReset} // Bind the input value to he emailForReset state
            onChange={(e) => setEmailForReset(e.target.value)} // Update state on input change
            className="password-reset-input" // Style class for the input
            placeholder="Enter your email" // Placeholder for the email
            required // Make this field required
          />
          <button type="submit" className="password-reset-button">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;  // Export the component for use in other parts of the app