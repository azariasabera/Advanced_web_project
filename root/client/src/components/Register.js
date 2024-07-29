import React from 'react'
import './Form.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Register() {   
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData(e.target);

        const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
        });

        if (response.ok) {
        const result = await response.text();
        console.log('Success:', result);
        setErrorMessage('');
        navigate ('/login');
        } else {
        const result = await response.text();
        setErrorMessage(`⚠️ ${result}`);
        }
    };
    return (
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name='name' placeholder="Name" required />
          <input type="email" name='email' placeholder="Email" required />
          <input type="password" name='password' placeholder="Password" required />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          <button type="submit">Submit</button>
        </form>
        <div className="links">
        <Link to="/login">Already have an account? Login</Link>
      </div>
      </div>
    );
  }

export default Register