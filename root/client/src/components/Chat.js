import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersSlider from './UsersSlider'; // Assuming you have this component

function Chat() {
    const navigate = useNavigate();

  return (
    <>
        <button onClick={() => { navigate('/suggestions') }}>Suggestions</button>
    </>
  );
}

export default Chat;
