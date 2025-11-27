import React from 'react';
import styled from 'styled-components';
import { carbonColors, carbonTypography, carbonSpacing, carbonTransitions } from '../../styles/carbonTheme';
import CarbonButton from './CarbonButton';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const FilterBarContainer = styled.div`
  background: ${carbonColors.layer01};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  overflow: hidden;
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: max-height ${carbonTransitions.duration.moderate02} ${carbonTransitions.easing.standard},
              opacity ${carbonTransitions.duration.moderate02} ${carbonTransitions.easing.standard};
`;

const FilterBarContent = styled.div`
  padding: ${carbonSpacing.spacing05};
  display: flex;
  align-items: flex-start;
  gap: ${carbonSpacing.spacing06};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing03};
  min-width: 180px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterGroupTitle = styled.h3`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  font-weight: ${carbonTypography.fontWeight.semibold};
  letter-spacing: ${carbonTypography.letterSpacing.label01};
  color: ${carbonColors.text02};
  text-transform: uppercase;
  margin: 0 0 ${carbonSpacing.spacing03} 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing03};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text01};
  cursor: pointer;
  padding: ${carbonSpacing.spacing02} ${carbonSpacing.spacing03};
  border-radius: 4px;
  transition: background ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${carbonColors.hoverUI};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: ${carbonColors.interactive01};

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 2px;
  }
`;

const OptionCount = styled.span`
  margin-left: auto;
  color: ${carbonColors.text02};
  font-size: ${carbonTypography.fontSize.label01};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing03};
  margin-left: auto;
  align-items: flex-start;
  padding-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding-top: 0;
  }
`;

// ============================================================================
// INLINE FILTER BAR COMPONENT
// ============================================================================

export default function InlineFilterBar({
  isOpen = false,
  filterGroups = [],
  selectedFilters = {},
  onFilterChange,
  onApply,
  onReset,
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
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <FilterBarContainer $isOpen={isOpen}>
      <FilterBarContent>
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
                    <OptionCount>({option.count})</OptionCount>
                  )}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </FilterGroup>
        ))}

        <ActionButtons>
          <CarbonButton
            kind="secondary"
            size="sm"
            onClick={handleReset}
          >
            Reset
          </CarbonButton>
          <CarbonButton
            kind="primary"
            size="sm"
            onClick={handleApply}
          >
            Apply
          </CarbonButton>
        </ActionButtons>
      </FilterBarContent>
    </FilterBarContainer>
  );
}
