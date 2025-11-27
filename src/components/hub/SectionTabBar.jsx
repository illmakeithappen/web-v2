import React from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing, carbonTypography, carbonTransitions } from '../../styles/carbonTheme';

const TabBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  border-bottom: none;
  padding: ${carbonSpacing.spacing03};
  gap: ${carbonSpacing.spacing02};
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$active ? '#FFA500' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 4px;
  cursor: pointer;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: 0.8rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? '#2C2C2C' : '#666'};
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};
  text-align: left;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(255, 165, 0, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)'};

  &:hover {
    background: white;
    border-color: ${props => props.$active ? '#FFA500' : 'rgba(0, 0, 0, 0.25)'};
    color: #2C2C2C;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: 1px;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const TabIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const TabLabel = styled.span`
  flex: 1;
  white-space: nowrap;
`;

const TabCount = styled.span`
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
`;

const SectionTabBar = ({
  activeSection,
  onSectionChange,
  workflowCount = 0,
  skillCount = 0,
  mcpCount = 0,
  subagentCount = 0
}) => {
  const tabs = [
    { id: 'readme', label: 'README' },
    { id: 'workflows', label: 'Workflows', count: workflowCount },
    { id: 'skills', label: 'Skills', count: skillCount },
    { id: 'mcp', label: 'MCP', count: mcpCount },
    { id: 'subagents', label: 'Subagents', count: subagentCount },
  ];

  return (
    <TabBarContainer role="tablist" aria-label="Content sections">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          role="tab"
          aria-selected={activeSection === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={activeSection === tab.id ? 0 : -1}
          $active={activeSection === tab.id}
          onClick={() => onSectionChange(tab.id)}
        >
          {tab.icon && <TabIcon aria-hidden="true">{tab.icon}</TabIcon>}
          <TabLabel>{tab.label}</TabLabel>
          {tab.count > 0 && <TabCount>({tab.count})</TabCount>}
        </Tab>
      ))}
    </TabBarContainer>
  );
};

export default SectionTabBar;
