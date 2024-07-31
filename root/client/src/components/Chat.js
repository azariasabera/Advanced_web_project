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

    const populateMatches = (currentUser, allUsers) => {
        const liked = currentUser.liked || [];
        const likedBy = currentUser.likedBy || [];
        const matchedUsers = allUsers.filter(u => liked.includes(u.email) && likedBy.includes(u.email));
        setMatches(matchedUsers);
        console.log('Matched:', matchedUsers);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        const fetchUsersData = async (currentUser) => {
            try {
                const response = await fetch('/api/all-users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                return data.filter(u => u.email !== currentUser.email);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const initialize = async () => {
            const currentUser = await fetchUserData();
            if (currentUser) {
                const filteredUsers = await fetchUsersData(currentUser);
                populateMatches(currentUser, filteredUsers);
                setUser(currentUser); // Ensure user state is set after fetching
                setUsers(filteredUsers); // Ensure users state is set after fetching
            }
        };

        initialize();
    }, [navigate]);

    return (
        <>
            <button onClick={() => navigate('/suggestions')}>View Suggestions</button>
            <div className="con">
                <div className="chats">
                    <p className="chat-title">Chats</p>
                    {matches.length > 0 ? (
                        matches.map(match => (
                            <button
                                key={match.email}
                                className="chat-item"
                                onClick={() => setSelectedChat(match)}
                            >
                                {match.name}
                            </button>
                        ))
                    ) : (
                        <p>No one to chat</p>
                    )}
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
}

export default Chat;