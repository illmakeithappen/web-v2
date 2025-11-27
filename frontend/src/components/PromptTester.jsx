import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TesterContainer = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
`;

const TesterHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const TesterTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const TesterDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const TesterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PromptInput = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }

  &::placeholder {
    color: #999;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ModelSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-light-beige);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.disabled ? '#ccc' : 'var(--gitthub-black)'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
`;

const ResponseContainer = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  padding: 1.5rem;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ResponseLabel = styled.div`
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gitthub-gray);
  font-style: italic;

  &::after {
    content: '${props => '.'.repeat((props.$dots % 3) + 1)}';
    display: inline-block;
    width: 1.5em;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  border: 2px solid #c62828;
  border-radius: 4px;
  padding: 1rem;
  color: #c62828;
  font-weight: 600;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gitthub-gray);
  font-size: 0.85rem;
  color: var(--gitthub-gray);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: var(--gitthub-black);
    font-weight: 700;
  }
`;

const ExamplesBox = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  padding: 1.5rem;
`;

const ExamplesTitle = styled.h4`
  font-size: 1rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const ExampleItem = styled.div`
  background: white;
  border: 2px solid ${props => props.$active ? 'var(--gitthub-black)' : '#ddd'};
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExampleTitle = styled.div`
  font-weight: 700;
  color: var(--gitthub-black);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ExamplePreview = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TipBox = styled.div`
  background: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #1976d2;
  }
`;

function PromptTester({ examplePrompts = [], currentLevel = null, showExamples = true }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('claude-4-sonnet');
  const [metadata, setMetadata] = useState(null);
  const [loadingDots, setLoadingDots] = useState(0);
  const [activeExample, setActiveExample] = useState(null);

  // Animate loading dots
  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots(prev => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    setMetadata(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/chat`,
        {
          message: prompt,
          model: model,
          max_tokens: 1000,
          temperature: 0.7
        }
      );

      setResponse(response.data.message);
      setMetadata({
        model: response.data.model_used,
        tokens: response.data.tokens_used,
        timestamp: response.data.timestamp
      });
    } catch (err) {
      console.error('Chat error:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to get response. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example.prompt);
    setActiveExample(example.id);
    setResponse('');
    setError(null);
    setMetadata(null);
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
    setError(null);
    setMetadata(null);
    setActiveExample(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendPrompt();
    }
  };

  return (
    <TesterContainer>
      <TesterHeader>
        <TesterTitle>Interactive Prompt Tester</TesterTitle>
        <TesterDescription>
          Write your own prompts or try the examples below. See how different prompts produce different results.
          {currentLevel && ` You're practicing Level ${currentLevel} skills.`}
        </TesterDescription>
      </TesterHeader>

      <TesterGrid>
        <MainColumn>
          <div>
            <ResponseLabel>Your Prompt</ResponseLabel>
            <PromptInput
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your prompt here... (Cmd/Ctrl + Enter to send)"
            />
          </div>

          <ControlsRow>
            <ModelSelect value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="claude-4-sonnet">Claude 4 Sonnet</option>
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
              <option value="nova-pro">Amazon Nova Pro</option>
              <option value="nova-lite">Amazon Nova Lite</option>
            </ModelSelect>

            <SendButton onClick={handleSendPrompt} disabled={loading || !prompt.trim()}>
              {loading ? 'Sending...' : 'Send Prompt'}
            </SendButton>

            <ClearButton onClick={handleClear}>
              Clear
            </ClearButton>
          </ControlsRow>

          <div>
            <ResponseLabel>AI Response</ResponseLabel>
            <ResponseContainer>
              {loading && <LoadingIndicator $dots={loadingDots}>Thinking</LoadingIndicator>}
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {response && !loading && response}
              {!response && !loading && !error && 'Response will appear here...'}
            </ResponseContainer>

            {metadata && (
              <MetaInfo>
                <MetaItem>
                  <strong>Model</strong>
                  <span>{metadata.model}</span>
                </MetaItem>
                <MetaItem>
                  <strong>Tokens Used</strong>
                  <span>{metadata.tokens}</span>
                </MetaItem>
                <MetaItem>
                  <strong>Timestamp</strong>
                  <span>{new Date(metadata.timestamp).toLocaleTimeString()}</span>
                </MetaItem>
              </MetaInfo>
            )}
          </div>
        </MainColumn>

        {showExamples && examplePrompts.length > 0 && (
          <SideColumn>
            <ExamplesBox>
              <ExamplesTitle>Try These Examples</ExamplesTitle>
              {examplePrompts.map((example) => (
                <ExampleItem
                  key={example.id}
                  $active={activeExample === example.id}
                  onClick={() => handleExampleClick(example)}
                >
                  <ExampleTitle>{example.title}</ExampleTitle>
                  <ExamplePreview>{example.prompt.substring(0, 60)}...</ExamplePreview>
                </ExampleItem>
              ))}
            </ExamplesBox>

            {activeExample && examplePrompts.find(ex => ex.id === activeExample) && (
              <TipBox>
                <strong>What You'll Learn:</strong>
                {examplePrompts.find(ex => ex.id === activeExample).whatYouLearn}
              </TipBox>
            )}
          </SideColumn>
        )}
      </TesterGrid>
    </TesterContainer>
  );
}

export default PromptTester;
