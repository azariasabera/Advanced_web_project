import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './Chat.css';

function ChatWindow({ chat, user }) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`https://advanced-web-project.onrender.com/api/chat?sender=${user.email}&recipient=${chat.email}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        // Fetch messages immediately
        fetchMessages();
    
        // Set up the interval to fetch messages every 5 seconds (5000 ms)
        const intervalId = setInterval(fetchMessages, 5000);
    
        // Below cleans up the interval on 1) component unmount or 2) when dependencies change
        // Mount means when the component first appears on the DOM (when the component is displayed)
        // Unmount means when the component is removed from the DOM (when the component is hidden) it 
        // could be because the user navigated to another page or the component was removed from the DOM

        return () => clearInterval(intervalId);
    
    }, [user.email, chat.email]);    

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await fetch('https://advanced-web-project.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ sender: user.email, recipient: chat.email, text: newMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prevMessages => [...prevMessages, data]);
                setNewMessage('');
                scrollToBottom();
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value === '') {
            setFilteredMessages([]);
        } else {
            const filtered = messages.filter(msg =>
                msg.text.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredMessages(filtered);
        }
    };

    const handleClickMessage = (index) => {
        const messageElement = document.getElementById(`message-${index}`);
        messageElement?.scrollIntoView({ behavior: 'smooth' });
        setSearchText('');
        setFilteredMessages([]);
    };

    return (
        <div className="chat-window">
            <div className="search-bar">
                <div className='chatName'>
                    <span>{chat.name}</span>
                </div>
                <div className="search-icon" onClick={() => setSearchExpanded(!searchExpanded)}>
                    <FiSearch size={20} />
                </div>
                {searchExpanded && (
                    <input
                        type="text"
                        placeholder={t('Search messages')}
                        className="search-input"
                        value={searchText}
                        onChange={handleSearch}
                    />
                )}
                {searchText !== '' && (
                    <div className="dropdown-list">
                        {filteredMessages.map((msg, index) => (
                            <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleClickMessage(index)}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="messagesDiv">
                {messages.map((msg, index) => (
                    <div key={index} id={`message-${index}`} className={`message ${msg.sender === user.email ? 'sent' : 'received'}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="messageSend">
                <input
                    type="text"
                    placeholder={t('Type your message...')}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>{t('Send')}</button>
            </div>
        </div>
    );
}

export default ChatWindow;