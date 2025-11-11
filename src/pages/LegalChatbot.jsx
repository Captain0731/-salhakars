import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import { Send, Bot, User, Sparkles, X, RotateCcw, Mic, MicOff, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import apiService from "../services/api";

export default function LegalChatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const quickQuestions = [
    "What are my rights as a tenant?",
    "How do I file a consumer complaint?",
    "What is the process for property registration?",
    "How to draft a legal notice?",
    "What are the grounds for divorce?",
    "How to register a business?",
    "What is the procedure for will registration?",
    "How to file an RTI application?"
  ];

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Kiki, your AI Legal Assistant. I can help you with various legal questions and provide guidance on legal matters. How can I assist you today?",
        sender: "bot",
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const scrollToBottom = useCallback(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Try scrolling the messages container first
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        // Also try scrolling to the end ref element
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 150);
    });
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added or typing state changes
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping, scrollToBottom]);

  // Additional scroll when typing indicator appears/disappears
  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    
    // Scroll to bottom immediately after adding user message
    setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    setLoading(true);
    setIsTyping(true);

    try {
      // Call the AI Assistant API
      const response = await apiService.llmChat(currentInput);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response.reply || "I'm sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        usedTools: response.used_tools || false,
        toolUsed: response.tool_used || null,
        searchInfo: response.search_info || null
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Scroll to bottom after bot response
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, there was an error processing your message. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
      
      // Scroll to bottom after error response
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  // Voice Recording Functions
  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      const streamRef = stream; // Store stream reference

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleVoiceInput(audioBlob);
        
        // Stop all tracks
        streamRef.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const handleVoiceInput = async (audioBlob) => {
    setIsProcessingVoice(true);
    setIsTyping(true);

    try {
      // Create a File object from the blob
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Call the Speech API
      const response = await apiService.speechToGemini(audioFile);

      // Note: The new API doesn't return transcription separately
      // The transcription is handled internally and only the AI reply is returned
      // We'll show a placeholder message for voice input
      const userMessage = {
        id: Date.now(),
        text: "[Voice message]",
        sender: "user",
        timestamp: new Date().toISOString(),
        isVoice: true
      };
      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => scrollToBottom(), 50);

      // Add bot response
      const botResponse = {
        id: Date.now() + 1,
        text: response.reply || "I'm sorry, I couldn't process your voice input. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        usedTools: response.used_tools || false,
        toolUsed: response.tool_used || null,
        searchInfo: response.search_info || null
      };
      setMessages(prev => [...prev, botResponse]);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, there was an error processing your voice input. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessingVoice(false);
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file.');
      return;
    }

    setIsProcessingVoice(true);
    setIsTyping(true);

    try {
      const response = await apiService.speechToGemini(file);

      // Note: The new API doesn't return transcription separately
      // The transcription is handled internally and only the AI reply is returned
      // We'll show a placeholder message for uploaded audio
      const userMessage = {
        id: Date.now(),
        text: "[Audio file uploaded]",
        sender: "user",
        timestamp: new Date().toISOString(),
        isVoice: true
      };
      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => scrollToBottom(), 50);

      // Add bot response
      const botResponse = {
        id: Date.now() + 1,
        text: response.reply || "I'm sorry, I couldn't process your audio file. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        usedTools: response.used_tools || false,
        toolUsed: response.tool_used || null,
        searchInfo: response.search_info || null
      };
      setMessages(prev => [...prev, botResponse]);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error processing audio file:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, there was an error processing your audio file. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessingVoice(false);
      setIsTyping(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Kiki, your AI Legal Assistant. I can help you with various legal questions and provide guidance on legal matters. How can I assist you today?",
        sender: "bot",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 pt-20 sm:pt-28 md:pt-32 lg:pt-40 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Legal AI Chatbot
            </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Get instant legal guidance and answers to your legal questions with Kiki AI
            </motion.p>
          </div>
        </div>
          </div>

      <div className="p-3 sm:p-4 md:p-6 lg:p-8 -mt-2 sm:-mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Chat Interface - Main */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
                style={{ 
                  height: 'calc(100vh - 180px)',
                  minHeight: '400px',
                  maxHeight: 'calc(100vh - 180px)'
                }}
              >
                {/* Chat Header */}
                <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          Kiki AI Assistant
                      </h3>
                        <p className="text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 truncate" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                        <span className="truncate">Online • Ready to help</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                      title="Clear Chat"
                  >
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Clear</span>
                  </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white"
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E0 #F7FAFC'
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                      key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            ) : (
                              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                            )}
                          </div>
                          
                          {/* Message Bubble */}
                          <div className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                          }`}>
                            {message.isVoice && (
                              <div className="flex items-center gap-1 mb-1.5">
                                <Mic className="w-3 h-3 text-blue-200" />
                                <span className="text-[10px] text-blue-200 italic">Voice input</span>
                              </div>
                            )}
                            {message.sender === 'bot' ? (
                              <div 
                                className="text-xs sm:text-sm md:text-base leading-relaxed break-words chatbot-markdown" 
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <p style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>{children}</p>,
                                    h1: ({ children }) => <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.75rem' }}>{children}</h1>,
                                    h2: ({ children }) => <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.75rem' }}>{children}</h2>,
                                    h3: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.75rem' }}>{children}</h3>,
                                    ul: ({ children }) => <ul style={{ marginLeft: '1rem', marginBottom: '0.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>{children}</ul>,
                                    ol: ({ children }) => <ol style={{ marginLeft: '1rem', marginBottom: '0.5rem', marginTop: '0.5rem', listStyleType: 'decimal' }}>{children}</ol>,
                                    li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
                                    code: ({ children, className }) => {
                                      const isInline = !className;
                                      return isInline ? (
                                        <code style={{ 
                                          backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                                          padding: '0.125rem 0.25rem', 
                                          borderRadius: '0.25rem',
                                          fontSize: '0.875em',
                                          fontFamily: 'monospace'
                                        }}>{children}</code>
                                      ) : (
                                        <code style={{ 
                                          display: 'block',
                                          backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                                          padding: '0.5rem', 
                                          borderRadius: '0.25rem',
                                          fontSize: '0.875em',
                                          fontFamily: 'monospace',
                                          overflowX: 'auto',
                                          marginTop: '0.5rem',
                                          marginBottom: '0.5rem'
                                        }}>{children}</code>
                                      );
                                    },
                                    blockquote: ({ children }) => (
                                      <blockquote style={{ 
                                        borderLeft: '3px solid #1E65AD', 
                                        paddingLeft: '0.75rem', 
                                        marginLeft: '0',
                                        marginTop: '0.5rem',
                                        marginBottom: '0.5rem',
                                        fontStyle: 'italic',
                                        color: '#4a5568'
                                      }}>{children}</blockquote>
                                    ),
                                    a: ({ href, children }) => (
                                      <a 
                                        href={href} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                          color: '#1E65AD', 
                                          textDecoration: 'underline',
                                          wordBreak: 'break-all'
                                        }}
                                      >
                                        {children}
                                      </a>
                                    ),
                                    strong: ({ children }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                                    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                                  }}
                                >
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm md:text-base leading-relaxed break-words" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                {message.text}
                              </p>
                            )}
                            <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`} style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                          <div className="flex space-x-1 sm:space-x-1.5">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-white">
                  {/* Voice Recording Animation Overlay */}
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg sm:rounded-xl flex items-center gap-3 sm:gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-red-700 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Recording...
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="flex items-end gap-0.5 sm:gap-1" style={{ height: '20px' }}>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0s', height: '8px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.1s', height: '12px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.2s', height: '16px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.3s', height: '20px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.4s', height: '16px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.5s', height: '12px' }}></div>
                              <div className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-voice-bar" style={{ animationDelay: '0.6s', height: '8px' }}></div>
                            </div>
                            <p className="text-xs sm:text-sm text-red-600 ml-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                              Click mic button to stop
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-end gap-2 sm:gap-3">
                    {/* Voice Recording Button */}
                    <button
                      onClick={startRecording}
                      disabled={loading || isProcessingVoice}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif', minWidth: '44px' }}
                      title={isRecording ? "Click to stop recording" : "Click to start recording"}
                    >
                      {isRecording ? (
                        <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>

                    {/* File Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="audio-file-input"
                      disabled={loading || isProcessingVoice}
                    />
                    <label
                      htmlFor="audio-file-input"
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        loading || isProcessingVoice
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif', minWidth: '44px' }}
                      title="Upload audio file"
                    >
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    </label>

                    <div className="flex-1 relative">
                      <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <img 
                          src="/uit3.GIF" 
                          alt="Message" 
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                        placeholder="Ask your legal question..."
                        rows={1}
                        className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none overflow-hidden"
                        style={{ 
                          fontFamily: 'Roboto, sans-serif',
                          minHeight: '44px',
                          maxHeight: '120px'
                        }}
                      disabled={loading || isProcessingVoice}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                      {inputMessage && (
                        <button
                          onClick={() => setInputMessage("")}
                          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || isProcessingVoice || !inputMessage.trim()}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0"
                      style={{ fontFamily: 'Roboto, sans-serif', minWidth: '44px' }}
                    >
                      {(loading || isProcessingVoice) ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {isRecording ? "Recording... Click mic button again to stop" : "Press Enter to send • Click mic to record • Upload audio file"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-4 sm:space-y-6">
              {/* Quick Questions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-5 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg truncate" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Quick Questions
                </h3>
                </div>
                <div className="space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-2.5 sm:p-3 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:shadow-md group"
                      style={{ fontFamily: 'Roboto, sans-serif', minHeight: '40px' }}
                    >
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium block line-clamp-2">
                      {question}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">⚠️</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      Legal Disclaimer
                </h4>
                    <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  This AI assistant provides general legal information only. It does not constitute legal advice. For specific legal matters, please consult with a qualified lawyer.
                </p>
              </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #F7FAFC;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
        
        /* Voice Recording Animation */
        @keyframes voice-bar {
          0%, 100% {
            transform: scaleY(0.4);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        .animate-voice-bar {
          animation: voice-bar 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
