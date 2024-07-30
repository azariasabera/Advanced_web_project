import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './UsersCard.css';

function UsersSlider({ users }) {
  
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
      };

  return (
    <div className="slider-container">
    <Slider {...settings}>
      <div className="slider-item">
        <h3>1</h3>
      </div>
      <div className="slider-item">
        <h3>2</h3>
      </div>
      <div className="slider-item">
        <h3>3</h3>
      </div>
      <div className="slider-item">
        <h3>4</h3>
      </div>
      <div className="slider-item">
        <h3>5</h3>
      </div>
      <div className="slider-item">
        <h3>6</h3>
      </div>
    </Slider>
  </div>
  );
}

export default UsersSlider;







/* App.css */
.slider-container {
    width: 60%;
    height: 300px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 200px;
  }
  
  .slick-slider button {
    color: #000;
    background: rgba(181, 27, 27, 0.8);
    border-radius: 50%;
    
  }
  
  .slider-item {
    text-align: center;
    background: #4CAF50;
    color: #fff;
    padding: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 20px;
    transition: transform 0.3s ease-in-out;
    height: 200px;
  }
  
  .slider-item:hover {
    transform: scale(1.05);
  }
  
  .slick-prev, .slick-next {
    z-index: 1;
    color: #000;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .slick-prev:hover, .slick-next:hover {
    background: rgba(255, 255, 255, 1);
  }
  
  .slick-prev::before, .slick-next::before {
    font-size: 20px;
  }
  
  @media (max-width: 768px) {
    .slider-item {
      padding: 20px;
    }
    
    .slider-container {
      width: 100%;
      padding: 10px;
    }
  }
  