import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import WorkflowDescriber from '../mcp/WorkflowDescriber';
import ComponentSuggester from '../mcp/ComponentSuggester';
import MCPVisualBuilder from '../mcp/MCPVisualBuilder';
import CodePreview from '../mcp/CodePreview';

const API_URL = import.meta.env.VITE_API_URL || '';

const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
  background: white;
`;

const StepContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: ${props => props.$justify || 'space-between'};
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  gap: 0.75rem;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.$primary ? '#FFA500' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid ${props => props.$primary ? '#FFA500' : 'var(--gitthub-black)'};
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${props => props.$primary ? '#FF8C00' : 'var(--gitthub-black)'};
    color: white;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

/**
 * MCPGeneratorInner - Content renderer for MCP workflow
 * State is managed by parent (SrcPage)
 */
export default function MCPGeneratorInner({ mcpState, onMCPStateChange }) {
  const { currentStep, workflowDescription, analysis, serverConfig, generatedCode } = mcpState;

  const handleWorkflowSubmit = (description, analysisResult) => {
    onMCPStateChange({
      ...mcpState,
      workflowDescription: description,
      analysis: analysisResult,
      currentStep: 2
    });
  };

  const handleSuggestionsAccept = (config) => {
    onMCPStateChange({
      ...mcpState,
      serverConfig: config,
      currentStep: 3
    });
  };

  const handleConfigComplete = async (finalConfig) => {
    onMCPStateChange({
      ...mcpState,
      serverConfig: finalConfig
    });

    try {
      const response = await axios.post(`${API_URL}/api/v1/mcp/generate`, {
        config: finalConfig,
        include_tests: true,
        include_examples: true
      });

      onMCPStateChange({
        ...mcpState,
        serverConfig: finalConfig,
        generatedCode: response.data,
        currentStep: 4
      });
    } catch (error) {
      console.error('Code generation failed:', error);
      alert('Failed to generate code. Please try again.');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      onMCPStateChange({
        ...mcpState,
        currentStep: currentStep - 1
      });
    }
  };

  return (
    <ContentContainer>
      <StepContent>
        {currentStep === 1 && (
          <WorkflowDescriber onSubmit={handleWorkflowSubmit} />
        )}

        {currentStep === 2 && analysis && (
          <ComponentSuggester
            analysis={analysis}
            onAccept={handleSuggestionsAccept}
            onBack={() => onMCPStateChange({ ...mcpState, currentStep: 1 })}
          />
        )}

        {currentStep === 3 && (
          <MCPVisualBuilder
            serverConfig={serverConfig}
            onComplete={handleConfigComplete}
            onBack={() => onMCPStateChange({ ...mcpState, currentStep: 2 })}
          />
        )}

        {currentStep === 4 && generatedCode && (
          <CodePreview
            generatedCode={generatedCode}
            serverConfig={serverConfig}
            onBack={() => onMCPStateChange({ ...mcpState, currentStep: 3 })}
            onStartOver={() => {
              onMCPStateChange({
                currentStep: 1,
                workflowDescription: '',
                analysis: null,
                serverConfig: {
                  server_name: '',
                  description: '',
                  transport_type: 'stdio',
                  tools: [],
                  resources: [],
                  prompts: []
                },
                generatedCode: null
              });
            }}
          />
        )}
      </StepContent>

      {/* Navigation Buttons */}
      {currentStep > 1 && currentStep < 4 && (
        <NavigationButtons>
          <NavButton onClick={handlePreviousStep}>
            ← Previous
          </NavButton>
        </NavigationButtons>
      )}

      {currentStep === 4 && (
        <NavigationButtons $justify="flex-end">
          <NavButton onClick={() => onMCPStateChange({ ...mcpState, currentStep: 3 })}>
            ← Edit Config
          </NavButton>
        </NavigationButtons>
      )}
    </ContentContainer>
  );
}
