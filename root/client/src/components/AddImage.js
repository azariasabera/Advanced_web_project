import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


function Profile() {
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (!response.ok) {
                navigate('/login');
            }
        }
        checkAuth();
    }, []);


    const handleSubmit = async (e) => {   
        e.preventDefault();
        const formData = new FormData(e.target);
        const response = await fetch('/api/user/image', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData
        });
        const data = await response.json();
        if (response.ok) 
            setStatus(data.msg);
        else
            setStatus('⚠️ ' + data.msg);
    };
  return (
    <div className="container">
        <h2 style={{fontStyle:'italic'}}>Pictures tell a thousand words...</h2>
        <form action='#' onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" name="image" accept="image/*" required />
            <button type="submit">Add Image</button>
            <p > {status}</p>
        </form>
        
        <div className="links">
        <Link to="/chat">Back to Chat</Link>
        </div>
  </div>
  )
}

export default Profile