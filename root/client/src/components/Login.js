import React, { useState, useEffect} from 'react';
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved credentials from local storage
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

    const response = await fetch('/api/user/login', {
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
            alert('Token not found');

        // Redirecting to the chat page
        navigate('/chat');

    } else {
      console.error('Error:', response);
      setErrorMessage('⚠️Failed to login. Please check your email and password.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form action='#' onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required value={email}
                onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" required value={password}
                onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        <p style={{marginTop: '6px', marginBottom: '4px'}}>
            <label>
                <input type="checkbox" name="savePassword" className="filled-in" checked={savePassword}
                        onChange={(e) => setSavePassword(e.target.checked)} />
                <span>Remember me</span>
            </label>
        </p>
        <button type="submit">Submit</button>
      </form>
      
      <div className="links">
        <Link to="/register">New here? Register</Link>
        <br />
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </div>
  );
}

export default Login;
