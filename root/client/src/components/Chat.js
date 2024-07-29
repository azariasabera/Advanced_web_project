import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserSlider from './UserSlider';
import './Chat.css'

function Chat() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (localStorage.getItem('auth_token')) {
                const response = await fetch('/api/user/check-auth',
                    {
                        method: 'GET',
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });
                const data = await response.json();
                if (data.isAuthenticated) 
                    setIsAuthenticated(true);
                else 
                    navigate('/login');
            }
            else 
                navigate('/login');
        }
        checkAuth();
    }
    , [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/all-users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.json();
            setUsers(data.users);
        };

        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);


    return (
        <div className="chat-page">
            <h1>Chat</h1>
            
        </div>
    )
}

export default Chat