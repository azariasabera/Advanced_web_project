import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow'; // New component to be created
import './Chat.css';

function Chat() {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const populateMatches = (user, users) => {
        const liked = user.liked;
        const likedBy = user.likedBy;
        const matchedUsers = users.filter(u => liked.includes(u.email) && likedBy.includes(u.email));
        
        setMatches(matchedUsers);
        console.log('Matched:', matchedUsers);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (!response.ok) {
                    navigate('/login');
                    return;
                }
                const data = await response.json();
                setUser(data);
                console.log('User data:', data);
                return data;
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            }
        };

        const fetchUsers = async (currentUser) => {
            try {
                const response = await fetch('/api/all-users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const filteredUsers = data.filter(u => u.email !== currentUser.email);
                    setUsers(filteredUsers);
                    console.log('Filtered users:', filteredUsers);
                    return filteredUsers;
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const initialize = async () => {
            const currentUser = await checkAuth();
            if (currentUser) {
                const filteredUsers = await fetchUsers(currentUser);
                populateMatches(currentUser, filteredUsers);
            }
        };

        initialize();
    }, [navigate]);
    
    return (
        <>
        <button onClick={() => { navigate('/suggestions') }}>View Suggestions</button>
        <div className="con">
            <div className="chats">
                <p className="chat-title">Chats</p>
                {matches.length > 0 ? (
                    matches.map(match => (
                        <button
                            key={match.email}
                            className="chat-item"
                            onClick={() => { setSelectedChat(match) }}
                        >
                            {match.name}
                        </button>
                ))): <p>No one to chat</p>}
            </div>
            <div className="messages">
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} user={user} />
                ) : (
                    <span className="flow-text">Select a chat to start messaging.</span>
                )}
            </div>
        </div>
        </>
    );
};

export default Chat;
