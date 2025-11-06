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
        width: '80px',
        height: '80px',
        backgroundColor: 'transparent',
      }}
    >
      <video
        src="/ai.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          boxShadow: '0 4px 20px rgba(30, 101, 173, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Chatbot;

