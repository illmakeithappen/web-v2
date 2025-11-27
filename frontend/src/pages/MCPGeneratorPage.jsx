import React, { useState } from 'react';
import styled from 'styled-components';
import WorkflowDescriber from '../components/mcp/WorkflowDescriber';
import ComponentSuggester from '../components/mcp/ComponentSuggester';
import MCPVisualBuilder from '../components/mcp/MCPVisualBuilder';
import CodePreview from '../components/mcp/CodePreview';

// Main Container
const GeneratorContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 82px;
    left: 0;
    right: 0;
    height: 2rem;
    background: #faf9f7;
    z-index: 99;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    &::before {
      top: 72px;
    }
  }
`;

const GeneratorContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

// Header with Title and Actions
const GeneratorHeader = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  flex: 1;
  min-width: 250px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$primary ? '#FFA500' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid ${props => props.$primary ? '#FFA500' : 'var(--gitthub-black)'};
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#FF8C00' : 'var(--gitthub-black)'};
    color: white;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Tab Navigation
const TabNavigationContainer = styled.div`
  position: sticky;
  top: calc(82px + 2rem);
  z-index: 100;
  background: #DDDDDD;
  border: 1px solid black;
  border-radius: 4px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    top: calc(72px + 2rem);
  }
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Tab = styled.button`
  padding: 1rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: var(--gitthub-black);
  border: none;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }

  ${props => props.$completed && `
    &::after {
      content: '✓';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      color: #10B981;
      font-weight: 700;
      font-size: 1rem;
    }
  `}
`;

const TabNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: ${props => props.$active ? '#FFA500' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TabLabel = styled.span`
  font-size: 0.85rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

// Progress Bar
const ProgressBarContainer = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.05);
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #FFA500 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin-top: 0.5rem;
  text-align: center;
`;

// Tab Content
const TabContent = styled.div`
  min-height: 500px;
`;

function MCPGeneratorPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [serverConfig, setServerConfig] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    transport: 'stdio',
    tools: [],
    resources: [],
    prompts: [],
    dependencies: [],
    auth_requirements: {}
  });
  const [generatedCode, setGeneratedCode] = useState(null);

  const steps = [
    { id: 1, label: 'Describe Workflow', completed: workflowDescription !== '' },
    { id: 2, label: 'Review Suggestions', completed: analysis !== null },
    { id: 3, label: 'Configure Visually', completed: serverConfig.tools.length > 0 },
    { id: 4, label: 'Generate Code', completed: generatedCode !== null }
  ];

  // Calculate progress
  const completedCount = steps.filter(step => step.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const handleWorkflowSubmit = (description, analysisResult) => {
    setWorkflowDescription(description);
    setAnalysis(analysisResult);

    // Pre-populate serverConfig with analysis results
    setServerConfig({
      ...serverConfig,
      name: analysisResult.suggested_server_name,
      description: analysisResult.suggested_description,
      tools: analysisResult.suggested_tools || [],
      resources: analysisResult.suggested_resources || [],
      prompts: analysisResult.suggested_prompts || [],
      dependencies: analysisResult.suggested_dependencies || [],
      auth_requirements: analysisResult.suggested_auth || {}
    });

    setActiveStep(2);
  };

  const handleConfigUpdate = (updatedConfig) => {
    setServerConfig(updatedConfig);
  };

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
    setActiveStep(4);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? This will clear all progress.')) {
      setActiveStep(1);
      setWorkflowDescription('');
      setAnalysis(null);
      setServerConfig({
        name: '',
        description: '',
        version: '1.0.0',
        transport: 'stdio',
        tools: [],
        resources: [],
        prompts: [],
        dependencies: [],
        auth_requirements: {}
      });
      setGeneratedCode(null);
    }
  };

  const handleExport = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${serverConfig.name || 'mcp-server'}.js`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <GeneratorContainer>
      <GeneratorContent>
        {/* Header */}
        <GeneratorHeader>
          <HeaderLeft>
            <Title>MCP Server Generator</Title>
            <Subtitle>
              Describe your workflow → AI suggests building blocks → Configure visually → Download code
            </Subtitle>
          </HeaderLeft>
          <HeaderActions>
            <ActionButton onClick={handleReset} title="Clear all and start over">
              Reset
            </ActionButton>
            <ActionButton
              onClick={handleExport}
              $primary
              disabled={!generatedCode}
              title={generatedCode ? "Export generated server code" : "Generate code first"}
            >
              Export
            </ActionButton>
          </HeaderActions>
        </GeneratorHeader>

        {/* Tab Navigation */}
        <TabNavigationContainer>
          <TabList>
            {steps.map(step => (
              <Tab
                key={step.id}
                $active={activeStep === step.id}
                $completed={step.completed}
                onClick={() => setActiveStep(step.id)}
              >
                <TabNumber $active={activeStep === step.id}>{step.id}</TabNumber>
                <TabLabel>{step.label}</TabLabel>
              </Tab>
            ))}
          </TabList>
          <ProgressBarContainer>
            <ProgressBarTrack>
              <ProgressBarFill $progress={progress} />
            </ProgressBarTrack>
            <ProgressText>
              {completedCount} of {steps.length} steps completed
            </ProgressText>
          </ProgressBarContainer>
        </TabNavigationContainer>

        {/* Tab Content */}
        <TabContent>
          {activeStep === 1 && (
            <WorkflowDescriber
              onSubmit={handleWorkflowSubmit}
              initialDescription={workflowDescription}
            />
          )}

          {activeStep === 2 && (
            <ComponentSuggester
              analysis={analysis}
              serverConfig={serverConfig}
              onConfigUpdate={handleConfigUpdate}
              onNext={() => setActiveStep(3)}
              onBack={() => setActiveStep(1)}
            />
          )}

          {activeStep === 3 && (
            <MCPVisualBuilder
              serverConfig={serverConfig}
              onConfigUpdate={handleConfigUpdate}
              onGenerateCode={handleCodeGenerated}
              onBack={() => setActiveStep(2)}
            />
          )}

          {activeStep === 4 && (
            <CodePreview
              generatedCode={generatedCode}
              serverConfig={serverConfig}
              onBack={() => setActiveStep(3)}
              onReset={handleReset}
            />
          )}
        </TabContent>
      </GeneratorContent>
    </GeneratorContainer>
  );
}

export default MCPGeneratorPage;
