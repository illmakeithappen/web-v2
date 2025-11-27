import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { mergeContext } from '../../utils/contextExtractor';
import bedrockChatService from '../../services/bedrock-chat-service';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
`;

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
  background: var(--gitthub-light-beige);
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.25rem 0;
`;

const PanelSubtitle = styled.p`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$isBot ? '#FFA500' : 'var(--gitthub-black)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
  background: ${props => props.$isBot ? 'var(--gitthub-light-beige)' : '#F5F5F5'};
  padding: 0.6rem 0.85rem;
  border-radius: 6px;
  border: 1px solid ${props => props.$isBot ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--gitthub-black);
  white-space: pre-wrap;
`;

const ContextPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(36, 161, 72, 0.1);
  border-left: 3px solid #24a148;
  border-radius: 4px;
`;

const PreviewTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #24a148;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;

const PreviewText = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-black);
  font-style: italic;
`;

const InputContainer = styled.div`
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.8rem;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Lucida Grande', sans-serif;

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SendButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(to bottom, #4A90E2, #357ABD);
  color: white;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Lucida Grande', sans-serif;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(to bottom, #5AA0F2, #4080CD);
  }

  &:active {
    background: linear-gradient(to bottom, #357ABD, #2D6BA8);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Welcome message for Claude
const INITIAL_WELCOME_MESSAGE = "Hi! I'm Claude, your AI Course Creation Assistant powered by AWS Bedrock. I'll help you create a personalized course by understanding your project needs and learning goals.\n\nI'm here to have a natural conversation with you about what you want to build and learn. The more details you share, the better I can tailor a course for you.\n\nLet's start: What problem are you trying to solve, or what would you like to learn to build?";

export default function ContextCollectorChat({ context, onContextUpdate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isBot: true,
      text: INITIAL_WELCOME_MESSAGE,
      contextExtracted: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle sending message to Claude via Bedrock
   */
  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim() || isTyping) return;

    const userMessage = text.trim();

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      isBot: false,
      text: userMessage
    }]);

    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to Claude via Bedrock with context awareness
      const response = await bedrockChatService.sendContextMessage(userMessage, context);

      if (!response.success) {
        throw new Error(response.message || 'Failed to get response from Claude');
      }

      // Extract any context Claude found in the response
      let contextFeedback = null;
      if (response.extracted_context) {
        // Merge extracted context with existing context
        const updatedContext = mergeContext(context, response.extracted_context);

        // Update parent context
        if (onContextUpdate) {
          onContextUpdate(updatedContext);
        }

        // Create feedback message about what was extracted
        contextFeedback = buildContextFeedback(response.extracted_context);
      }

      // Add Claude's response to UI (cleaned of JSON blocks)
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text: response.display_message || response.message,
        contextExtracted: contextFeedback
      }]);

    } catch (error) {
      console.error('❌ Chat error:', error);

      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Build user-friendly context feedback from extracted data
   */
  const buildContextFeedback = (extractedContext) => {
    const feedback = [];

    if (extractedContext.problem?.statement) {
      feedback.push({ type: 'Problem', value: extractedContext.problem.statement });
    }
    if (extractedContext.goals && extractedContext.goals.length > 0) {
      const goalTexts = extractedContext.goals.map(g => g.text || g).join(', ');
      feedback.push({ type: 'Goals', value: goalTexts });
    }
    if (extractedContext.targetAudience?.role || extractedContext.audience?.role) {
      const audience = extractedContext.targetAudience || extractedContext.audience;
      const audienceText = [audience.role, audience.experience].filter(Boolean).join(' ');
      feedback.push({ type: 'Audience', value: audienceText });
    }
    if (extractedContext.techStack && extractedContext.techStack.length > 0) {
      feedback.push({ type: 'Tech Stack', value: extractedContext.techStack.join(', ') });
    }
    if (extractedContext.difficulty) {
      feedback.push({ type: 'Difficulty', value: extractedContext.difficulty });
    }

    return feedback.length > 0 ? feedback[0] : null;
  };

  const placeholder = "Tell me about your project...";

  return (
    <PanelContainer>
      <ContentFrame>
        <PanelHeader>
          <PanelTitle>Context Collector</PanelTitle>
          <PanelSubtitle>Tell me about your project, I'll understand and visualize it</PanelSubtitle>
        </PanelHeader>

        <MessagesContainer>
          {messages.map(message => (
            <Message key={message.id}>
              <Avatar $isBot={message.isBot}>
                {message.isBot ? '🤖' : '👤'}
              </Avatar>
              <MessageContent $isBot={message.isBot}>
                <MessageText>{message.text}</MessageText>

                {message.contextExtracted && (
                  <ContextPreview>
                    <PreviewTitle>✓ {message.contextExtracted.type} extracted</PreviewTitle>
                    <PreviewText>"{message.contextExtracted.value}"</PreviewText>
                  </ContextPreview>
                )}
              </MessageContent>
            </Message>
          ))}

          {isTyping && (
            <Message>
              <Avatar $isBot={true}>🤖</Avatar>
              <MessageContent $isBot={true}>
                <MessageText>Typing...</MessageText>
              </MessageContent>
            </Message>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <InputWrapper>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
              placeholder={placeholder}
              disabled={isTyping}
            />
            <SendButton
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </ContentFrame>
    </PanelContainer>
  );
}
