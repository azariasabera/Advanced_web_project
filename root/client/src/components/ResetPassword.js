import React from 'react';
import { Link } from 'react-router-dom';

function ResetPassword() {
  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email" 
          required 
        />
        <button type="submit">Reset Password</button>
      </form>
      <div className="oauth-buttons">
        <a href="/auth/google" className="oauth-button">Reset with Google</a>
        {/* Add similar links for Facebook, etc., if needed */}
      </div>
    </div>
  );
}

export default ResetPassword;