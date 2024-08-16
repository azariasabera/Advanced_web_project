import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function GoogleAuth() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirect the user to Google OAuth URL
    window.location.href = 'https://advanced-web-project.onrender.com/api/auth/google';
  };

  const checkToken = () => { // checks if this site has a token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('Token found in URL:', token  );
      localStorage.setItem('auth_token', token);
      navigate('/suggestions');
    }
  }

  useEffect(() => {
    checkToken();
  }
  , []);  

  return (
    <div className="form-container">
      <h2>Login using Google</h2>
      <button onClick={handleGoogleLogin}>Google Authenticate</button>
    </div>
  );
}

export default GoogleAuth;
