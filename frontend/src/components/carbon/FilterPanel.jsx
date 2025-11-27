import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonSpacing } from '../../styles/carbonTheme';
import CarbonButton from './CarbonButton';

// ============================================================================
// ANIMATIONS
// ============================================================================

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const FilterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${carbonColors.overlay};
  z-index: ${props => props.$zIndex || 1000};
  opacity: ${props => props.$open ? 1 : 0};
  visibility: ${props => props.$open ? 'visible' : 'hidden'};
  transition: all ${carbonTransitions.duration.moderate02} ${carbonTransitions.easing.standard};
`;

const FilterPanelContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background: ${carbonColors.ui01};
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: ${props => (props.$zIndex || 1000) + 1};
  display: flex;
  flex-direction: column;
  transform: translateX(${props => props.$open ? '0' : '100%'});
  transition: transform ${carbonTransitions.duration.moderate02} ${carbonTransitions.easing.standard};

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const Header = styled.div`
  padding: ${carbonSpacing.spacing06} ${carbonSpacing.spacing05};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.heading03};
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text01};
  margin: 0;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${carbonColors.icon01};
  cursor: pointer;
  transition: background ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${carbonSpacing.spacing06} ${carbonSpacing.spacing05};
`;

const FilterGroup = styled.div`
  margin-bottom: ${carbonSpacing.spacing07};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroupTitle = styled.h3`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  font-weight: ${carbonTypography.fontWeight.semibold};
  letter-spacing: ${carbonTypography.letterSpacing.label01};
  color: ${carbonColors.text02};
  text-transform: uppercase;
  margin: 0 0 ${carbonSpacing.spacing04} 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing04};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text01};
  cursor: pointer;
  padding: ${carbonSpacing.spacing03};
  border-radius: 4px;
  transition: background ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${carbonColors.hoverUI};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: ${carbonColors.interactive01};

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 2px;
  }
`;

const Footer = styled.div`
  padding: ${carbonSpacing.spacing05};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  display: flex;
  gap: ${carbonSpacing.spacing03};
`;

// ============================================================================
// ICONS
// ============================================================================

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"/>
  </svg>
);

// ============================================================================
// FILTER PANEL COMPONENT
// ============================================================================

export default function FilterPanel({
  open = false,
  onClose,
  filterGroups = [],
  selectedFilters = {},
  onFilterChange,
  onApply,
  onReset,
  zIndex = 1000,
}) {
  const handleCheckboxChange = (groupKey, optionValue) => {
    if (!onFilterChange) return;

    const currentSelected = selectedFilters[groupKey] || [];
    const newSelected = currentSelected.includes(optionValue)
      ? currentSelected.filter(v => v !== optionValue)
      : [...currentSelected, optionValue];

    onFilterChange(groupKey, newSelected);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedFilters);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <>
      <FilterOverlay
        $open={open}
        $zIndex={zIndex}
        onClick={onClose}
      />
      <FilterPanelContainer $open={open} $zIndex={zIndex}>
        <Header>
          <Title>Filters</Title>
          <CloseButton onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </CloseButton>
        </Header>

        <Content>
          {filterGroups.map(group => (
            <FilterGroup key={group.key}>
              <FilterGroupTitle>{group.title}</FilterGroupTitle>
              <CheckboxGroup>
                {group.options.map(option => (
                  <CheckboxLabel key={option.value}>
                    <Checkbox
                      checked={(selectedFilters[group.key] || []).includes(option.value)}
                      onChange={() => handleCheckboxChange(group.key, option.value)}
                    />
                    {option.label}
                    {option.count !== undefined && (
                      <span style={{ marginLeft: 'auto', color: carbonColors.text02 }}>
                        ({option.count})
                      </span>
                    )}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FilterGroup>
          ))}
        </Content>

        <Footer>
          <CarbonButton
            kind="secondary"
            fullWidth
            onClick={handleReset}
          >
            Reset
          </CarbonButton>
          <CarbonButton
            kind="primary"
            fullWidth
            onClick={handleApply}
          >
            Apply
          </CarbonButton>
        </Footer>
      </FilterPanelContainer>
    </>
  );
}
