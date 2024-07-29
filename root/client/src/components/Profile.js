import React from 'react'
import { Link } from 'react-router-dom';


function Profile() {

    const handleSubmit = (e) => {   
        e.preventDefault();
        console.log('Form submitted');
    };
  return (
    <div className="container">
    <h2>Tell people about your self</h2>
    <form action='#' onSubmit={handleSubmit}>
      <input type="text" name="text" placeholder="Title"/>
      <input type="text" name="detail" placeholder="Detail"/>
      <button type="submit">Post</button>
    </form>
    
    <div className="links">
      <Link to="/chat">Back to Chat</Link>
    </div>
  </div>
  )
}

export default Profile