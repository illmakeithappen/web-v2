import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing, carbonTypography, carbonTransitions, carbonShadows, carbonZIndex, carbonLayout } from '../../styles/carbonTheme';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${carbonColors.overlay};
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  z-index: ${carbonZIndex.modal};
  animation: fadeIn ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.entrance};

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PaletteContainer = styled.div`
  background: ${carbonColors.ui01};
  border-radius: ${carbonLayout.borderRadius.lg};
  box-shadow: ${carbonShadows.shadow}, 0 8px 32px rgba(0, 0, 0, 0.24);
  width: 100%;
  max-width: 560px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideDown ${carbonTransitions.duration.moderate01} ${carbonTransitions.easing.entrance};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${carbonSpacing.spacing05};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  gap: ${carbonSpacing.spacing03};
`;

const SearchIcon = styled.span`
  font-size: 18px;
  color: ${carbonColors.text02};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort02};
  color: ${carbonColors.text01};
  outline: none;

  &::placeholder {
    color: ${carbonColors.text03};
  }
`;

const ShortcutHint = styled.span`
  font-family: ${carbonTypography.fontFamily.mono};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  background: ${carbonColors.ui02};
  padding: 2px 6px;
  border-radius: ${carbonLayout.borderRadius.sm};
  border: 1px solid ${carbonColors.borderSubtle00};
`;

const ResultsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${carbonSpacing.spacing03} 0;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing05};
  cursor: pointer;
  gap: ${carbonSpacing.spacing04};
  background: ${props => props.$highlighted ? carbonColors.selected : 'transparent'};
  transition: background ${carbonTransitions.duration.fast01} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${props => props.$highlighted ? carbonColors.selectedHover : carbonColors.hoverUI};
  }
`;

const ItemIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text01};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDescription = styled.div`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text02};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  flex-shrink: 0;
`;

const Badge = styled.span`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.caption01};
  padding: 2px 8px;
  border-radius: 10px;
  background: ${props => {
    switch (props.$type) {
      case 'workflow': return '#e0f0ff';
      case 'skill': return '#e8f5e9';
      case 'tool': return '#fff3e0';
      default: return carbonColors.ui02;
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'workflow': return '#0f62fe';
      case 'skill': return '#16a34a';
      case 'tool': return '#d97706';
      default: return carbonColors.text02;
    }
  }};
`;

const Tag = styled.span`
  font-family: ${carbonTypography.fontFamily.mono};
  font-size: 10px;
  padding: 1px 4px;
  border-radius: ${carbonLayout.borderRadius.sm};
  background: ${carbonColors.ui02};
  color: ${carbonColors.text02};
`;

const NoResults = styled.div`
  padding: ${carbonSpacing.spacing06} ${carbonSpacing.spacing05};
  text-align: center;
  color: ${carbonColors.text02};
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${carbonSpacing.spacing05};
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing05};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  background: ${carbonColors.ui02};
`;

const FooterHint = styled.span`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Key = styled.kbd`
  font-family: ${carbonTypography.fontFamily.mono};
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  background: ${carbonColors.ui01};
  border: 1px solid ${carbonColors.borderSubtle00};
  box-shadow: 0 1px 0 ${carbonColors.borderSubtle00};
`;

// Simple fuzzy search implementation
const fuzzyMatch = (text, query) => {
  if (!query) return true;
  const searchLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Check if all characters in query appear in order in text
  let searchIndex = 0;
  for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      searchIndex++;
    }
  }
  return searchIndex === searchLower.length;
};

const CommandPalette = ({
  isOpen,
  onClose,
  items = [],
  activeSection = 'workflows',
  onSelect,
  placeholder = 'Search...'
}) => {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return items;

    return items.filter(item => {
      const searchableText = [
        item.name || '',
        item.description || '',
        ...(item.tags || []),
        item.type || ''
      ].join(' ');

      return fuzzyMatch(searchableText, query);
    });
  }, [items, query]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlightedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && filteredItems.length > 0) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, filteredItems.length]);

  // Reset highlight when filtered items change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredItems.length]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[highlightedIndex]) {
          onSelect(activeSection, filteredItems[highlightedIndex].id);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  const handleItemClick = (item) => {
    onSelect(activeSection, item.id);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getItemIcon = (item) => {
    if (item.icon) return item.icon;
    switch (activeSection) {
      case 'workflows': return '📋';
      case 'skills': return '📦';
      case 'tools': return '🔧';
      default: return '📄';
    }
  };

  const sectionLabels = {
    workflows: 'workflow',
    skills: 'skill',
    tools: 'tool'
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <PaletteContainer>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <ShortcutHint>esc</ShortcutHint>
        </SearchContainer>

        <ResultsList ref={listRef}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <ResultItem
                key={item.id}
                $highlighted={index === highlightedIndex}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <ItemIcon>{getItemIcon(item)}</ItemIcon>
                <ItemContent>
                  <ItemName>{item.name}</ItemName>
                  {item.description && (
                    <ItemDescription>{item.description}</ItemDescription>
                  )}
                </ItemContent>
                <ItemMeta>
                  {item.type && (
                    <Badge $type={sectionLabels[activeSection]}>
                      {item.type}
                    </Badge>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <Tag>{item.tags[0]}</Tag>
                  )}
                </ItemMeta>
              </ResultItem>
            ))
          ) : (
            <NoResults>
              No {sectionLabels[activeSection]}s found
              {query && ` matching "${query}"`}
            </NoResults>
          )}
        </ResultsList>

        <Footer>
          <FooterHint>
            <Key>↑</Key><Key>↓</Key> navigate
          </FooterHint>
          <FooterHint>
            <Key>↵</Key> select
          </FooterHint>
          <FooterHint>
            <Key>esc</Key> close
          </FooterHint>
        </Footer>
      </PaletteContainer>
    </Overlay>
  );
};

export default CommandPalette;
