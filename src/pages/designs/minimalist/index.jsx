import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/landing/Navbar';

const MinimalistDesignShowcase = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Navbar />
      
      {/* Hero */}
      <div style={{ 
        background: '#000000', 
        color: '#FFFFFF', 
        padding: '120px 24px 96px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontSize: '64px', 
          fontWeight: 800, 
          margin: '0 0 24px',
          textTransform: 'uppercase',
          letterSpacing: '-2px'
        }}>
          MINIMALIST DESIGN
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          BRUTALIST/SWISS DESIGN - STARK & BOLD
        </p>
        <div style={{ 
          marginTop: '48px', 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            background: '#FFFFFF', 
            color: '#000000', 
            padding: '8px 24px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12px',
            fontWeight: 600
          }}>
            MONOSPACE FONTS
          </span>
          <span style={{ 
            background: '#FFFFFF', 
            color: '#000000', 
            padding: '8px 24px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12px',
            fontWeight: 600
          }}>
            HIGH CONTRAST
          </span>
          <span style={{ 
            background: '#FF0000', 
            color: '#FFFFFF', 
            padding: '8px 24px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12px',
            fontWeight: 600
          }}>
            RED ACCENTS
          </span>
        </div>
      </div>

      {/* Options */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ 
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '48px',
          textTransform: 'uppercase',
          borderBottom: '4px solid #000000',
          paddingBottom: '16px'
        }}>
          SELECT VIEW
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          {/* High Court Card */}
          <div style={{ 
            border: '3px solid #000000', 
            padding: '48px',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = '-4px -4px 0 #000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => navigate('/designs/minimalist/high-court')}>
            <h3 style={{ 
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              HIGH COURT JUDGMENTS
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
              Browse and search High Court judgments from across India with the minimalist design interface.
            </p>
            <button style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '16px 32px',
              border: '3px solid #000000',
              background: '#000000',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}>
              VIEW HIGH COURT →
            </button>
          </div>

          {/* Supreme Court Card */}
          <div style={{ 
            border: '3px solid #000000', 
            padding: '48px',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = '-4px -4px 0 #000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => navigate('/designs/minimalist/supreme-court')}>
            <h3 style={{ 
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              SUPREME COURT JUDGMENTS
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
              Access and explore Supreme Court of India judgments with brutalist design aesthetics.
            </p>
            <button style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '16px 32px',
              border: '3px solid #000000',
              background: '#000000',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}>
              VIEW SUPREME COURT →
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '16px 32px',
              border: '3px solid #000000',
              background: '#FFFFFF',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            ← BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinimalistDesignShowcase;

