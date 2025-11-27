import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonTransitions } from '../../styles/carbonTheme';
import CarbonTableHeader from './CarbonTableHeader';
import CarbonTableRow from './CarbonTableRow';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const TableContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
  overflow: hidden;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${carbonColors.layer02};
  font-variant-numeric: tabular-nums;
`;

const TableBody = styled.tbody``;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${carbonColors.text02};
  min-height: 300px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: 0.5rem;
`;

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  color: ${carbonColors.text02};
  max-width: 400px;
`;

// ============================================================================
// CARBON TABLE COMPONENT
// ============================================================================

export default function CarbonTable({
  columns = [],
  data = [],
  selectable = false,
  expandable = false,
  sortConfig = { key: null, direction: null },
  onSort,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  expandedRows = new Set(),
  onRowExpand,
  onRowClick,
  renderExpanded,
  density = 'normal',
  emptyState = {
    icon: '📋',
    title: 'No data available',
    description: 'There are no items to display'
  },
  className,
}) {
  const [scrolled, setScrolled] = useState(false);
  const tableWrapperRef = useRef(null);

  // Handle scroll detection for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      if (tableWrapperRef.current) {
        setScrolled(tableWrapperRef.current.scrollTop > 0);
      }
    };

    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      return () => wrapper.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Check if all rows are selected
  const allSelected = data.length > 0 && selectedRows.size === data.length;

  const handleSelectAll = (e) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  const handleRowSelect = (rowData, rowIndex, checked) => {
    if (onRowSelect) {
      onRowSelect(rowData, rowIndex, checked);
    }
  };

  const handleRowExpand = (rowData, rowIndex, expanded) => {
    if (onRowExpand) {
      onRowExpand(rowData, rowIndex, expanded);
    }
  };

  // Show empty state if no data
  if (data.length === 0) {
    return (
      <TableContainer className={className}>
        <EmptyState>
          {emptyState.icon && <EmptyStateIcon>{emptyState.icon}</EmptyStateIcon>}
          {emptyState.title && <EmptyStateTitle>{emptyState.title}</EmptyStateTitle>}
          {emptyState.description && <EmptyStateText>{emptyState.description}</EmptyStateText>}
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer className={className}>
      <TableWrapper ref={tableWrapperRef}>
        <Table>
          <CarbonTableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={onSort}
            selectable={selectable}
            selectedAll={allSelected}
            onSelectAll={handleSelectAll}
            scrolled={scrolled}
          />
          <TableBody>
            {data.map((rowData, index) => (
              <CarbonTableRow
                key={rowData.id || index}
                rowData={rowData}
                rowIndex={index}
                columns={columns}
                selectable={selectable}
                expandable={expandable}
                selected={selectedRows.has(index)}
                expanded={expandedRows.has(index)}
                onSelect={handleRowSelect}
                onExpand={handleRowExpand}
                onClick={onRowClick}
                density={density}
                renderExpanded={renderExpanded}
              />
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
}
