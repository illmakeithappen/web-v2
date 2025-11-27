import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Claude, your AI assistant powered by AWS Bedrock. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
  const [availableModels, setAvailableModels] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load available models on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/chat/models')
      .then(res => res.json())
      .then(data => {
        setAvailableModels(data.models);
      })
      .catch(err => console.error('Failed to load models:', err));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation_history: messages,
          model: selectedModel,
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp,
        model_used: data.model_used,
        tokens_used: data.tokens_used
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m Claude, your AI assistant powered by AWS Bedrock. How can I help you today?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-title">
          <h3>🤖 Chat with Claude</h3>
          <span className="chat-subtitle">Powered by AWS Bedrock</span>
        </div>
        <div className="chat-controls">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-selector"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} {model.recommended && '⭐'}
              </option>
            ))}
          </select>
          <button onClick={clearChat} className="clear-button" title="Clear chat">
            🗑️
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role} ${message.error ? 'error' : ''}`}
          >
            <div className="message-content">
              {message.role === 'assistant' && (
                <div className="message-avatar">🤖</div>
              )}
              {message.role === 'user' && (
                <div className="message-avatar">👤</div>
              )}
              <div className="message-text">
                <div className="message-body">
                  {message.content}
                </div>
                <div className="message-meta">
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  {message.model_used && (
                    <span className="message-model">via {message.model_used}</span>
                  )}
                  {message.tokens_used && (
                    <span className="message-tokens">{message.tokens_used} tokens</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="message-avatar">🤖</div>
              <div className="message-text">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>
        <div className="input-hint">
          💡 Tip: Claude can help with coding, analysis, writing, and much more!
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;