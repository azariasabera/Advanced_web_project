import React from 'react';
import './UserCard.css';

function UserCard({ user }) {
    const { name, bio, image } = user;
    const imageUrl = `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`;

    return (
        <div className="user-card">
            <img src={imageUrl} alt={name} className="user-image" />
            <h2>{name}</h2>
            <p>{bio}</p>
        </div>
    );
}

export default UserCard;
