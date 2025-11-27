import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonSpacing } from '../../styles/carbonTheme';
import CarbonButton from './CarbonButton';

// ============================================================================
// ANIMATIONS
// ============================================================================

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const BatchActionsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${carbonColors.interactive01};
  color: ${carbonColors.text04};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${carbonSpacing.spacing05};
  min-height: 48px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  animation: ${slideDown} ${carbonTransitions.duration.moderate01} ${carbonTransitions.easing.entrance};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${carbonSpacing.spacing03};
    align-items: stretch;
  }
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing05};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text04};

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SelectionCount = styled.span`
  font-size: ${carbonTypography.fontSize.bodyShort02};
  font-weight: ${carbonTypography.fontWeight.semibold};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
`;

const CancelButton = styled(CarbonButton)`
  background: transparent;
  color: ${carbonColors.text04};
  border: 1px solid ${carbonColors.text04};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ActionButton = styled(CarbonButton)`
  background: ${carbonColors.text04};
  color: ${carbonColors.interactive01};

  &:hover:not(:disabled) {
    background: ${carbonColors.layer01};
  }

  &:active:not(:disabled) {
    background: ${carbonColors.ui03};
  }
`;

// ============================================================================
// BATCH ACTIONS BAR COMPONENT
// ============================================================================

export default function BatchActionsBar({
  selectedCount = 0,
  totalCount = 0,
  onCancel,
  actions = [],
  className,
}) {
  if (selectedCount === 0) return null;

  return (
    <BatchActionsContainer className={className}>
      <SelectionInfo>
        <SelectionCount>{selectedCount}</SelectionCount>
        {selectedCount === 1 ? 'item selected' : 'items selected'}
      </SelectionInfo>

      <Actions>
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            kind="primary"
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            iconLeft={action.icon}
          >
            {action.label}
          </ActionButton>
        ))}

        <CancelButton
          kind="tertiary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </CancelButton>
      </Actions>
    </BatchActionsContainer>
  );
}
