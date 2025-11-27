import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

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
`;

const SuggestedActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.6rem;
`;

const ActionButton = styled.button`
  padding: 0.45rem 0.65rem;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
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

const CONVERSATION_FLOW = {
  welcome: {
    bot: "Hi! I'm your course creation assistant. I can help you create a custom pipeline or MCP server course based on the documentation. What would you like to build?",
    actions: ["A Pipeline", "An MCP Server", "Browse Documentation", "Not sure yet"]
  },
  docs: {
    bot: "Our documentation covers pipelines for multi-step workflows and MCP servers for extending AI capabilities. Pipelines help you chain tools together, while MCP servers provide contextual data to AI models. Which interests you?",
    actions: ["Tell me about Pipelines", "Tell me about MCP Servers", "Let's build something"]
  },
  pipeline: {
    bot: "Great! Let's create a pipeline course. What kind of data or workflow will your pipeline process?",
    placeholder: "e.g., analyze customer feedback, process invoices..."
  },
  mcp: {
    bot: "Excellent choice! What will your MCP server do? Describe the functionality you need.",
    placeholder: "e.g., manage Jira tickets, search Slack messages..."
  },
  not_sure: {
    bot: "No problem! Let me ask a few questions. What's your main goal? What problem are you trying to solve?",
    placeholder: "Describe your use case..."
  },
  details: {
    bot: "That sounds interesting! What level of experience do you have with this?",
    actions: ["Beginner - New to this", "Intermediate - Some experience", "Advanced - Expert level"]
  },
  generate: {
    bot: "Perfect! Based on our conversation, I'm creating a personalized course for you. This will take just a moment...",
  },
  complete: {
    bot: "🎉 Your course is ready! I've created a custom course based on your needs. You can find it in the course library now.",
    actions: ["View My Course", "Create Another Course"]
  }
};

export default function ChatPanel({ onCourseCreated }) {
  const [messages, setMessages] = useState([
    { id: 1, isBot: true, text: CONVERSATION_FLOW.welcome.bot, actions: CONVERSATION_FLOW.welcome.actions }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [courseType, setCourseType] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text, actions = null, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text,
        actions
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      isBot: false,
      text: text.trim()
    }]);

    setInputValue('');

    // Determine next step based on conversation state
    setTimeout(() => {
      switch (conversationState) {
        case 'welcome':
          // This shouldn't happen as we use action buttons
          break;

        case 'pipeline':
        case 'mcp':
        case 'not_sure':
          addBotMessage(
            CONVERSATION_FLOW.details.bot,
            CONVERSATION_FLOW.details.actions
          );
          setConversationState('details');
          break;

        case 'details':
          // This shouldn't happen as we use action buttons
          break;

        case 'generate':
          addBotMessage(CONVERSATION_FLOW.complete.bot, CONVERSATION_FLOW.complete.actions, 2000);
          setConversationState('complete');
          break;

        default:
          addBotMessage("I'm not sure I understand. Can you rephrase that?");
      }
    }, 100);
  };

  const handleActionClick = (action) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      isBot: false,
      text: action
    }]);

    // Determine next step
    if (conversationState === 'welcome') {
      if (action === 'A Pipeline') {
        setConversationState('pipeline');
        setCourseType('pipeline');
        addBotMessage(CONVERSATION_FLOW.pipeline.bot);
      } else if (action === 'An MCP Server') {
        setConversationState('mcp');
        setCourseType('mcp');
        addBotMessage(CONVERSATION_FLOW.mcp.bot);
      } else if (action === 'Browse Documentation') {
        setConversationState('docs');
        addBotMessage(CONVERSATION_FLOW.docs.bot, CONVERSATION_FLOW.docs.actions);
      } else {
        setConversationState('not_sure');
        setCourseType('pipeline');
        addBotMessage(CONVERSATION_FLOW.not_sure.bot);
      }
    } else if (conversationState === 'docs') {
      if (action === 'Tell me about Pipelines') {
        addBotMessage("Pipelines are multi-step workflows where each step can use different tools. They're perfect for data processing, content generation, and automation tasks. Ready to build one?", ["Yes, let's create a pipeline!"]);
        setConversationState('pipeline_ready');
        setCourseType('pipeline');
      } else if (action === 'Tell me about MCP Servers') {
        addBotMessage("MCP (Model Context Protocol) servers extend AI models with real-time data access. They can integrate with Slack, GitHub, databases, and more. Want to create one?", ["Yes, let's create an MCP server!"]);
        setConversationState('mcp_ready');
        setCourseType('mcp');
      } else if (action === "Let's build something") {
        setMessages([
          { id: Date.now(), isBot: true, text: CONVERSATION_FLOW.welcome.bot, actions: CONVERSATION_FLOW.welcome.actions }
        ]);
        setConversationState('welcome');
      }
    } else if (conversationState === 'pipeline_ready' || conversationState === 'mcp_ready') {
      const type = conversationState === 'pipeline_ready' ? 'pipeline' : 'mcp';
      setConversationState(type);
      addBotMessage(CONVERSATION_FLOW[type].bot);
    } else if (conversationState === 'details') {
      setConversationState('generate');
      addBotMessage(CONVERSATION_FLOW.generate.bot);
      setTimeout(() => {
        addBotMessage(CONVERSATION_FLOW.complete.bot, CONVERSATION_FLOW.complete.actions);
        setConversationState('complete');
      }, 2000);
    } else if (conversationState === 'complete') {
      if (action === 'View My Course') {
        addBotMessage("Opening your course...");
        // Trigger course selection in parent component
        if (onCourseCreated) {
          // Select the first course of the appropriate type as a dummy
          const dummyCourseId = courseType === 'mcp'
            ? 'mcp-slack-integration'
            : 'pipeline-github-analyzer';
          setTimeout(() => {
            onCourseCreated(dummyCourseId);
          }, 500);
        }
      } else {
        // Reset conversation
        setMessages([
          { id: Date.now(), isBot: true, text: CONVERSATION_FLOW.welcome.bot, actions: CONVERSATION_FLOW.welcome.actions }
        ]);
        setConversationState('welcome');
        setCourseType(null);
      }
    }
  };

  const currentPlaceholder = conversationState === 'pipeline' ? CONVERSATION_FLOW.pipeline.placeholder :
                           conversationState === 'mcp' ? CONVERSATION_FLOW.mcp.placeholder :
                           conversationState === 'not_sure' ? CONVERSATION_FLOW.not_sure.placeholder :
                           "Type your message...";

  return (
    <PanelContainer>
      <ContentFrame>
        <PanelHeader>
          <PanelTitle>Course Assistant</PanelTitle>
          <PanelSubtitle>Create a custom course through conversation</PanelSubtitle>
        </PanelHeader>

        <MessagesContainer>
          {messages.map(message => (
            <Message key={message.id}>
              <Avatar $isBot={message.isBot}>
                {message.isBot ? '🤖' : '👤'}
              </Avatar>
              <MessageContent $isBot={message.isBot}>
                <MessageText>{message.text}</MessageText>
                {message.actions && (
                  <SuggestedActions>
                    {message.actions.map((action, idx) => (
                      <ActionButton key={idx} onClick={() => handleActionClick(action)}>
                        {action}
                      </ActionButton>
                    ))}
                  </SuggestedActions>
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={currentPlaceholder}
              disabled={isTyping || conversationState === 'complete'}
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
