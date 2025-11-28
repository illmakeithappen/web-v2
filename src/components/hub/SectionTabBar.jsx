import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing, carbonTypography, carbonTransitions } from '../../styles/carbonTheme';

const DropdownContainer = styled.div`
  position: relative;
  padding: ${carbonSpacing.spacing03};
`;

const SelectedSection = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1px solid #FFA500;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: 0.85rem;
  font-weight: 600;
  color: #2C2C2C;
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};
  box-shadow: 0 1px 3px rgba(255, 165, 0, 0.2);

  &:hover {
    background: #FFFAF5;
    box-shadow: 0 2px 6px rgba(255, 165, 0, 0.25);
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 1px;
  }
`;

const SectionLabel = styled.span`
  flex: 1;
  text-align: left;
`;

const SectionCount = styled.span`
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  margin-right: 8px;
`;

const DropdownArrow = styled.span`
  font-size: 10px;
  transition: transform 0.2s ease;
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownMenu = styled.div`
  position: fixed;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  opacity: ${props => props.$open ? 1 : 0};
  visibility: ${props => props.$open ? 'visible' : 'hidden'};
  transform: ${props => props.$open ? 'translateY(0)' : 'translateY(-8px)'};
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.$active ? '#FFF8F0' : 'transparent'};
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: 0.85rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? '#2C2C2C' : '#666'};
  text-align: left;
  transition: all 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.$active ? '#FFF8F0' : '#F5F5F5'};
    color: #2C2C2C;
  }

  &:focus {
    outline: none;
    background: #F0F0F0;
  }
`;

const ItemLabel = styled.span`
  flex: 1;
`;

const ItemCount = styled.span`
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
`;

const ActiveIndicator = styled.span`
  width: 6px;
  height: 6px;
  background: #FFA500;
  border-radius: 50%;
  margin-left: 8px;
`;

const SectionTabBar = ({
  activeSection,
  onSectionChange,
  workflowCount = 0,
  skillCount = 0,
  mcpCount = 0,
  subagentCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const tabs = [
    { id: 'readme', label: 'README' },
    { id: 'workflows', label: 'Workflows', count: workflowCount },
    { id: 'skills', label: 'Skills', count: skillCount },
    { id: 'mcp', label: 'MCP', count: mcpCount },
    { id: 'subagents', label: 'Subagents', count: subagentCount },
  ];

  const activeTab = tabs.find(tab => tab.id === activeSection) || tabs[0];

  // Update menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom - 4,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (tabId) => {
    onSectionChange(tabId);
    setIsOpen(false);
  };

  return (
    <DropdownContainer ref={containerRef}>
      <SelectedSection
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <SectionLabel>
          {activeTab.label}{activeTab.count > 0 ? ` (${activeTab.count})` : ''}
        </SectionLabel>
        <DropdownArrow $open={isOpen}>▼</DropdownArrow>
      </SelectedSection>

      <DropdownMenu
        $open={isOpen}
        role="listbox"
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width
        }}
      >
        {tabs.map((tab) => (
          <DropdownItem
            key={tab.id}
            role="option"
            aria-selected={activeSection === tab.id}
            $active={activeSection === tab.id}
            onClick={() => handleSelect(tab.id)}
          >
            <ItemLabel>
              {tab.label}{tab.count > 0 ? ` (${tab.count})` : ''}
            </ItemLabel>
            {activeSection === tab.id && <ActiveIndicator />}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default SectionTabBar;
