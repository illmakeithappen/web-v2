import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  background: transparent;
  overflow: hidden;
  font-family: 'IBM Plex Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TerminalHeader = styled.div`
  background: linear-gradient(to bottom, #9a9a9a, #8a8a8a);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const TerminalTitle = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: #e8e8e8;
  margin: 0;
  font-family: 'IBM Plex Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
  text-transform: lowercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
`;

const TerminalBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 12px;
  background: linear-gradient(to bottom,
    #e8e8e8,
    #dedede
  );
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const TerminalLine = styled.div`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const PromptLine = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 2px;
`;

const Prompt = styled.span`
  color: #0969da;
  user-select: none;
  font-weight: 500;
`;

const UserInput = styled.span`
  color: #1f2328;
  font-weight: 500;
`;

const AssistantResponse = styled.div`
  color: #57606a;
  padding-left: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const SystemMessage = styled.div`
  color: #0969da;
  font-style: italic;
  margin-bottom: 6px;
  font-size: 11px;
`;

const ErrorMessage = styled.div`
  color: #cf222e;
  margin-bottom: 6px;
  font-size: 11px;
`;

const InputPrompt = styled.span`
  color: #0969da;
  user-select: none;
  font-weight: 500;
`;

const InlineInputForm = styled.form`
  margin-top: 4px;
`;

const InlineInputLine = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 0;
  color: #1f2328;
  font-family: 'IBM Plex Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 500;
  outline: none;

  &::placeholder {
    color: #a8a8a8;
    font-size: 11px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #0969da;
  margin-right: 4px;
`;

const LoadingDots = styled.span`
  color: #57606a;

  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;

export default function DocsTerminal() {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'claude-code v1.0 - Documentation Assistant'
    },
    {
      type: 'assistant',
      content: 'I can help you navigate the docs, explain concepts, or answer questions about gitthub.org.\n\nTry asking:\n  • "What courses are available?"\n  • "How do I get started?"\n  • "Tell me about pipelines"\n  • "What\'s in the research section?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const terminalBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    // Simulate response - replace with actual API call
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response
      }]);
      setIsLoading(false);
    }, 800);
  };

  const generateResponse = (userInput) => {
    const lower = userInput.toLowerCase();

    if (lower.includes('course') || lower.includes('learning')) {
      return 'The hub section (/hub) contains interactive courses including:\n  • Pipeline Builder Course - Learn to build multi-step workflows\n  • MCP Server Integration - Connect AI to external data\n  • GitHub Analyzer - Analyze repository patterns\n\nClick on your username in the nav → courses to get started.';
    }

    if (lower.includes('pipeline')) {
      return 'Pipelines are multi-step workflows where you chain tools together.\n\nKey concepts:\n  • Input/Output flow between steps\n  • Tool selection and configuration\n  • Testing and deployment\n\nCheck /src for the pipeline builder or visit the education section for tutorials.';
    }

    if (lower.includes('mcp') || lower.includes('server')) {
      return 'MCP (Model Context Protocol) servers extend AI with external capabilities.\n\nYou can build servers that:\n  • Fetch data from APIs\n  • Query databases\n  • Access file systems\n  • Integrate with tools like Slack, Jira, GitHub\n\nVisit /src → mcp server to start building.';
    }

    if (lower.includes('start') || lower.includes('begin')) {
      return 'Getting started with gitthub.org:\n\n1. Browse docs (/doc) - Educational content and research\n2. Explore src (/src) - Design pipelines and MCP servers\n3. Learn in hub (/hub) - Interactive courses with progress tracking\n\nClick README in the navigation to see the full introduction.';
    }

    if (lower.includes('research') || lower.includes('news')) {
      return 'The docs section contains:\n  • README - Project overview and vision\n  • news - Latest AI developments and updates\n  • education - Learning resources and tutorials\n  • research - Papers, insights, and deep dives\n\nNavigate using the file tree on the left.';
    }

    return `I can help with:\n  • Course information\n  • Pipeline concepts\n  • MCP server development\n  • Documentation navigation\n  • Project structure\n\nTry asking something specific about the docs or project features.`;
  };

  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalTitle>docs-assistant</TerminalTitle>
      </TerminalHeader>
      <TerminalBody ref={terminalBodyRef}>
        {messages.map((message, index) => (
          <TerminalLine key={index}>
            {message.type === 'system' && (
              <SystemMessage>{message.content}</SystemMessage>
            )}

            {message.type === 'error' && (
              <ErrorMessage>ERROR: {message.content}</ErrorMessage>
            )}

            {message.type === 'user' && (
              <>
                <PromptLine>
                  <Prompt>❯</Prompt>
                  <UserInput>{message.content}</UserInput>
                </PromptLine>
              </>
            )}

            {message.type === 'assistant' && (
              <AssistantResponse>{message.content}</AssistantResponse>
            )}
          </TerminalLine>
        ))}

        {isLoading && (
          <TerminalLine>
            <AssistantResponse>
              <LoadingDots>thinking</LoadingDots>
            </AssistantResponse>
          </TerminalLine>
        )}

        <InlineInputForm onSubmit={handleSubmit}>
          <InlineInputLine>
            <InputPrompt>❯</InputPrompt>
            {!isLoading && !input && <Cursor />}
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ask about docs..."
              disabled={isLoading}
              autoComplete="off"
            />
          </InlineInputLine>
        </InlineInputForm>

        <div ref={messagesEndRef} />
      </TerminalBody>
    </TerminalContainer>
  );
}
