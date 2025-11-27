import React from 'react';
import styled, { css } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonComponents, carbonSpacing } from '../../styles/carbonTheme';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background: linear-gradient(to bottom, #f7f7f7, #ebebeb);
  z-index: 10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  ${props => props.$scrolled && css`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  `}
`;

const TableRow = styled.tr`
  height: 28px;
`;

const TableHeaderCell = styled.th`
  padding: 0 12px;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 11px;
  line-height: 28px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  background: transparent;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  user-select: none;
  position: relative;

  &:last-child {
    border-right: none;
  }

  /* Sortable column */
  ${props => props.$sortable && css`
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  `}

  /* Center alignment */
  ${props => props.$align === 'center' && css`
    text-align: center;
  `}

  /* Right alignment */
  ${props => props.$align === 'right' && css`
    text-align: right;
  `}

  /* Checkbox column */
  ${props => props.$checkbox && css`
    width: 40px;
    padding: 0 8px;
    text-align: center;
  `}
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;

  ${props => props.$sortable && css`
    cursor: pointer;
  `}
`;

const HeaderText = styled.span`
  flex: 1;
  text-transform: none;
`;

const SortIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$active ? 1 : 0};
  transition: opacity 0.15s ease;

  svg {
    width: 10px;
    height: 10px;
    fill: currentColor;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// ============================================================================
// ICONS
// ============================================================================

const SortAscIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <path d="M5 2L2 6h6L5 2z"/>
  </svg>
);

const SortDescIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <path d="M5 8L8 4H2l3 4z"/>
  </svg>
);

const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <path d="M5 2L2 6h6L5 2z" opacity="0"/>
  </svg>
);

// ============================================================================
// CARBON TABLE HEADER COMPONENT
// ============================================================================

export default function CarbonTableHeader({
  columns = [],
  sortConfig = { key: null, direction: null },
  onSort,
  selectable = false,
  selectedAll = false,
  onSelectAll,
  disabled = false,
  scrolled = false,
}) {
  const handleSort = (column) => {
    if (!column.sortable || disabled) return;

    let newDirection = 'asc';
    if (sortConfig.key === column.key) {
      // Toggle direction if same column
      if (sortConfig.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortConfig.direction === 'desc') {
        newDirection = null; // Clear sort
      }
    }

    if (onSort) {
      onSort({
        key: newDirection ? column.key : null,
        direction: newDirection
      });
    }
  };

  const getSortIndicator = (column) => {
    if (!column.sortable) return null;

    const isActive = sortConfig.key === column.key;
    const direction = isActive ? sortConfig.direction : null;

    return (
      <SortIndicator $active={isActive}>
        {direction === 'asc' && <SortAscIcon />}
        {direction === 'desc' && <SortDescIcon />}
        {!direction && <SortIcon />}
      </SortIndicator>
    );
  };

  return (
    <TableHead $scrolled={scrolled}>
      <TableRow>
        {selectable && (
          <TableHeaderCell $checkbox>
            <Checkbox
              checked={selectedAll}
              onChange={onSelectAll}
              disabled={disabled}
              aria-label="Select all rows"
            />
          </TableHeaderCell>
        )}

        {columns.map((column) => (
          <TableHeaderCell
            key={column.key}
            $sortable={column.sortable}
            $align={column.align}
            style={{ width: column.width }}
            onClick={() => handleSort(column)}
          >
            <HeaderContent $sortable={column.sortable}>
              <HeaderText>{column.header}</HeaderText>
              {getSortIndicator(column)}
            </HeaderContent>
          </TableHeaderCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
