import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/legal-chatbot');
  };

  return (
    <div 
      className="fixed bottom-8 sm:bottom-6 md:bottom-2 right-3 sm:right-4 z-50 transition-transform duration-300 hover:scale-110 cursor-pointer"
      onClick={handleChatbotClick}
      style={{
        width: '100px',
        height: '125px',
        backgroundColor: 'transparent',
      }}
    >
      <img
        src="/uit3.gif"
        alt="Chatbot"
        className="w-full h-full object-contain"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default Chatbot;

