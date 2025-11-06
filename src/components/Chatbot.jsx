import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/legal-chatbot');
  };

  return (
    <div 
      className="fixed bottom-2 right-2 z-50 transition-transform duration-300 hover:scale-110 cursor-pointer"
      onClick={handleChatbotClick}
      style={{
        width: '150px',
        height: '100px',
        backgroundColor: 'transparent',
      }}
    >
      <img
        src="/uit.gif"
        alt="Chatbot"
       
      />
    </div>
  );
};

export default Chatbot;

