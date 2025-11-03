import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/legal-chatbot');
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110 cursor-pointer"
      onClick={handleChatbotClick}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: 'transparent',
        background: 'transparent',
      }}
    >
      <img
        src="/chatbot.png"
        alt="Chatbot"
        style={{
          width: '70%',
          height: '70%',
          objectFit: 'contain',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          background: 'transparent',
          mixBlendMode: 'multiply',
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Chatbot;

