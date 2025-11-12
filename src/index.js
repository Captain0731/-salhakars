// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Suppress MetaMask connection errors
// MetaMask extension automatically tries to connect, but this app doesn't use it

// Suppress React error overlay for MetaMask errors in development
if (process.env.NODE_ENV === 'development') {
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const errorMessage = message || error?.message || '';
    const errorStack = error?.stack || '';
    const isMetaMaskError = 
      errorMessage.includes('Failed to connect to MetaMask') ||
      (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
      errorStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      source?.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn');
    
    if (isMetaMaskError) {
      return true; // Suppress the error
    }
    
    if (originalErrorHandler) {
      return originalErrorHandler.call(this, message, source, lineno, colno, error);
    }
    return false;
  };
}

// Prevent MetaMask from auto-connecting
if (typeof window !== 'undefined' && window.ethereum) {
  // Override ethereum.request to prevent auto-connection attempts
  const originalRequest = window.ethereum.request;
  window.ethereum.request = async (args) => {
    // Block eth_requestAccounts calls (which trigger connection)
    if (args && args.method === 'eth_requestAccounts') {
      return Promise.reject(new Error('MetaMask connection disabled for this app'));
    }
    try {
      return await originalRequest.call(window.ethereum, args);
    } catch (error) {
      // Suppress connection-related errors
      const errorMessage = error?.message || error?.toString() || '';
      if (errorMessage.includes('Failed to connect to MetaMask') || 
          (errorMessage.includes('connect') && errorMessage.includes('MetaMask'))) {
        return Promise.reject(new Error('MetaMask connection disabled'));
      }
      throw error;
    }
  };
}

const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString() || '';
  const errorObj = args[0];
  
  // Check for MetaMask-related errors
  const isMetaMaskError = 
    message.includes('Failed to connect to MetaMask') ||
    (message.includes('MetaMask') && message.includes('connect')) ||
    (typeof args[0] === 'string' && args[0].includes('Failed to connect to MetaMask')) ||
    (errorObj?.stack && errorObj.stack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')) ||
    (errorObj?.message && errorObj.message.includes('MetaMask') && errorObj.message.includes('connect'));
  
  if (isMetaMaskError) {
    return; // Suppress MetaMask connection errors only
  }
  originalError.apply(console, args);
};

// Global error handler to catch MetaMask connection errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || event.error?.message || '';
  const errorStack = event.error?.stack || '';
  const errorSource = event.filename || '';
  
  // Check for MetaMask-related errors
  const isMetaMaskError = 
    errorMessage.includes('Failed to connect to MetaMask') ||
    (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
    (errorStack.includes('MetaMask') && errorStack.includes('connect')) ||
    errorStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
    errorSource.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn');
  
  if (isMetaMaskError) {
    event.preventDefault(); // Prevent error from showing in console
    event.stopPropagation(); // Stop error propagation
    return false;
  }
}, true); // Use capture phase to catch errors early

// Handle unhandled promise rejections related to MetaMask connection
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason?.toString() || '';
  const reasonStack = event.reason?.stack || '';
  
  // Check for MetaMask-related errors
  const isMetaMaskError = 
    reason.includes('Failed to connect to MetaMask') ||
    (reason.includes('MetaMask') && reason.includes('connect')) ||
    (reasonStack.includes('MetaMask') && reasonStack.includes('connect')) ||
    reasonStack.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn');
  
  if (isMetaMaskError) {
    event.preventDefault(); // Prevent error from showing
    event.stopPropagation(); // Stop error propagation
    return false;
  }
});

// Create root and render the app wrapped in BrowserRouter and ErrorBoundary
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
