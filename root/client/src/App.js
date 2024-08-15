import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import Chat from './components/Chat';
import Profile from './components/Profile';
import AddImage from './components/AddImage';
import Suggestions from './components/Suggestions';
import GoogleAuth from './components/GoogleAuth';
import { Google } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ResetPassword from './components/ResetPassword';
import ResetPasswordForm from './components/ResetPasswordForm';

  function App() {
    const { t , i18n } = useTranslation();
    return (
      <Router>
        <Header />
        
        
          <Routes>
            <Route path="/" element={
              <div className="App">
                    <div className="content">
                        <h1>{t('Welcome')}</h1>
                        <p> {t('Moto')}</p>
                    </div>
          
                    <div id="navigateDiv">
                      <Link to="/register">
                        <button type="button" id="regcdister">{t('Register')}</button>
                      </Link>
                      <Link to="/login">
                        <button type="button" id="login">{t('Login')}</button>
                      </Link>
                      <Link to="/auth/google">
                        <IconButton>
                          <Google />
                        </IconButton>
                      </Link>
                    </div>
                  </div>
            } />

            <Route path="/login" element={<div className='App-sub'><Login /></div>} />
            <Route path="/register" element={<div className='App-sub'><Register /></div>} />
            <Route path="/chat" element={<div className='App-chat'><Chat /></div>} />
            <Route path="/profile" element={<div className='App-sub'><Profile /></div>} />
            <Route path="/add-image" element={<div className='App-sub'><AddImage /></div>} />
            <Route path="/suggestions" element={<div className='App-chat'><Suggestions /></div>} />
            <Route path="/auth/google" element={<div className='App-sub'><GoogleAuth /></div>} />
            <Route path="/reset-password" element={<div className='App-sub'><ResetPassword /></div>} />
            <Route path="/reset-password/:token" element={<div className='App-sub'><ResetPasswordForm /></div>} />
            <Route path="*" element={<h1>{t('error')}</h1>} />
          </Routes>
        
      </Router>
    );
  }

export default App;
