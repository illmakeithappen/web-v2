import React from 'react';
import styled from 'styled-components';
import { carbonColors, carbonTypography, carbonSpacing } from '../../styles/carbonTheme';
import CarbonSearch from './CarbonSearch';
import CarbonButton from './CarbonButton';
import { FilterChip } from './CarbonTag';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ToolbarContainer = styled.div`
  background: ${carbonColors.ui01};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing04};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const MiddleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${carbonSpacing.spacing03};
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  flex-wrap: wrap;
`;

const ActiveFiltersLabel = styled.span`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  color: ${carbonColors.text02};
  font-weight: ${carbonTypography.fontWeight.semibold};
  text-transform: uppercase;
`;

const ItemCount = styled.div`
  display: flex;
  align-items: center;
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing04};
  background: ${carbonColors.layer01};
  border-radius: 16px;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};
  font-weight: ${carbonTypography.fontWeight.semibold};
  white-space: nowrap;
`;

const DensityButtonGroup = styled.div`
  display: inline-flex;
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.borderSubtle01};

  @media (max-width: 768px) {
    display: none;
  }
`;

const DensityButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.$active ? carbonColors.layer02 : 'transparent'};
  border: none;
  border-right: 1px solid ${props => props.$isLast ? 'transparent' : carbonColors.borderSubtle00};
  color: ${props => props.$active ? carbonColors.text01 : carbonColors.text02};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  font-weight: ${props => props.$active ? carbonTypography.fontWeight.semibold : carbonTypography.fontWeight.regular};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
    z-index: 1;
  }
`;

// ============================================================================
// ICONS
// ============================================================================

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M13.5 8.4l1.5-.4-.4-1.5-1.5.4c-.2-.5-.4-1-.7-1.4l1-1.2L12 2.8l-1 1.2c-.5-.3-1-.5-1.5-.7L9.6 2H8.4l-.1 1.5c-.5.1-1 .3-1.5.6L5.6 3 4.2 4.4l1.1 1.2c-.3.5-.5.9-.7 1.4l-1.5-.4-.4 1.5 1.5.4c.2.5.4 1 .7 1.4l-1.1 1.2 1.4 1.4 1.2-1.1c.5.3.9.5 1.4.7l-.4 1.5 1.5.4.4-1.5c.5-.2 1-.4 1.4-.7l1.2 1.1 1.4-1.4-1.1-1.2c.3-.5.5-.9.7-1.4zM9 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M0 0v3l6 8v5l4-2V11l6-8V0H0zm14 2.7L8.5 10H7.5L2 2.7V2h12v.7z"/>
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M13 7L12 8 9 5 9 16 7 16 7 5 4 8 3 7 8 2z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M13.9 5.1l-.8-.8C12.1 3.3 10.6 2.5 9 2.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5c2.3 0 4.3-1.4 5.1-3.5h-1.2C12.2 11.4 10.7 12.5 9 12.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.2 0 2.3.5 3.1 1.3l-2.1 2.1h5V1.4l-1.6 1.6z"/>
  </svg>
);

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${carbonColors.icon01};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.icon02};
  }

  &:active {
    background: ${carbonColors.active};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ============================================================================
// CARBON TOOLBAR COMPONENT
// ============================================================================

export default function CarbonToolbar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  itemCount = 0,
  itemLabel = 'items',
  showItemCount = true,
  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,
  onOpenFilters,
  onRefresh,
  refreshing = false,
  density = 'normal',
  onDensityChange,
  actions = [],
  showDensityControls = true,
  filtersExpanded = false,
  children,
}) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <ToolbarContainer>
      <ToolbarRow>
        <LeftSection>
          {/* Tab Switcher (first element - top left corner) */}
          {children}

          {/* Search Window (after tab switcher) */}
          <CarbonSearch
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            size="sm"
          />

          {showItemCount && (
            <ItemCount>
              {itemCount} {itemCount === 1 ? itemLabel.replace(/s$/, '') : itemLabel}
            </ItemCount>
          )}
        </LeftSection>

        <MiddleSection>
          {/* Empty - tabs moved to left */}
        </MiddleSection>

        <RightSection>
          {actions.map((action, index) => (
            <CarbonButton
              key={index}
              kind={action.kind || 'ghost'}
              size="sm"
              onClick={action.onClick}
              iconLeft={action.icon}
              disabled={action.disabled}
            >
              {action.label}
            </CarbonButton>
          ))}

          {/* Filter Toggle */}
          {onOpenFilters && (
            <CarbonButton
              kind={filtersExpanded ? 'secondary' : 'ghost'}
              size="sm"
              onClick={onOpenFilters}
              iconLeft={<FilterIcon />}
              aria-label={filtersExpanded ? 'Close filters' : 'Open filters'}
            />
          )}

          {/* Refresh Icon */}
          {onRefresh && (
            <RefreshButton
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon />
            </RefreshButton>
          )}

          {showDensityControls && onDensityChange && (
            <DensityButtonGroup>
              <DensityButton
                $active={density === 'compact'}
                onClick={() => onDensityChange('compact')}
                aria-label="Compact density"
                title="Compact"
              >
                ⊞
              </DensityButton>
              <DensityButton
                $active={density === 'normal'}
                onClick={() => onDensityChange('normal')}
                aria-label="Normal density"
                title="Normal"
              >
                ⊟
              </DensityButton>
              <DensityButton
                $active={density === 'tall'}
                $isLast
                onClick={() => onDensityChange('tall')}
                aria-label="Comfortable density"
                title="Comfortable"
              >
                ≣
              </DensityButton>
            </DensityButtonGroup>
          )}
        </RightSection>
      </ToolbarRow>

      {hasActiveFilters && (
        <FilterChipsRow>
          <ActiveFiltersLabel>Active filters:</ActiveFiltersLabel>
          {activeFilters.map((filter, index) => (
            <FilterChip
              key={index}
              label={filter.label}
              value={filter.value}
              onRemove={() => onRemoveFilter?.(filter)}
            />
          ))}
          {onClearAllFilters && (
            <CarbonButton
              kind="ghost"
              size="sm"
              onClick={onClearAllFilters}
            >
              Clear all
            </CarbonButton>
          )}
        </FilterChipsRow>
      )}
    </ToolbarContainer>
  );
}
