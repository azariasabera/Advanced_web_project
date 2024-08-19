import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersSlider from './UsersSlider';
function Suggestions() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('auth_token')) {
        const response = await fetch('https://advanced-web-project.onrender.com/api/user', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const data = await response.json();
        setUser(data);
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAuthenticated) {
        const response = await fetch('https://advanced-web-project.onrender.com/api/all-users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const data = await response.json();
        setUsers(data.filter(u => u.email !== user.email));
        console.log('Fetched users:', data);
      }
    };

    fetchUsers();
  }, [isAuthenticated, user.email]);

  return (
    <>
    { isAuthenticated && users.length !== 0 && (
    <div className="chat-page">
        <UsersSlider users={users} />
    </div>
    )}
    </>
  );
}

export default Suggestions;