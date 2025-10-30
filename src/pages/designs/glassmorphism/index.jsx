import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/landing/Navbar';

const GlassmorphismShowcase = () => {
  const navigate = useNavigate();

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '10%',
        left: '10%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        bottom: '10%',
        right: '10%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '2s'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>

      <Navbar />
      
      {/* Hero */}
      <div style={{ 
        padding: '120px 24px 96px', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ 
          fontFamily: 'Poppins, sans-serif', 
          fontSize: '56px', 
          fontWeight: 700, 
          margin: '0 0 24px',
          color: '#FFFFFF',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          letterSpacing: '-1px'
        }}>
          Glassmorphism Design
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: 'rgba(255, 255, 255, 0.9)', 
          maxWidth: '600px', 
          margin: '0 auto',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.6
        }}>
          Modern frosted glass effects with vibrant gradients
        </p>
        <div style={{ 
          marginTop: '48px', 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {['Blur Effects', 'Gradients', 'Modern SaaS'].map((tag, i) => (
            <span key={i} style={{ 
              ...glassStyle,
              padding: '12px 24px',
              borderRadius: '100px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)';
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '64px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontSize: '36px',
          fontWeight: 600,
          marginBottom: '48px',
          color: '#FFFFFF',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          Choose Your View
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '32px' 
        }}>
          {/* High Court Card */}
          <div style={{ 
            ...glassStyle,
            borderRadius: '24px',
            padding: '48px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px 0 rgba(31, 38, 135, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onClick={() => navigate('/designs/glassmorphism/high-court')}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '32px'
              }}>
                ⚖️
              </div>
              <h3 style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '28px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#FFFFFF'
              }}>
                High Court Judgments
              </h3>
              <p style={{ 
                fontSize: '16px', 
                lineHeight: 1.6, 
                marginBottom: '32px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Inter, sans-serif'
              }}>
                Browse and search High Court judgments from across India with modern glassmorphic design.
              </p>
              <button style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                padding: '14px 32px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
              }}>
                View High Court →
              </button>
            </div>
          </div>

          {/* Supreme Court Card */}
          <div style={{ 
            ...glassStyle,
            borderRadius: '24px',
            padding: '48px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px 0 rgba(31, 38, 135, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onClick={() => navigate('/designs/glassmorphism/supreme-court')}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '32px'
              }}>
                🏛️
              </div>
              <h3 style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '28px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#FFFFFF'
              }}>
                Supreme Court Judgments
              </h3>
              <p style={{ 
                fontSize: '16px', 
                lineHeight: 1.6, 
                marginBottom: '32px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Inter, sans-serif'
              }}>
                Access and explore Supreme Court of India judgments with beautiful blur effects.
              </p>
              <button style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                padding: '14px 32px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
              }}>
                View Supreme Court →
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              padding: '14px 32px',
              ...glassStyle,
              color: '#FFFFFF',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismShowcase;

