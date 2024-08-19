import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';
import { Home } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState('/noProfile.png');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    /* Materialize dropdown and sidenav were not working, so I added their initialization here */

    // Initialize dropdown
    const elems = document.querySelectorAll('.dropdown-trigger');
    const instances = window.M.Dropdown.init(elems, {});

    // Initialize sidenav for mobile
    const sidenavElems = document.querySelectorAll('.sidenav');
    const sidenavInstances = window.M.Sidenav.init(sidenavElems, {});

    // Cleanup function to destroy instances on unmount
    return () => {
      instances.forEach(instance => instance.destroy());
      sidenavInstances.forEach(instance => instance.destroy());
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  useEffect(() => {
    const getProfilePicture = async () => {
      try {
        const response = await fetch('https://advanced-web-project.onrender.com/api/user/image', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.blob();
          setImgUrl(URL.createObjectURL(data));
        }         
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    getProfilePicture();
  }, [navigate]);

  return (
    <>
        <ul id="dropdown1" className="dropdown-content">
          <li><button onClick={() => navigate('/profile')}>{t('My Profile')}</button></li>
          <li><button onClick={() => navigate('/add-image')}>{t('Add new Image')}</button></li>
          <li><button onClick={() => navigate('/chat')}>{t('Chats')}</button></li>
          <li><button onClick={() => navigate('/suggestions')}>{t('Suggestions')}</button></li>
          <li className="divider"></li>
          <li><button onClick={logout}>{t('Logout')}</button></li>
        </ul>

      <nav>
        <div className="nav-wrapper">
          <ul className="left">
            <li>
              <Link to="/">
                <IconButton>
                  <Home />
                </IconButton>
              </Link>
            </li>
            <li><button onClick={() => changeLanguage('fi')} id="fi">FI</button></li>
            <li><button onClick={() => changeLanguage('en')} id="en">EN</button></li>
            <li><button onClick={() => changeLanguage('es')} id="es">ES</button></li>
          </ul>

          <ul className="right">
              <li>
                <a className="right dropdown-trigger" href="#!" data-target="dropdown1">
                  <img
                    src={imgUrl}
                    alt={t('Profile')}
                    className="circle responsive-img profile-img"
                  />
                </a>
              </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default function App() {
  return (
    <React.Suspense fallback="loading">
      <Header />
    </React.Suspense>
  );
}