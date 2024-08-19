import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AddImage() {
    const { t } = useTranslation();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('https://advanced-web-project.onrender.com/api/user', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (!response.ok) {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await fetch('https://advanced-web-project.onrender.com/api/user/image', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setStatus(data.msg);
            } else {
                setStatus('⚠️ ' + data.msg);
            }
        } catch (error) {
            setStatus('⚠️ ' + t('uploadError'));
        }
    };

    return (
        <div className="container">
            <h2 className="header">{t('picturesTellAThousandWords')}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    required 
                    className="file-input"
                />
                <button 
                    type="submit"
                    className="submit-button"
                >
                    {t('addImage')}
                </button>
                <p className="status">{status}</p>
            </form>
            
            <div className="links">
                <Link to="/chat" className="link">{t('backToChat')}</Link>
            </div>
        </div>
    );
}

export default AddImage;