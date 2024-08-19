import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Packages for the slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './UsersSlider.css';

function UsersSlider({ users }) {
  const [likedUsers, setLikedUsers] = useState([]); // Track liked state for each user
  const [unlikedUsers, setUnlikedUsers] = useState([]); // Track unliked state for each user
  const [expanded, setExpanded] = useState(null); // Track expanded state for each user
  const { t } = useTranslation();

  useEffect(() => { // To get the like status of each user
    const fetchLikedUsers = async () => {
      try {
        const response = await fetch('https://advanced-web-project.onrender.com/api/user/like', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch liked users');
        const data = await response.json();
        setLikedUsers(data.likedUsers);
      } catch (error) {
        console.error('Error fetching liked users:', error);
      }
    };
    fetchLikedUsers();
  }, []);

  const toggleLike = async (email) => { // To like/unlike a user
    const isLiked = likedUsers.includes(email); // Check if the user is already liked
    const updatedLikedUsers = isLiked 
      ? likedUsers.filter(user => user !== email)
      : [...likedUsers, email];
    const updatedUnlikedUsers = isLiked // unliked users are those who were previously liked
      ? [...unlikedUsers, email]
      : unlikedUsers.filter(user => user !== email);

    setLikedUsers(updatedLikedUsers);
    setUnlikedUsers(updatedUnlikedUsers);

    try {
      const response = await fetch('https://advanced-web-project.onrender.com/api/user/like', { // update the ChatUser model
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          likedUsers: updatedLikedUsers,
          unlikedUsers: updatedUnlikedUsers
        })
      });
      if (!response.ok) throw new Error('Failed to update liked users');
      console.log('Success:', await response.json());
    } catch (error) {
      console.error('Error updating liked users:', error);
    }
  };

  const toggleExpand = (index) => {
    setExpanded(index);
  };

  const closeExpand = () => {
    setExpanded(null);
  };

  const checkUsers = (users) => {
    if (users.length === 1) 
      return [...users, ...users];
    return users;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: users.length === 1 ? 1 : 2,
    slidesToScroll: 1,
  };

  return (
    <div>
      <h1 className='title'>{t('People you may like...')}</h1>
      <div className="row">
        <div className="slider-container">
          <Slider {...settings}>
            { checkUsers(users).map((user, index) => (
              <div className="slider-item" key={user.email}>
                <div className="card-image">
                  <img src={user.image || 'noProfile.png'} alt={user.email} />
                </div>
                <p className="personName">{user.name}</p>
                <div className="card-content">
                  <h1 className="card-title">{user.title}</h1>
                  <p className={`card-text ${expanded === index ? 'expanded' : ''}`}>{user.detail}</p>
                  <a
                    className={`btn-floating halfway-fab waves-effect waves-light red ${likedUsers.includes(user.email) ? 'liked' : ''}`}
                    onClick={() => toggleLike(user.email)}
                  >
                    <i className="material-icons">favorite</i>
                  </a>
                  <p onClick={() => toggleExpand(index)} className='expand'>
                    {t('expand')}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {expanded !== null && (  // Expanded card
        <>
          <div className="overlay" onClick={closeExpand}></div>
          <div className="expanded-card">
            <div className="close-btn" onClick={closeExpand}>X</div>
            <div className="card-image">
              <img src={checkUsers(users)[expanded].image || 'noProfile.png'} alt={checkUsers(users)[expanded].email} />
            </div>
            <p className="personName-expand">{checkUsers(users)[expanded].name}</p>
            <div className="card-content-expand">
              <h1 className="card-title-expand">{checkUsers(users)[expanded].title}</h1>
              <p className="card-text-expand">{checkUsers(users)[expanded].detail}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UsersSlider;