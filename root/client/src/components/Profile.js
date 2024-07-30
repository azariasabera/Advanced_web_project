import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Profile.css';


function Profile() {
    const [editInfo, setEditInfo] = useState(false);
    const [profile, setProfile] = useState({});
    const [imgUrl, setImgUrl] = useState('#'); // default image
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                navigate('/login');
            }
            
        }
        fetchProfile();
    }
    , []);

    useEffect(() => {
        const getProfilePicture = async () => {
            const response = await fetch('/api/user/image', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.blob();
            if (response.ok)
                setImgUrl(URL.createObjectURL(data));
            else
                navigate('/login');
        }
        getProfilePicture();
    }
    , []);

    const handleSubmit = async (e) => {   
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const response = await fetch('/api/user/bio', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
            let data = await response.json();
            console.log(data);
            setStatus('Bio updated successfully');}
        else
            setStatus('Failed to update bio');
    };

  return (
    <div className="container">
        {!editInfo ? (
            <div>
                <img src={imgUrl} alt="Profile Picture" />
                <h2>Profile</h2>
                <p>Name: {profile.name}</p>
                <p>Email: {profile.email}</p>
                <p>Registered on: {profile.date}</p>

                <h3>Bio</h3>
                <p> {profile.title} </p>
                <p> {profile.detail} </p>
                <button onClick={() => setEditInfo(true)}>Edit bio</button>
            </div>  
        ): (
            <div>
                <h2>Tell people about you</h2>
                <form action='#' onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Title"/>
                    <input type="text" name="detail" placeholder="Detail"/>
                    <button type="submit">Post</button>
                </form>
                <p> {status} </p>
            </div>
        )}
    <div className="links">
      <Link to="/chat">Back to Chat</Link>
    </div>

  </div>
  )
}

export default Profile