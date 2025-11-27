import React from 'react';
import styled, { css } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonComponents } from '../../styles/carbonTheme';

// ============================================================================
// TAG TYPES
// ============================================================================

const typeStyles = {
  // Regular tag (gray background)
  gray: css`
    background: ${carbonColors.layerAccent01};
    color: ${carbonColors.text01};
  `,

  // Cool gray variant
  'cool-gray': css`
    background: #dde1e6;
    color: ${carbonColors.text01};
  `,

  // Warm gray variant
  'warm-gray': css`
    background: #e5e0df;
    color: ${carbonColors.text01};
  `,

  // Red tag (error, danger)
  red: css`
    background: #ffd7d9;
    color: #750e13;
  `,

  // Magenta tag
  magenta: css`
    background: #ffd6e8;
    color: #740937;
  `,

  // Purple tag
  purple: css`
    background: #e8daff;
    color: #491d8b;
  `,

  // Blue tag (information)
  blue: css`
    background: #d0e2ff;
    color: #002d9c;
  `,

  // Cyan tag
  cyan: css`
    background: #bae6ff;
    color: #003a6d;
  `,

  // Teal tag
  teal: css`
    background: #9ef0f0;
    color: #004144;
  `,

  // Green tag (success)
  green: css`
    background: #a7f0ba;
    color: #0e6027;
  `,

  // High contrast
  'high-contrast': css`
    background: ${carbonColors.text01};
    color: ${carbonColors.text04};
  `,

  // Outline variant
  outline: css`
    background: transparent;
    color: ${carbonColors.text02};
    border: 1px solid ${carbonColors.borderSubtle01};
  `,
};

// ============================================================================
// SIZE VARIANTS
// ============================================================================

const sizeStyles = {
  sm: css`
    height: 18px;
    padding: 0 8px;
    font-size: 11px;
    line-height: 16px;
  `,
  md: css`
    height: 24px;
    padding: 0 10px;
    font-size: ${carbonTypography.fontSize.label01};
    line-height: 22px;
  `,
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const StyledTag = styled.span`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: ${carbonTypography.fontFamily.sans};
  font-weight: ${carbonTypography.fontWeight.regular};
  border-radius: 12px;
  white-space: nowrap;
  user-select: none;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  /* Apply size */
  ${props => sizeStyles[props.$size || 'md']}

  /* Apply type */
  ${props => typeStyles[props.$type || 'gray']}

  /* Filter tag (dismissible) */
  ${props => props.$filter && css`
    padding-right: 6px;
    cursor: default;
  `}

  /* Disabled state */
  ${props => props.$disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: currentColor;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  svg {
    width: 10px;
    height: 10px;
    fill: currentColor;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;

// Simple X icon for close button
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z" />
  </svg>
);

// ============================================================================
// CARBON TAG COMPONENT
// ============================================================================

export default function CarbonTag({
  children,
  type = 'gray',
  size = 'md',
  filter = false,
  disabled = false,
  icon = null,
  onClose,
  className,
  ...props
}) {
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose && !disabled) {
      onClose();
    }
  };

  return (
    <StyledTag
      $type={type}
      $size={size}
      $filter={filter}
      $disabled={disabled}
      className={className}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
      {filter && onClose && (
        <CloseButton
          onClick={handleClose}
          disabled={disabled}
          aria-label="Remove filter"
        >
          <CloseIcon />
        </CloseButton>
      )}
    </StyledTag>
  );
}

// ============================================================================
// DIFFICULTY BADGE COMPONENT (Specialized)
// ============================================================================

const getDifficultyStyle = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'green';
    case 'intermediate':
      return 'blue';
    case 'advanced':
      return 'purple';
    default:
      return 'gray';
  }
};

export function DifficultyBadge({ difficulty, size = 'sm', ...props }) {
  return (
    <CarbonTag
      type={getDifficultyStyle(difficulty)}
      size={size}
      {...props}
    >
      {difficulty}
    </CarbonTag>
  );
}

// ============================================================================
// FILTER CHIP COMPONENT (Specialized)
// ============================================================================

export function FilterChip({ label, value, onRemove, ...props }) {
  return (
    <CarbonTag
      type="blue"
      size="sm"
      filter
      onClose={onRemove}
      {...props}
    >
      <strong>{label}:</strong> {value}
    </CarbonTag>
  );
}
