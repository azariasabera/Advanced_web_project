import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import { useTranslation } from 'react-i18next';

function Profile() {
    const [editInfo, setEditInfo] = useState(false);
    const [profile, setProfile] = useState({});
    const [imgUrl, setImgUrl] = useState('#'); // default image
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => { // To get the user 
        const fetchProfile = async () => {
            const response = await fetch('https://advanced-web-project.onrender.com/api/user', {
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
    }, [navigate]);

    useEffect(() => { // To get the user's profile picture
        const getProfilePicture = async () => {
            const response = await fetch('https://advanced-web-project.onrender.com/api/user/image', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            console.log(response.ok);
            const data = await response.blob();
            if (response.ok)
                setImgUrl(URL.createObjectURL(data));
            else {
                if (response.status === 401) 
                    navigate('/login');
                setImgUrl('noProfile.png');
            }
        }
        getProfilePicture();
    }, []);

    const handleSubmit = async (e) => {   
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const response = await fetch('https://advanced-web-project.onrender.com/api/user/bio', {
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
            setStatus(t('Bio updated successfully'));
        } else {
            setStatus(t('Failed to update bio'));
        }
    };

  return (
    <div className="container">
        {!editInfo ? (
            <div>
                <img src={imgUrl} alt={t('Profile Picture')} />
                <h2>{t('Profile')}</h2>
                <p>{t('Name')}: {profile.name}</p>
                <p>{t('Email')}: {profile.email}</p>
                <p>{t('Registered on')}: {profile.date}</p>

                <h3>{t('Bio')}</h3>
                <p>{profile.title}</p>
                <p>{profile.detail}</p>
                <button onClick={() => setEditInfo(true)}>{t('Edit bio')}</button>
            </div>  
        ) : (
            <div>
                <h2>{t('Tell people about you')}</h2>
                <form action='#' onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder={t('Title')} />
                    <input type="text" name="detail" placeholder={t('Detail')} />
                    <button type="submit">{t('Post')}</button>
                </form>
                <p>{status}</p>
            </div>
        )}
        <div className="links">
            <Link to="/chat">{t('Back to Chat')}</Link>
        </div>
    </div>
  )
}

export default Profile;