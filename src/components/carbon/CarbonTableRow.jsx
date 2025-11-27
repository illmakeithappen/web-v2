import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonComponents, carbonSpacing } from '../../styles/carbonTheme';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const TableRow = styled.tr`
  height: ${props => carbonComponents.dataTable.rowHeight[props.$density || 'normal']};
  background: ${props => {
    if (props.$selected) return carbonColors.selected;
    if (props.$index % 2 === 1) return carbonColors.layer01; // Zebra striping
    return carbonColors.layer02;
  }};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: background ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  /* Selected state - add blue left border */
  ${props => props.$selected && css`
    border-left: 3px solid ${carbonColors.interactive01};
  `}

  /* Hover state */
  &:hover {
    background: ${props => props.$selected ? carbonColors.selectedHover : carbonColors.hoverUI};
  }
`;

const TableCell = styled.td`
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing05};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  line-height: ${carbonTypography.lineHeight.bodyShort01};
  color: ${carbonColors.text01};
  vertical-align: middle;
  border-right: 1px solid ${carbonColors.borderSubtle00};

  &:last-child {
    border-right: none;
  }

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
    width: 48px;
    padding: 0;
    text-align: center;
  `}
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

const ExpandedRow = styled.tr`
  background: ${carbonColors.layer01};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
`;

const ExpandedCell = styled.td`
  padding: ${carbonSpacing.spacing06};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  animation: slideDown ${carbonTransitions.duration.moderate02} ${carbonTransitions.easing.entrance};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0 ${carbonSpacing.spacing03} 0 0;
  background: transparent;
  border: none;
  color: ${carbonColors.icon01};
  cursor: pointer;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};
  transform: rotate(${props => props.$expanded ? '90deg' : '0deg'});

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const CellContent = styled.div`
  display: flex;
  align-items: center;
`;

// ============================================================================
// ICONS
// ============================================================================

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M6 3L11 8 6 13 5.3 12.3 9.6 8 5.3 3.7z" />
  </svg>
);

// ============================================================================
// CARBON TABLE ROW COMPONENT
// ============================================================================

export default function CarbonTableRow({
  rowData,
  rowIndex,
  columns = [],
  selectable = false,
  expandable = false,
  selected = false,
  expanded = false,
  onSelect,
  onExpand,
  onClick,
  disabled = false,
  density = 'normal',
  renderExpanded,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const isControlledExpansion = onExpand !== undefined;
  const currentExpanded = isControlledExpansion ? expanded : isExpanded;

  const handleRowClick = (e) => {
    // Don't trigger row click if clicking on checkbox, expand button, or other interactive elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }

    if (onClick && !disabled) {
      onClick(rowData, rowIndex);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect && !disabled) {
      onSelect(rowData, rowIndex, e.target.checked);
    }
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    if (disabled) return;

    if (isControlledExpansion) {
      onExpand(rowData, rowIndex, !currentExpanded);
    } else {
      setIsExpanded(!currentExpanded);
    }
  };

  const renderCellContent = (column, value) => {
    if (column.render) {
      return column.render(value, rowData, rowIndex);
    }
    return value;
  };

  return (
    <>
      <TableRow
        $index={rowIndex}
        $selected={selected}
        $density={density}
        $clickable={!!onClick}
        onClick={handleRowClick}
      >
        {selectable && (
          <TableCell $checkbox>
            <Checkbox
              checked={selected}
              onChange={handleCheckboxChange}
              disabled={disabled}
              aria-label={`Select row ${rowIndex + 1}`}
            />
          </TableCell>
        )}

        {columns.map((column, colIndex) => (
          <TableCell
            key={column.key}
            $align={column.align}
            style={{ width: column.width }}
          >
            <CellContent>
              {colIndex === 0 && expandable && (
                <ExpandButton
                  $expanded={currentExpanded}
                  onClick={handleExpandClick}
                  disabled={disabled}
                  aria-label={currentExpanded ? 'Collapse row' : 'Expand row'}
                >
                  <ChevronRightIcon />
                </ExpandButton>
              )}
              {renderCellContent(column, rowData[column.key])}
            </CellContent>
          </TableCell>
        ))}
      </TableRow>

      {expandable && currentExpanded && renderExpanded && (
        <ExpandedRow>
          <ExpandedCell colSpan={columns.length + (selectable ? 1 : 0)}>
            {renderExpanded(rowData, rowIndex)}
          </ExpandedCell>
        </ExpandedRow>
      )}
    </>
  );
}
