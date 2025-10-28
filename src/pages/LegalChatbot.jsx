import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";

export default function LegalChatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);


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

  const legalTopics = [
    {
      category: "Property Law",
      icon: "🏠",
      description: "Property ownership, transfer, disputes, and rights",
      questions: [
        "How to transfer property ownership?",
        "What are property registration requirements?",
        "How to resolve property disputes?"
      ]
    },
    {
      category: "Family Law",
      icon: "👨‍👩‍👧‍👦",
      description: "Marriage, divorce, custody, and family matters",
      questions: [
        "What are the grounds for divorce?",
        "How to get child custody?",
        "What is the process for adoption?"
      ]
    },
    {
      category: "Criminal Law",
      icon: "⚖️",
      description: "Criminal offenses, procedures, and rights",
      questions: [
        "What are my rights if arrested?",
        "How to file a criminal complaint?",
        "What is the bail process?"
      ]
    },
    {
      category: "Consumer Law",
      icon: "🛒",
      description: "Consumer rights and protection",
      questions: [
        "How to file a consumer complaint?",
        "What are consumer rights?",
        "How to get refund for defective product?"
      ]
    },
    {
      category: "Employment Law",
      icon: "💼",
      description: "Workplace rights and employment issues",
      questions: [
        "What are employee rights?",
        "How to handle workplace harassment?",
        "What is the notice period for resignation?"
      ]
    },
    {
      category: "Corporate Law",
      icon: "🏢",
      description: "Business formation and corporate matters",
      questions: [
        "How to register a company?",
        "What are director responsibilities?",
        "How to dissolve a partnership?"
      ]
    }
  ];

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI Legal Assistant. I can help you with various legal questions and provide guidance on legal matters. How can I assist you today?",
        sender: "bot",
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    // Always scroll to bottom when new messages are added
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (isAtBottom) {
        setUserScrolling(false);
      } else {
        setUserScrolling(true);
      }
    }
  };

  const getBotResponse = (userMessage) => {
    // TODO: Implement real AI chatbot integration
    return "I'm sorry, but the AI chatbot feature is not yet implemented. Please check back later for this functionality.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);
    setIsTyping(true);
    
    // Force scroll to bottom when user sends message
    setUserScrolling(false);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
      setIsTyping(false);
      
      // Always scroll to bottom after bot response
      setTimeout(() => {
        setUserScrolling(false);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Focus input after a short delay to ensure it's rendered
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
        text: "Hello! I'm your AI Legal Assistant. I can help you with various legal questions and provide guidance on legal matters. How can I assist you today?",
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
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Legal AI Chatbot
            </h1>
            <p className="text-lg" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Get instant legal guidance and answers to your legal questions with our AI-powered legal assistant
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[500px] flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        Legal AI Assistant
                      </h3>
                      <p className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                        Online • Ready to help
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Clear Chat
                  </button>
                </div>

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 space-y-3"
                  onScroll={handleScroll}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {message.text}
                        </p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your legal question here..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none"
                      style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                      disabled={loading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !inputMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              {/* Quick Questions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-4">
                <h3 className="font-semibold mb-3" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Quick Questions
                </h3>
                <div className="space-y-1">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border border-gray-200 hover:border-blue-200"
                      style={{ fontFamily: 'Roboto, sans-serif', minHeight: '44px' }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Topics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <h3 className="font-semibold mb-3" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Legal Topics
                </h3>
                <div className="space-y-2">
                  {legalTopics.map((topic, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg flex-shrink-0">{topic.icon}</span>
                        <h4 className="font-medium text-sm" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          {topic.category}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {topic.description}
                      </p>
                      <div className="space-y-1">
                        {topic.questions.map((question, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => handleQuickQuestion(question)}
                            className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mt-4">
                <h4 className="font-semibold text-sm mb-2" style={{ color: '#1E65AD' }}>
                  ⚠️ Legal Disclaimer
                </h4>
                <p className="text-xs text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  This AI assistant provides general legal information only. It does not constitute legal advice. For specific legal matters, please consult with a qualified lawyer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
