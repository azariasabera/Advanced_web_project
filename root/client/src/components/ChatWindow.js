import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Chat.css';

function ChatWindow({ chat, user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    
    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await fetch(`/api/chat?sender=${user.email}&recipient=${chat.email}`, {
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
    
        fetchMessages();
      }, [user.email, chat.email]);
    
    const handleSendMessage = async () => {
        //if (newMessage.trim() === '') return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ sender: user.email, recipient: chat.email, text: 'newMessage' })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, data]);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
                {searchExpanded && <input type="text" placeholder="Search messages" className="search-input" />}
            </div>
            <div className="messagesDiv">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === user.email ? 'sent' : 'received'}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="messageSend">
                <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)} 
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatWindow;
