import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const DescriberContainer = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }

  &::placeholder {
    color: var(--gitthub-gray);
  }
`;

const ExamplesSection = styled.div`
  margin-bottom: 2rem;
`;

const ExamplesTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ExampleCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #FFA500;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ExampleTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const ExampleText = styled.div`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  line-height: 1.4;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 2rem;
  background: #FFA500;
  color: white;
  border: 2px solid #FFA500;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #FF8C00;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #FFA500;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const LoadingHint = styled.div`
  font-size: 0.9rem;
  color: var(--gitthub-gray);
`;

const ErrorContainer = styled.div`
  background: #FEE;
  border: 2px solid #F44;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #C00;
  font-size: 0.9rem;
`;

const EXAMPLE_WORKFLOWS = [
  {
    title: 'GitHub Project Manager',
    description: 'I want Claude to manage GitHub issues - create, assign, label, search, and generate progress reports'
  },
  {
    title: 'Document Knowledge Base',
    description: 'I want Claude to search through my local markdown documentation, find relevant sections, and help me keep docs updated and well-organized'
  },
  {
    title: 'Notion Workspace Manager',
    description: 'I want Claude to manage my Notion workspace - create pages, update properties, search content, and organize databases'
  },
  {
    title: 'Data Pipeline Orchestrator',
    description: 'I want Claude to help me build and manage data pipelines - fetch data from APIs, transform it, validate schemas, and store results'
  }
];

function WorkflowDescriber({ onSubmit, initialDescription = '' }) {
  const [description, setDescription] = useState(initialDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExampleClick = (example) => {
    setDescription(example.description);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/v1/mcp/analyze`, {
        workflow_description: description,
        model: 'claude-4-sonnet',
        include_examples: true
      });

      onSubmit(description, response.data);
    } catch (err) {
      console.error('Workflow analysis error:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to analyze workflow. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DescriberContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Analyzing your workflow...</LoadingText>
          <LoadingHint>Claude is thinking about the best MCP building blocks for your use case</LoadingHint>
        </LoadingContainer>
      </DescriberContainer>
    );
  }

  return (
    <DescriberContainer>
      <SectionTitle>Step 1: Describe Your Workflow</SectionTitle>
      <SectionDescription>
        Tell us what you want Claude to do. Describe your ideal workflow in plain English.
        Our AI will analyze your description and suggest the perfect MCP building blocks.
      </SectionDescription>

      {error && (
        <ErrorContainer>
          <strong>Error:</strong> {error}
        </ErrorContainer>
      )}

      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Example: I want Claude to manage my GitHub issues - create, assign, label, search, and generate weekly progress reports..."
      />

      <ExamplesSection>
        <ExamplesTitle>Or try one of these examples:</ExamplesTitle>
        <ExamplesGrid>
          {EXAMPLE_WORKFLOWS.map((example, index) => (
            <ExampleCard key={index} onClick={() => handleExampleClick(example)}>
              <ExampleTitle>{example.title}</ExampleTitle>
              <ExampleText>{example.description}</ExampleText>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </ExamplesSection>

      <SubmitButton
        onClick={handleSubmit}
        disabled={!description.trim() || isLoading}
      >
        Analyze with AI →
      </SubmitButton>
    </DescriberContainer>
  );
}

export default WorkflowDescriber;
