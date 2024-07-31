import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense } from 'react';
import './Header.css';
import { Home } from '@mui/icons-material';
import { IconButton } from '@mui/material';


function Header() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    }

    useEffect(() => { // To initialize dropdown in Materialize CSS
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = window.M.Dropdown.init(elems, {});
        // for mobile
        var elems = document.querySelectorAll('.sidenav');
        var instances = window.M.Sidenav.init(elems, {});
    }, []);
    
    const logout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    }

    //const isActive = location.pathname === '/chat'; // To check if current path is '/chat'
    const isActive = true;

    return (
        <>
            {/* Dropdown Structure */}
            { isActive && (
                <ul id="dropdown1" className="dropdown-content">
                    <li><button onClick={() => navigate('/profile')}>{t('Edit Profile')}</button></li>
                    <li><button onClick={() => navigate('/add-image')}>{t('Add new Image')}</button></li>
                    <li><button onClick={() => navigate('/chat')}>{t('Chats')}</button></li>
                    <li className="divider"></li>
                    <li><button onClick={() => logout()}>{t('Logout')}</button></li>
                </ul>
            )}

            <nav>
            <div className="nav-wrapper">
                {/* Translation buttons shown on the left */}
                <ul className="left">
                    <li>
                        <Link to="/">
                            <IconButton>
                                <Home />
                            </IconButton>
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage('fi')} id="fi">FI</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage('en')} id="en">EN</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage('es')} id="es">ES</button>
                    </li>
                </ul>

                {/* Dropdown Trigger shown on the right */}
                <ul className="right">
                    { isActive && (
                        <li>
                            <a className="right dropdown-trigger" href="#!" data-target="dropdown1">
                                <img 
                                    src="noprofile.png" 
                                    alt={t('User Profile')} 
                                    className="circle responsive-img profile-img"
                                />
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            </nav>
        </>
    );
}

export default function App() {
    return (
        <Suspense fallback="loading">
        <Header />
        </Suspense>
    );
}