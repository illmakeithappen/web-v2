import React, { useState } from 'react';
import styled from 'styled-components';
import SectionTabBar from './SectionTabBar';
import { carbonColors, carbonSpacing, carbonTypography, carbonTransitions } from '../../styles/carbonTheme';

const FileTree = styled.div`
  flex: 0 0 auto;
  background: transparent;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CommandPaletteTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  margin: ${carbonSpacing.spacing03};
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing04};
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.borderSubtle00};
  border-radius: 6px;
  cursor: pointer;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text03};
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${carbonColors.fieldHover};
    border-color: ${carbonColors.borderSubtle01};
    color: ${carbonColors.text02};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const TriggerIcon = styled.span`
  font-size: 14px;
`;

const TriggerText = styled.span`
  flex: 1;
  text-align: left;
`;

const TriggerShortcut = styled.span`
  font-family: ${carbonTypography.fontFamily.mono};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  background: ${carbonColors.ui02};
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid ${carbonColors.borderSubtle00};
`;

const FileTreeContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const FileTreeScrollableArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px 0 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const FileTreeList = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0 0 12px 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  min-height: 120px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const FileTreeItem = styled.li`
  margin: 0;
  padding: 0;
`;

const FileTreeFile = styled.div`
  ${props => !props.$singleLine && `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${props => props.$singleLine ? 'nowrap' : 'normal'};
  word-break: break-word;
  gap: 0.5rem;
  padding: ${props => props.$singleLine ? '4px 0' : '6px 0'};
  padding-left: ${props => props.$level > 0 ? `${props.$level * 15 + 10}px` : '10px'};
  padding-right: 10px;
  cursor: pointer;
  color: #2C2C2C;
  background: transparent;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  position: relative;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  margin: 0;
  line-height: 1.3;
  z-index: 1;

  /* Tree connector lines */
  ${props => props.$level > 0 && `
    &::before {
      content: '${props.$isLast ? '└──' : '├──'}';
      position: absolute;
      left: ${(props.$level - 1) * 10 + 2}px;
      top: ${props.$singleLine ? '50%' : '16px'};
      ${props.$singleLine ? 'transform: translateY(-50%);' : ''}
      color: #888;
      font-family: 'IBM Plex Mono', monospace;
      pointer-events: none;
      font-size: 0.85rem;
      letter-spacing: -0.05em;
      z-index: 2;
    }
  `}

  /* Background highlight behind text only using ::after */
  &::after {
    content: '';
    position: absolute;
    left: ${props => props.$level > 0 ? `${props.$level * 15 + 6}px` : '6px'};
    right: 10px;
    top: 2px;
    bottom: 2px;
    background: ${props => props.$active
      ? 'linear-gradient(to bottom, #e0f0ff, #d1e7ff)'
      : 'transparent'
    };
    border-radius: 4px;
    box-shadow: ${props => props.$active ? '1px 1px 0 rgba(0, 0, 0, 0.2)' : 'none'};
    z-index: -1;
    transition: all 0.2s ease;
  }

  &:hover::after {
    background: ${props => props.$active
      ? 'linear-gradient(to bottom, #d1e7ff, #c1d7ef)'
      : 'linear-gradient(to bottom, rgba(180, 210, 255, 0.3), rgba(160, 200, 255, 0.3))'
    };
  }
`;

const ListEmptyText = styled.div`
  padding: 12px 10px;
  color: #888;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  text-align: center;
`;

// Expanded workflow list components (shown on first visit)
const ExpandedWorkflowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  padding: 0 12px 12px 12px;
`;

const WorkflowSearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #FFA500;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`;

const WorkflowScrollList = styled.ul`
  flex: 1;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const WorkflowListItem = styled.li`
  padding: 8px 12px 10px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  color: #2C2C2C;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 165, 0, 0.1);
  }
`;

const WorkflowDate = styled.span`
  display: block;
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 2px;
`;

const WorkflowTitle = styled.span`
  display: block;
`;

const NoResultsText = styled.div`
  padding: 20px 12px;
  color: #888;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  text-align: center;
`;

// Helper to extract and format date from workflow ID
const formatWorkflowDate = (workflowId) => {
  // Match patterns like: workflow_20251120_011_... or 20251120_...
  const match = workflowId.match(/(?:workflow_)?(\d{4})(\d{2})(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return null;
};

export default function FileTreeNav({
  selectedSection,
  activeTab,
  onSectionChange,
  onOpenPalette,
  workflowEntries = [],
  skillEntries = [],
  mcpEntries = [],
  subagentEntries = [],
  availableWorkflows = [],
  availableSkills = [],
  availableMcp = [],
  availableSubagents = [],
  onItemSelectFromList,
}) {
  // Search state for expanded lists
  const [workflowSearchQuery, setWorkflowSearchQuery] = useState('');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [mcpSearchQuery, setMcpSearchQuery] = useState('');
  const [subagentSearchQuery, setSubagentSearchQuery] = useState('');
  // Get current entries based on section
  const getCurrentEntries = () => {
    switch (selectedSection) {
      case 'workflows': return workflowEntries;
      case 'skills': return skillEntries;
      case 'mcp': return mcpEntries;
      case 'subagents': return subagentEntries;
      default: return [];
    }
  };

  const currentEntries = getCurrentEntries();

  // Get section labels for display
  const sectionLabels = {
    readme: 'document',
    workflows: 'workflow',
    skills: 'skill',
    mcp: 'MCP server',
    subagents: 'subagent'
  };

  // README sub-items
  const readmeItems = [
    { id: 'welcome', name: 'welcome.md', icon: '📄' },
    { id: 'workflows', name: 'workflows.md', icon: '📋' },
    { id: 'skills', name: 'skills.md', icon: '📦' },
    { id: 'mcp', name: 'mcp.md', icon: '🔌' },
    { id: 'subagents', name: 'subagents.md', icon: '🤖' }
  ];

  // Detect if running on Mac for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <FileTree>
      {/* Section Tab Bar */}
      <SectionTabBar
        activeSection={selectedSection}
        onSectionChange={(section) => onSectionChange(section, null)}
        workflowCount={availableWorkflows.length}
        skillCount={availableSkills.length}
        mcpCount={availableMcp.length}
        subagentCount={availableSubagents.length}
      />


      <FileTreeContent>
        {/* Show list when no item selected, show single selected item when one is active */}
        {['workflows', 'skills', 'mcp', 'subagents'].includes(selectedSection) ? (
          activeTab ? (
            // Show only the selected workflow item
            <ExpandedWorkflowContainer>
              <WorkflowScrollList>
                {(() => {
                  const items = selectedSection === 'workflows' ? availableWorkflows
                    : selectedSection === 'skills' ? availableSkills
                    : selectedSection === 'mcp' ? availableMcp
                    : availableSubagents;
                  const selectedItem = items.find(item => item.id === activeTab);
                  if (!selectedItem) return null;

                  const dateStr = selectedSection === 'workflows' ? formatWorkflowDate(selectedItem.id) : null;
                  return (
                    <>
                      <WorkflowListItem
                        key="back"
                        onClick={() => onSectionChange(selectedSection, null)}
                        style={{
                          background: 'rgba(0, 0, 0, 0.03)',
                          color: '#666',
                          fontStyle: 'italic',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <WorkflowTitle>← All {sectionLabels[selectedSection]}s</WorkflowTitle>
                      </WorkflowListItem>
                      <WorkflowListItem
                        key={selectedItem.id}
                        style={{ background: 'rgba(255, 165, 0, 0.15)' }}
                      >
                        {dateStr && <WorkflowDate>{dateStr}</WorkflowDate>}
                        <WorkflowTitle>{selectedItem.name}</WorkflowTitle>
                      </WorkflowListItem>
                    </>
                  );
                })()}
              </WorkflowScrollList>
            </ExpandedWorkflowContainer>
          ) : (
            // Show full searchable list when no item selected
            <ExpandedWorkflowContainer>
              <WorkflowSearchInput
                type="text"
                placeholder={`Search ${sectionLabels[selectedSection]}s...`}
                value={
                  selectedSection === 'workflows' ? workflowSearchQuery :
                  selectedSection === 'skills' ? skillSearchQuery :
                  selectedSection === 'mcp' ? mcpSearchQuery :
                  subagentSearchQuery
                }
                onChange={(e) => {
                  if (selectedSection === 'workflows') setWorkflowSearchQuery(e.target.value);
                  else if (selectedSection === 'skills') setSkillSearchQuery(e.target.value);
                  else if (selectedSection === 'mcp') setMcpSearchQuery(e.target.value);
                  else setSubagentSearchQuery(e.target.value);
                }}
                autoFocus
              />
              <WorkflowScrollList>
                {(() => {
                  const items = selectedSection === 'workflows' ? availableWorkflows
                    : selectedSection === 'skills' ? availableSkills
                    : selectedSection === 'mcp' ? availableMcp
                    : availableSubagents;
                  const searchQuery = selectedSection === 'workflows' ? workflowSearchQuery
                    : selectedSection === 'skills' ? skillSearchQuery
                    : selectedSection === 'mcp' ? mcpSearchQuery
                    : subagentSearchQuery;
                  const filteredItems = items.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (filteredItems.length === 0) {
                    return <NoResultsText>No {sectionLabels[selectedSection]}s found</NoResultsText>;
                  }
                  return filteredItems.map(item => {
                    const dateStr = selectedSection === 'workflows' ? formatWorkflowDate(item.id) : null;
                    return (
                      <WorkflowListItem
                        key={item.id}
                        onClick={() => onItemSelectFromList(item.id)}
                      >
                        {dateStr && <WorkflowDate>{dateStr}</WorkflowDate>}
                        <WorkflowTitle>{item.name}</WorkflowTitle>
                      </WorkflowListItem>
                    );
                  });
                })()}
              </WorkflowScrollList>
            </ExpandedWorkflowContainer>
          )
        ) : (
          <FileTreeScrollableArea>
            {/* README section - show static sub-items */}
            {selectedSection === 'readme' && (
              <FileTreeList>
                {readmeItems.map((item, index) => (
                  <FileTreeItem key={item.id}>
                    <FileTreeFile
                      $active={activeTab === item.id}
                      $level={1}
                      $isLast={index === readmeItems.length - 1}
                      $singleLine={true}
                      onClick={() => onSectionChange('readme', item.id)}
                    >
                      {item.name}
                    </FileTreeFile>
                  </FileTreeItem>
                ))}
              </FileTreeList>
            )}

            {/* Show entries or empty state for other sections */}
            {selectedSection !== 'readme' && (
              <FileTreeList>
                {/* Back to list entry for workflows/skills/mcp/subagents */}
                {['workflows', 'skills', 'mcp', 'subagents'].includes(selectedSection) && activeTab && (
                  <FileTreeItem>
                    <FileTreeFile
                      $level={0}
                      $isLast={false}
                      $singleLine={true}
                      onClick={() => onSectionChange(selectedSection, null)}
                      style={{ color: '#666', fontStyle: 'italic' }}
                    >
                      ← All {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
                    </FileTreeFile>
                  </FileTreeItem>
                )}
                {currentEntries.length > 0 ? (
                  currentEntries.map((entry, index) => (
                    <FileTreeItem key={entry.id}>
                      <FileTreeFile
                        $active={activeTab === entry.id}
                        $level={1}
                        $isLast={index === currentEntries.length - 1}
                        $singleLine={true}
                        onClick={() => onSectionChange(selectedSection, entry.id)}
                      >
                        {entry.name}
                      </FileTreeFile>
                    </FileTreeItem>
                  ))
                ) : (
                  <>
                    <FileTreeItem>
                      <FileTreeFile
                        $level={1}
                        $isLast={false}
                        $singleLine={true}
                        onClick={onOpenPalette}
                      >
                        Select {sectionLabels[selectedSection]}
                      </FileTreeFile>
                    </FileTreeItem>
                    <FileTreeItem>
                      <FileTreeFile
                        $level={1}
                        $isLast={true}
                        $singleLine={true}
                        onClick={() => {
                          const uploadUrls = {
                            workflows: '/workflow-creation',
                            skills: '/skill-upload',
                            mcp: '/mcp-upload',
                            subagents: '/subagent-upload'
                          };
                          window.location.href = uploadUrls[selectedSection] || '/';
                        }}
                      >
                        Upload {sectionLabels[selectedSection]}
                      </FileTreeFile>
                    </FileTreeItem>
                  </>
                )}
              </FileTreeList>
            )}
          </FileTreeScrollableArea>
        )}
      </FileTreeContent>
    </FileTree>
  );
}

// Empty state styled components
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${carbonSpacing.spacing07} ${carbonSpacing.spacing05};
  text-align: center;
`;

const EmptyIcon = styled.span`
  font-size: 32px;
  margin-bottom: ${carbonSpacing.spacing03};
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};
  margin: 0 0 ${carbonSpacing.spacing03} 0;
`;

const EmptyHint = styled.p`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  margin: 0;

  kbd {
    font-family: ${carbonTypography.fontFamily.mono};
    background: ${carbonColors.ui02};
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid ${carbonColors.borderSubtle00};
  }
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  padding: ${carbonSpacing.spacing03} ${carbonSpacing.spacing04};
  margin-top: ${carbonSpacing.spacing03};
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.borderSubtle00};
  border-radius: 6px;
  cursor: pointer;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};
  transition: all ${carbonTransitions.duration.fast02} ${carbonTransitions.easing.standard};

  &:hover {
    background: ${carbonColors.fieldHover};
    border-color: ${carbonColors.borderSubtle01};
    color: ${carbonColors.text01};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }

  &:active {
    background: ${carbonColors.active};
  }
`;

const SelectShortcut = styled.span`
  font-family: ${carbonTypography.fontFamily.mono};
  font-size: ${carbonTypography.fontSize.caption01};
  color: ${carbonColors.text03};
  background: ${carbonColors.ui02};
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid ${carbonColors.borderSubtle00};
  margin-left: ${carbonSpacing.spacing02};
`;
