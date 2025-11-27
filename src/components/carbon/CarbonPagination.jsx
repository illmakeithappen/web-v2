import React from 'react';
import styled from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonSpacing } from '../../styles/carbonTheme';
import CarbonButton from './CarbonButton';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${carbonSpacing.spacing05};
  padding: ${carbonSpacing.spacing05};
  background: ${carbonColors.ui01};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  min-height: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${carbonSpacing.spacing03};
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing05};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  line-height: ${carbonTypography.lineHeight.bodyShort01};
  color: ${carbonColors.text02};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${carbonSpacing.spacing02};
    text-align: center;
  }
`;

const ItemsPerPageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Select = styled.select`
  height: 32px;
  padding: 0 32px 0 ${carbonSpacing.spacing05};
  background: ${carbonColors.field01};
  border: none;
  border-bottom: 1px solid ${carbonColors.borderStrong01};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  line-height: ${carbonTypography.lineHeight.bodyShort01};
  color: ${carbonColors.text01};
  cursor: pointer;
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};
  appearance: none;

  &:hover {
    background: ${carbonColors.fieldHover};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  &:disabled {
    background: transparent;
    border-bottom-color: ${carbonColors.borderDisabled};
    color: ${carbonColors.textDisabled};
    cursor: not-allowed;
  }
`;

const SelectIcon = styled.span`
  position: absolute;
  right: ${carbonSpacing.spacing05};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${carbonColors.icon01};

  svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;

const RangeText = styled.div`
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text01};
  white-space: nowrap;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};

  @media (max-width: 768px) {
    display: none;
  }
`;

const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: ${props => props.$active ? carbonColors.selected : 'transparent'};
  border: none;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  font-weight: ${props => props.$active ? carbonTypography.fontWeight.semibold : carbonTypography.fontWeight.regular};
  color: ${props => props.$active ? carbonColors.interactive01 : carbonColors.text01};
  cursor: pointer;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};
  border-radius: 0;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  &:disabled {
    color: ${carbonColors.textDisabled};
    cursor: not-allowed;
  }
`;

// ============================================================================
// ICONS
// ============================================================================

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M10 13L5 8 10 3 10.7 3.7 6.4 8 10.7 12.3z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path d="M6 3L11 8 6 13 5.3 12.3 9.6 8 5.3 3.7z" />
  </svg>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxVisible = 7; // Maximum number of page buttons to show

  if (totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
};

// ============================================================================
// CARBON PAGINATION COMPONENT
// ============================================================================

export default function CarbonPagination({
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
  disabled = false,
  showPageNumbers = true,
  className,
}) {
  const startItem = Math.min(((currentPage - 1) * itemsPerPage) + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <PaginationContainer className={className}>
      <PaginationInfo>
        <ItemsPerPageContainer>
          <span>Items per page:</span>
          <SelectWrapper>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={disabled}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <SelectIcon>
              <ChevronDownIcon />
            </SelectIcon>
          </SelectWrapper>
        </ItemsPerPageContainer>

        <RangeText>
          {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems} items` : '0 items'}
        </RangeText>
      </PaginationInfo>

      <PaginationControls>
        {showPageNumbers && (
          <PageNumbers>
            {pageNumbers.map((page, index) => (
              <PageButton
                key={`${page}-${index}`}
                $active={page === currentPage}
                disabled={disabled || page === '...'}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </PageButton>
            ))}
          </PageNumbers>
        )}

        <CarbonButton
          kind="ghost"
          size="sm"
          disabled={disabled || currentPage === 1}
          onClick={handlePrevious}
          iconLeft={<ChevronLeftIcon />}
          aria-label="Previous page"
        />

        <CarbonButton
          kind="ghost"
          size="sm"
          disabled={disabled || currentPage === totalPages || totalPages === 0}
          onClick={handleNext}
          iconLeft={<ChevronRightIcon />}
          aria-label="Next page"
        />
      </PaginationControls>
    </PaginationContainer>
  );
}
