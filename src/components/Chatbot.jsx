import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/legal-chatbot');
  };

  return (
    <div 
      className="fixed bottom-10 right-4 z-50 transition-transform duration-300 hover:scale-110 cursor-pointer"
      onClick={handleChatbotClick}
      style={{
        width: '80px',
        height: '100px',
        backgroundColor: 'transparent',
      }}
    >
      <img
        src="/uit3.gif"
        alt="Chatbot"
       
      />
    </div>
  );
};

export default Chatbot;

