import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { carbonColors, carbonTypography, carbonTransitions, carbonComponents, carbonSpacing } from '../../styles/carbonTheme';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const SearchContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  ${props => props.$size === 'sm' && css`
    min-width: 200px;
  `}

  ${props => props.$size === 'md' && css`
    min-width: 240px;
  `}

  ${props => props.$size === 'lg' && css`
    min-width: 320px;
  `}
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.borderStrong01};
  border-radius: 8px;
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};

  /* Size variants */
  height: ${props => {
    switch (props.$size) {
      case 'sm': return carbonComponents.input.height.sm;
      case 'lg': return carbonComponents.input.height.lg;
      default: return carbonComponents.input.height.md;
    }
  }};

  /* Hover state */
  &:hover {
    background: ${carbonColors.fieldHover};
  }

  /* Focus state */
  ${props => props.$focused && css`
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  `}

  /* Disabled state */
  ${props => props.$disabled && css`
    background: transparent;
    border-color: ${carbonColors.borderDisabled};
    cursor: not-allowed;
    opacity: 0.5;
  `}

  /* Expandable variant */
  ${props => props.$expandable && !props.$expanded && css`
    width: ${carbonComponents.input.height[props.$size || 'md']};
    cursor: pointer;
  `}

  ${props => props.$expandable && props.$expanded && css`
    width: 100%;
  `}
`;

const SearchIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${carbonComponents.input.height.md};
  height: 100%;
  color: ${props => props.$disabled ? carbonColors.iconDisabled : carbonColors.icon01};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 ${carbonSpacing.spacing05} 0 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  line-height: ${carbonTypography.lineHeight.bodyShort01};
  letter-spacing: ${carbonTypography.letterSpacing.bodyShort01};
  color: ${carbonColors.text01};

  &::placeholder {
    color: ${carbonColors.text03};
  }

  &:disabled {
    color: ${carbonColors.textDisabled};
    cursor: not-allowed;
  }

  /* Hide when expandable and not expanded */
  ${props => props.$expandable && !props.$expanded && css`
    width: 0;
    padding: 0;
    opacity: 0;
  `}
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${carbonComponents.input.height.md};
  height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  color: ${carbonColors.icon01};
  cursor: pointer;
  transition: all ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

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

const Label = styled.label`
  display: block;
  margin-bottom: ${carbonSpacing.spacing02};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  line-height: ${carbonTypography.lineHeight.label01};
  letter-spacing: ${carbonTypography.letterSpacing.label01};
  color: ${carbonColors.text02};
  font-weight: ${carbonTypography.fontWeight.regular};
`;

const HelperText = styled.div`
  margin-top: ${carbonSpacing.spacing02};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.helperText01};
  line-height: ${carbonTypography.lineHeight.helperText01};
  letter-spacing: ${carbonTypography.letterSpacing.helperText01};
  color: ${props => props.$invalid ? carbonColors.textError : carbonColors.text02};
`;

// ============================================================================
// ICONS
// ============================================================================

const SearchIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M15 14.3L10.7 10c1.1-1.1 1.8-2.7 1.8-4.4C12.5 2.5 9.9 0 6.7 0 3.6 0 1 2.5 1 5.6S3.6 11.3 6.7 11.3c1.7 0 3.2-.7 4.4-1.8l4.3 4.3.6-.5zM6.7 10.3c-2.6 0-4.7-2.1-4.7-4.7S4.1 1 6.7 1s4.7 2.1 4.7 4.7-2.1 4.6-4.7 4.6z" />
  </svg>
);

const CloseIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z" />
  </svg>
);

// ============================================================================
// CARBON SEARCH COMPONENT
// ============================================================================

export default function CarbonSearch({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search',
  label,
  helperText,
  invalid = false,
  disabled = false,
  size = 'md',
  fullWidth = false,
  expandable = false,
  autoFocus = false,
  className,
  id,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(!expandable || !!value);
  const inputRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('');
    }
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }

    // Keep focus on input after clear
    inputRef.current?.focus();

    // Collapse if expandable and empty
    if (expandable) {
      setExpanded(false);
    }
  };

  const handleExpand = () => {
    if (expandable && !expanded && !disabled) {
      setExpanded(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    // Collapse if expandable and empty
    if (expandable && !currentValue) {
      setExpanded(false);
    }
  };

  return (
    <SearchContainer $fullWidth={fullWidth} $size={size} className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <SearchWrapper
        $size={size}
        $focused={focused}
        $disabled={disabled}
        $expandable={expandable}
        $expanded={expanded}
        onClick={handleExpand}
      >
        <SearchIcon $disabled={disabled}>
          <SearchIconSVG />
        </SearchIcon>

        <SearchInput
          ref={inputRef}
          id={id}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          $expandable={expandable}
          $expanded={expanded}
          {...props}
        />

        {currentValue && !disabled && (
          <ClearButton
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <CloseIconSVG />
          </ClearButton>
        )}
      </SearchWrapper>

      {helperText && (
        <HelperText $invalid={invalid}>
          {helperText}
        </HelperText>
      )}
    </SearchContainer>
  );
}
