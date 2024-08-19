import React, { useState, useEffect } from 'react';
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // to store the saved password
  const [savePassword, setSavePassword] = useState(false); // to store the checkbox state
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { // Load saved credentials from local storage
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setSavePassword(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    const response = await fetch('https://advanced-web-project.onrender.com/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
        const data = await response.json();
        setErrorMessage('');

        // Saving password and email to local storage
        if (savePassword) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
        }

        console.log('Success:', data);
        // Storing the token in local storage
        if (data.token) 
            localStorage.setItem('auth_token', data.token);
        else 
            alert(t('Token not found'));

        // Redirecting to the chat page
        navigate('/suggestions');

    } else {
      console.error('Error:', response);
      setErrorMessage(`⚠️${t('Failed to login. Please check your email and password.')}`);
    }
  };

  return (
    <div className="container">
      <h2>{t('Login')}</h2>
      <form action='#' onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder={t('Email')} required value={email}
                onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder={t('Password')} required value={password}
                onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        <p style={{marginTop: '6px', marginBottom: '4px'}}>
            <label>
                <input type="checkbox" name="savePassword" className="filled-in" checked={savePassword}
                        onChange={(e) => setSavePassword(e.target.checked)} />
                <span>{t('Remember me')}</span>
            </label>
        </p>
        <button type="submit">{t('Submit')}</button>
      </form>
      
      <div className="links">
        <Link to="/register">{t('New here? Register')}</Link> <br />
        <Link to="/reset-password">{t('Forgot password?')}</Link> <br />
        <Link to="/auth/google">{t('Sign in with Google')}</Link>
      </div>
    </div>
  );
}

export default Login;