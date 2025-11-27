import React from 'react';
import styled from 'styled-components';
import { usePipeline } from '../../contexts/PipelineContext';
import InputSelector from '../pipeline/InputSelector';
import ToolSelector from '../pipeline/ToolSelector';
import OutputSelector from '../pipeline/OutputSelector';
import PipelineOverview from '../pipeline/PipelineOverview';

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
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
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
 * PipelineBuilderInner - Content renderer for pipeline workflow
 * Navigation is handled by parent (SrcPage)
 */
export default function PipelineBuilderInner() {
  const {
    activeTab,
    setActiveTab,
    inputs,
    outputs
  } = usePipeline();

  const tabs = [
    { id: 'inputs', number: 1, label: 'Inputs' },
    { id: 'tools', number: 2, label: 'Tools' },
    { id: 'outputs', number: 3, label: 'Outputs' },
    { id: 'overview', number: 4, label: 'Overview' }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

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
    <ContentContainer>
      <StepContent>
        {activeTab === 'inputs' && <InputSelector />}
        {activeTab === 'tools' && <ToolSelector />}
        {activeTab === 'outputs' && <OutputSelector />}
        {activeTab === 'overview' && <PipelineOverview />}
      </StepContent>

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
    </ContentContainer>
  );
}
