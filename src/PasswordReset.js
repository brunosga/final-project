import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './css/PasswordReset.css';

const PasswordReset = () => {
  const [emailForReset, setEmailForReset] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      alert('Password reset email sent successfully. Please check your email.');
      navigate('/login'); // Redirect back to login after email is sent
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="password-reset-container">
       <div className="password-reset-box">
    <div className="password-reset-title">Reset Password</div>
    <form onSubmit={handleSubmit} className="password-reset-form">
      <input
        type="email"
        value={emailForReset}
        onChange={(e) => setEmailForReset(e.target.value)}
        className="password-reset-input"
        placeholder="Enter your email"
        required
      />
      <button type="submit" className="password-reset-button">
        Send Reset Link
      </button>
    </form>
    </div>
  </div>
);
};

export default PasswordReset;