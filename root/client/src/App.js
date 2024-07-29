import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Header from './components/Header';
import Chat from './components/Chat';
import Profile from './components/Profile';
import AddImage from './components/AddImage';

  function App() {
    const { t , i18n } = useTranslation();
    return (
      <Router>
        <Header />
        <div className="App">
        
          <Routes>
            <Route path="/" element={
              <>
                    <div className="content">
                        <h1>{t('Welcome')}</h1>
                        <p> {t('Moto')}</p>
                    </div>
          
                    <div id="navigateDiv">
                      <Link to="/login">
                        <button type="button" id="login">{t('Login')}</button>
                      </Link>
                      <Link to="/register">
                        <button type="button" id="register">{t('Register')}</button>
                      </Link>
                    </div>
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-image" element={<AddImage />} />
            <Route path="*" element={<h1>404: This is not the webpage you are looking for</h1>} />
          </Routes>
        </div>
      </Router>
    );
  }

export default App;
