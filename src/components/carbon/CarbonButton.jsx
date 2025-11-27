import React from 'react';
import styled, { css } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonComponents } from '../../styles/carbonTheme';

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

const primaryStyles = css`
  background: ${carbonColors.interactive01};
  color: ${carbonColors.text04};
  border: none;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverPrimary};
  }

  &:active:not(:disabled) {
    background: #002d9c;
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 2px;
  }
`;

const secondaryStyles = css`
  background: ${carbonColors.interactive02};
  color: ${carbonColors.text04};
  border: none;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverSecondary};
  }

  &:active:not(:disabled) {
    background: #6f6f6f;
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 2px;
  }
`;

const tertiaryStyles = css`
  background: transparent;
  color: ${carbonColors.interactive01};
  border: 1px solid ${carbonColors.interactive01};

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.interactive01};
  }

  &:active:not(:disabled) {
    background: ${carbonColors.active};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const ghostStyles = css`
  background: transparent;
  color: ${carbonColors.link01};
  border: none;
  padding: 0 16px;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.link02};
  }

  &:active:not(:disabled) {
    background: ${carbonColors.active};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const dangerStyles = css`
  background: ${carbonColors.support01};
  color: ${carbonColors.text04};
  border: none;

  &:hover:not(:disabled) {
    background: #ba1b23;
  }

  &:active:not(:disabled) {
    background: #750e13;
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 2px;
  }
`;

const dangerTertiaryStyles = css`
  background: transparent;
  color: ${carbonColors.support01};
  border: 1px solid ${carbonColors.support01};

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.support01};
  }

  &:active:not(:disabled) {
    background: ${carbonColors.active};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const dangerGhostStyles = css`
  background: transparent;
  color: ${carbonColors.support01};
  border: none;
  padding: 0 16px;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.support01};
  }

  &:active:not(:disabled) {
    background: ${carbonColors.active};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

// ============================================================================
// SIZE VARIANTS
// ============================================================================

const sizeStyles = {
  sm: css`
    height: ${carbonComponents.button.height.sm};
    padding: ${carbonComponents.button.padding.sm};
    font-size: ${carbonTypography.fontSize.bodyShort01};
    line-height: ${carbonTypography.lineHeight.bodyShort01};
  `,
  md: css`
    height: ${carbonComponents.button.height.md};
    padding: ${carbonComponents.button.padding.sm};
    font-size: ${carbonTypography.fontSize.bodyShort01};
    line-height: ${carbonTypography.lineHeight.bodyShort01};
  `,
  lg: css`
    height: ${carbonComponents.button.height.lg};
    padding: ${carbonComponents.button.padding.sm};
    font-size: ${carbonTypography.fontSize.bodyShort02};
    line-height: ${carbonTypography.lineHeight.bodyShort02};
  `,
  xl: css`
    height: ${carbonComponents.button.height.xl};
    padding: ${carbonComponents.button.padding.sm};
    font-size: ${carbonTypography.fontSize.bodyShort02};
    line-height: ${carbonTypography.lineHeight.bodyShort02};
  `,
};

// ============================================================================
// STYLED BUTTON COMPONENT
// ============================================================================

const StyledButton = styled.button`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${carbonTypography.fontFamily.sans};
  font-weight: ${carbonTypography.fontWeight.regular};
  letter-spacing: ${carbonTypography.letterSpacing.bodyShort01};
  cursor: pointer;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};
  border-radius: 4px;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  outline: none;

  /* Apply size */
  ${props => sizeStyles[props.$size || 'md']}

  /* Apply variant */
  ${props => {
    if (props.$danger) {
      if (props.$kind === 'tertiary') return dangerTertiaryStyles;
      if (props.$kind === 'ghost') return dangerGhostStyles;
      return dangerStyles;
    }

    switch (props.$kind) {
      case 'secondary':
        return secondaryStyles;
      case 'tertiary':
        return tertiaryStyles;
      case 'ghost':
        return ghostStyles;
      case 'primary':
      default:
        return primaryStyles;
    }
  }}

  /* Disabled state */
  &:disabled {
    background: ${props => props.$kind === 'ghost' || props.$kind === 'tertiary' ? 'transparent' : carbonColors.ui03};
    color: ${props => props.$kind === 'ghost' || props.$kind === 'tertiary' ? carbonColors.textDisabled : carbonColors.textDisabled};
    border-color: ${props => props.$kind === 'tertiary' ? carbonColors.borderDisabled : 'transparent'};
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Icon-only button */
  ${props => props.$iconOnly && css`
    padding: 0;
    width: ${carbonComponents.button.height[props.$size || 'md']};
    min-width: ${carbonComponents.button.height[props.$size || 'md']};
  `}

  /* Full width */
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
`;

// ============================================================================
// ICON WRAPPER
// ============================================================================

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

// ============================================================================
// CARBON BUTTON COMPONENT
// ============================================================================

export default function CarbonButton({
  children,
  kind = 'primary',
  size = 'md',
  danger = false,
  disabled = false,
  iconOnly = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  onClick,
  type = 'button',
  className,
  ...props
}) {
  return (
    <StyledButton
      $kind={kind}
      $size={size}
      $danger={danger}
      $iconOnly={iconOnly}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
      {!iconOnly && children}
      {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
    </StyledButton>
  );
}
