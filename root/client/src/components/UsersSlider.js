import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './UsersCard.css';

function UsersSlider({ users }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleExpand = (index) => {
    setExpanded(index);
  };

  const closeExpand = () => {
    setExpanded(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <div>
      <h1 className='title'>People you may like...</h1>
      <div className="row">
        <div className="slider-container">
          <Slider {...settings}>
            {users.map((user, index) => (
              <div className="slider-item" key={user.email}>
                <div className="card-image">
                  <img src={'noProfile.png'} alt={user.email} />
                </div>
                <p className="personName" style={{ color: 'hsl(330, 84%, 50%)' }}>{user.name}</p>
                <div className="card-content">
                  <h1 className="card-title">{user.title}</h1>
                  <p className={`card-text ${expanded === index ? 'expanded' : ''}`}>{user.detail}</p>
                  <a
                    className={`btn-floating halfway-fab waves-effect waves-light red ${liked ? 'liked' : ''}`}
                    onClick={toggleLike}
                  >
                    <i className="material-icons">favorite</i>
                  </a>
                  <p onClick={() => toggleExpand(index)} className='expand'>
                    expand
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {expanded !== null && (
        <>
          <div className="overlay" onClick={closeExpand}></div>
          <div className="expanded-card">
            <div className="close-btn" onClick={closeExpand}>X</div>
            <div className="card-image">
              <img src={users[expanded].image} alt={users[expanded].email} />
            </div>
            <p className="personName">{users[expanded].name}</p>
            <div className="card-content">
              <h1 className="card-title-expand">{users[expanded].title}</h1>
              <p className="card-text-expand">{users[expanded].detail}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UsersSlider;
