import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if error is related to MetaMask
    const errorMessage = error?.message || error?.toString() || '';
    const errorStack = error?.stack || '';
    
    const isMetaMaskError = 
      errorMessage.includes('Failed to connect to MetaMask') ||
      (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
      (errorStack.includes('MetaMask') && errorStack.includes('connect')) ||
      errorStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn');
    
    if (isMetaMaskError) {
      // Suppress MetaMask errors - return null to prevent state update
      return null;
    }
    
    // For other errors, show error boundary
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Check if error is related to MetaMask
    const errorMessage = error?.message || error?.toString() || '';
    const errorStack = error?.stack || '';
    const componentStack = errorInfo?.componentStack || '';
    
    const isMetaMaskError = 
      errorMessage.includes('Failed to connect to MetaMask') ||
      (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
      (errorStack.includes('MetaMask') && errorStack.includes('connect')) ||
      errorStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      componentStack.includes('MetaMask');
    
    if (isMetaMaskError) {
      // Suppress MetaMask errors - don't log or show them
      console.log('MetaMask connection error suppressed (app does not use MetaMask)');
      return;
    }
    
    // Log other errors normally
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // If it's a MetaMask error, just render children normally
    if (this.state.error) {
      const errorMessage = this.state.error?.message || this.state.error?.toString() || '';
      const errorStack = this.state.error?.stack || '';
      
      const isMetaMaskError = 
        errorMessage.includes('Failed to connect to MetaMask') ||
        (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
        (errorStack.includes('MetaMask') && errorStack.includes('connect')) ||
        errorStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn');
      
      if (isMetaMaskError) {
        // Suppress MetaMask errors - render children normally
        return this.props.children;
      }
    }
    
    if (this.state.hasError) {
      // For non-MetaMask errors, show error UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

