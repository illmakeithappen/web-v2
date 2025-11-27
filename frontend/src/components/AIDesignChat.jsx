import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Two-Column Layout
const TwoColumnLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 400px);
  min-height: 600px;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

// Left Column: Context Panel
const LeftColumn = styled.div`
  flex: 0 0 300px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    flex: 1;
    min-height: 300px;
  }
`;

// Right Column: Chat Interface
const RightColumn = styled.div`
  flex: 1;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Context Panel Styles
const ContextContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ContextSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ContextHeading = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gitthub-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const ContextItem = styled.div`
  background: var(--gitthub-light-beige);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
`;

const ModelSelector = styled.div`
  padding: 1rem;
  border-top: 2px solid var(--gitthub-black);
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: black;
  }
`;

// Chat Interface Styles
const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 80%;
  align-self: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background: ${props => props.$role === 'user' ? 'var(--gitthub-black)' : 'var(--gitthub-light-beige)'};
  color: ${props => props.$role === 'user' ? 'white' : 'var(--gitthub-black)'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border-bottom-${props => props.$role === 'user' ? 'right' : 'left'}-radius: 4px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: var(--gitthub-gray);
  margin-top: 0.25rem;
  padding: 0 0.5rem;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gitthub-gray);
  text-align: center;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyHint = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

// Input Area
const InputArea = styled.div`
  border-top: 2px solid var(--gitthub-black);
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: black;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--gitthub-gray);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--gitthub-gray);
  border: 1px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-light-beige);
    border-color: var(--gitthub-black);
    color: var(--gitthub-black);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--gitthub-light-beige);
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  max-width: fit-content;

  span {
    width: 8px;
    height: 8px;
    background: var(--gitthub-gray);
    border-radius: 50%;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

function AIDesignChat({ tools }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
  const messagesEndRef = useRef(null);

  const models = [
    { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet (Recommended)' },
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
    { id: 'nova-pro', name: 'Amazon Nova Pro' },
    { id: 'nova-lite', name: 'Amazon Nova Lite' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/v1/chat`, {
        message: input.trim(),
        conversation_history: messages,
        model: selectedModel,
        max_tokens: 1000,
        temperature: 0.7
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const getContextSummary = () => {
    const categories = {};
    tools.forEach(tool => {
      categories[tool.category] = (categories[tool.category] || 0) + 1;
    });
    return categories;
  };

  const contextSummary = getContextSummary();

  return (
    <TwoColumnLayout>
      {/* LEFT: Context Panel */}
      <LeftColumn>
        <SectionHeader>
          <SectionTitle>Context</SectionTitle>
        </SectionHeader>

        <ContextContent>
          <ContextSection>
            <ContextHeading>Available Tools</ContextHeading>
            <ContextItem>{tools.length} tools in database</ContextItem>
            {Object.entries(contextSummary).map(([category, count]) => (
              <ContextItem key={category}>
                {count} {category} tools
              </ContextItem>
            ))}
          </ContextSection>

          <ContextSection>
            <ContextHeading>Conversation</ContextHeading>
            <ContextItem>{messages.length} messages</ContextItem>
            <ContextItem>
              {messages.filter(m => m.role === 'user').length} from you
            </ContextItem>
          </ContextSection>

          <ContextSection>
            <ContextHeading>Instructions</ContextHeading>
            <ContextItem style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              Describe your project idea and I'll help you choose the right tools and design your workflow.
            </ContextItem>
          </ContextSection>

          <ButtonGroup>
            <ClearButton onClick={handleClear} disabled={messages.length === 0}>
              Clear Chat
            </ClearButton>
          </ButtonGroup>
        </ContextContent>

        <ModelSelector>
          <ContextHeading>AI Model</ContextHeading>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </Select>
        </ModelSelector>
      </LeftColumn>

      {/* RIGHT: Chat Interface */}
      <RightColumn>
        <SectionHeader>
          <SectionTitle>💬 AI Design Assistant</SectionTitle>
        </SectionHeader>

        <ChatMessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💬</EmptyIcon>
              <EmptyText>Start a conversation</EmptyText>
              <EmptyHint>
                Tell me about your project and I'll help you design the perfect tech stack
              </EmptyHint>
            </EmptyState>
          ) : (
            <>
              {messages.map((msg, index) => (
                <Message key={index} $role={msg.role}>
                  <MessageBubble $role={msg.role}>
                    {msg.content}
                  </MessageBubble>
                  <MessageTime>{msg.timestamp}</MessageTime>
                </Message>
              ))}
              {isLoading && (
                <Message $role="assistant">
                  <TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </TypingIndicator>
                </Message>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </ChatMessagesContainer>

        <InputArea>
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <SendButton onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </SendButton>
        </InputArea>
      </RightColumn>
    </TwoColumnLayout>
  );
}

export default AIDesignChat;
