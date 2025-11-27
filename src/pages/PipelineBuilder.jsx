import React from 'react';
import styled from 'styled-components';
import { PipelineProvider, usePipeline } from '../contexts/PipelineContext';
import InputSelector from '../components/pipeline/InputSelector';
import ToolSelector from '../components/pipeline/ToolSelector';
import OutputSelector from '../components/pipeline/OutputSelector';
import PipelineOverview from '../components/pipeline/PipelineOverview';

// Main Container
const BuilderContainer = styled.div`
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

const BuilderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

// Header with Title and Actions
const BuilderHeader = styled.div`
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

// Navigation Buttons
const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
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

// Pipeline Builder Component (wrapped with context)
function PipelineBuilderInner() {
  const {
    activeTab,
    setActiveTab,
    inputs,
    tools,
    outputs,
    metadata,
    setMetadata,
    resetPipeline,
    exportPipeline
  } = usePipeline();

  const tabs = [
    { id: 'inputs', number: 1, label: 'Inputs', completed: inputs.length > 0 },
    { id: 'tools', number: 2, label: 'Tools', completed: tools.length > 0 },
    { id: 'outputs', number: 3, label: 'Outputs', completed: outputs.length > 0 },
    { id: 'overview', number: 4, label: 'Overview', completed: false }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const currentTab = tabs[currentTabIndex];

  // Calculate progress
  const completedCount = tabs.filter(tab => tab.completed).length;
  const progress = (completedCount / (tabs.length - 1)) * 100; // Exclude overview from progress

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleExport = () => {
    const pipeline = exportPipeline();
    const blob = new Blob([JSON.stringify(pipeline, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.name.replace(/\s+/g, '-').toLowerCase()}-pipeline.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the pipeline? This will clear all inputs, tools, and outputs.')) {
      resetPipeline();
      setActiveTab('inputs');
    }
  };

  const isNextDisabled = () => {
    switch (activeTab) {
      case 'inputs':
        return inputs.length === 0;
      case 'tools':
        return false; // Tools are optional
      case 'outputs':
        return outputs.length === 0;
      default:
        return true;
    }
  };

  return (
    <BuilderContainer>
      <BuilderContent>
        {/* Header */}
        <BuilderHeader>
          <HeaderLeft>
            <Title>{metadata.name}</Title>
            <Subtitle>Design your Claude workflow: select inputs, tools, and outputs</Subtitle>
          </HeaderLeft>
          <HeaderActions>
            <ActionButton onClick={handleReset} title="Clear all and start over">
              Reset
            </ActionButton>
            <ActionButton onClick={handleExport} $primary disabled={inputs.length === 0 || outputs.length === 0}>
              Export Pipeline
            </ActionButton>
          </HeaderActions>
        </BuilderHeader>

        {/* Tab Navigation */}
        <TabNavigationContainer>
          <TabList>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                $active={activeTab === tab.id}
                $completed={tab.completed}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabNumber $active={activeTab === tab.id}>{tab.number}</TabNumber>
                <TabLabel>{tab.label}</TabLabel>
              </Tab>
            ))}
          </TabList>
          <ProgressBarContainer>
            <ProgressBarTrack>
              <ProgressBarFill $progress={progress} />
            </ProgressBarTrack>
            <ProgressText>
              {completedCount} of {tabs.length - 1} steps completed
            </ProgressText>
          </ProgressBarContainer>
        </TabNavigationContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'inputs' && <InputSelector />}
          {activeTab === 'tools' && <ToolSelector />}
          {activeTab === 'outputs' && <OutputSelector />}
          {activeTab === 'overview' && <PipelineOverview />}
        </TabContent>

        {/* Navigation Buttons (except on overview) */}
        {activeTab !== 'overview' && (
          <NavigationButtons>
            <NavButton onClick={handlePrevious} disabled={currentTabIndex === 0}>
              ← Previous
            </NavButton>
            <NavButton onClick={handleNext} $primary disabled={isNextDisabled()}>
              {currentTabIndex === tabs.length - 2 ? 'Review →' : 'Next →'}
            </NavButton>
          </NavigationButtons>
        )}
      </BuilderContent>
    </BuilderContainer>
  );
}

// Wrap with PipelineProvider
export default function PipelineBuilder() {
  return (
    <PipelineProvider>
      <PipelineBuilderInner />
    </PipelineProvider>
  );
}
