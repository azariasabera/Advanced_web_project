// UserSlider.jsx
import React, { useState, useEffect } from 'react';
import './UserSlider.css';
import UserCard from './UserCard';

function UserSlider({ users }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [users.length]);

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + users.length) % users.length);
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % users.length);
    };

    const displayedUsers = users.slice(currentIndex, currentIndex + 2);

    return (
        <div className="user-slider">
            <button onClick={handlePrev}>{"<"}</button>
            <div className="user-cards">
                {displayedUsers.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
            <button onClick={handleNext}>{">"}</button>
        </div>
    );
}

export default UserSlider;
