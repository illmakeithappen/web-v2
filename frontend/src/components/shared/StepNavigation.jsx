import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StepItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: 2px solid ${props => props.$active ? 'var(--gitthub-black)' : 'transparent'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
    border-color: ${props => props.$active ? 'var(--gitthub-black)' : 'rgba(0, 0, 0, 0.15)'};
  }

  ${props => props.$completed && !props.$active && `
    &::after {
      content: '✓';
      position: absolute;
      top: 0.5rem;
      right: 0.75rem;
      color: #10B981;
      font-weight: 700;
      font-size: 1rem;
    }
  `}
`;

const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$active ? '#FFA500' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s ease;
`;

const StepLabel = styled.div`
  flex: 1;
  text-align: left;
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '700' : '600'};
  color: var(--gitthub-black);
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-top: 0.5rem;
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
  text-align: center;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
`;

/**
 * StepNavigation - Vertical step navigation component
 *
 * @param {Array} steps - Array of step objects with { id, number, label }
 * @param {string|number} activeStep - ID of the currently active step
 * @param {Function} onStepChange - Callback when a step is clicked
 * @param {Set|Array} completedSteps - Set or array of completed step IDs
 * @param {boolean} showProgress - Whether to show progress bar (default: true)
 * @param {number} progressPercentage - Manual progress percentage (optional, calculated if not provided)
 */
export default function StepNavigation({
  steps = [],
  activeStep,
  onStepChange,
  completedSteps = new Set(),
  showProgress = true,
  progressPercentage,
  showDivider = false
}) {
  // Ensure completedSteps is a Set for consistent checking
  const completedSet = completedSteps instanceof Set ? completedSteps : new Set(completedSteps);

  // Calculate progress if not manually provided
  const completedCount = steps.filter(step => completedSet.has(step.id)).length;
  const progress = progressPercentage !== undefined
    ? progressPercentage
    : (completedCount / steps.length) * 100;

  const handleStepClick = (step) => {
    if (onStepChange && !step.disabled) {
      onStepChange(step.id);
    }
  };

  return (
    <NavContainer>
      <StepList>
        {steps.map(step => (
          <StepItem
            key={step.id}
            $active={activeStep === step.id}
            $completed={completedSet.has(step.id)}
            disabled={step.disabled}
            onClick={() => handleStepClick(step)}
          >
            <StepNumber $active={activeStep === step.id}>
              {step.number || step.id}
            </StepNumber>
            <StepLabel $active={activeStep === step.id}>
              {step.label}
            </StepLabel>
          </StepItem>
        ))}
      </StepList>

      {showDivider && <Divider />}

      {showProgress && (
        <ProgressSection>
          <ProgressBarTrack>
            <ProgressBarFill $progress={progress} />
          </ProgressBarTrack>
          <ProgressText>
            {completedCount} of {steps.length} completed
          </ProgressText>
        </ProgressSection>
      )}
    </NavContainer>
  );
}
