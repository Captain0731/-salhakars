// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Suppress MetaMask connection errors
// MetaMask extension automatically tries to connect, but this app doesn't use it
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString() || '';
  // Only suppress specific MetaMask connection errors
  if (
    message.includes('Failed to connect to MetaMask') ||
    (message.includes('MetaMask') && message.includes('connect')) ||
    (typeof args[0] === 'string' && args[0].includes('Failed to connect to MetaMask'))
  ) {
    return; // Suppress MetaMask connection errors only
  }
  originalError.apply(console, args);
};

// Global error handler to catch MetaMask connection errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || event.error?.message || '';
  const errorStack = event.error?.stack || '';
  
  // Only suppress MetaMask connection errors, not all MetaMask errors
  if (
    errorMessage.includes('Failed to connect to MetaMask') ||
    (errorMessage.includes('MetaMask') && errorMessage.includes('connect')) ||
    (errorStack.includes('MetaMask') && errorStack.includes('connect'))
  ) {
    event.preventDefault(); // Prevent error from showing in console
    return false;
  }
}, true); // Use capture phase to catch errors early

// Handle unhandled promise rejections related to MetaMask connection
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason?.toString() || '';
  
  // Only suppress MetaMask connection errors
  if (
    reason.includes('Failed to connect to MetaMask') ||
    (reason.includes('MetaMask') && reason.includes('connect'))
  ) {
    event.preventDefault(); // Prevent error from showing
    return false;
  }
});

// Create root and render the app wrapped in BrowserRouter
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
