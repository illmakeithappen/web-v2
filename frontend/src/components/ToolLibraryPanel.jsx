import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { TOOLS_WITH_CAPABILITIES } from '../data/tools';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }

  &::placeholder {
    color: var(--gitthub-gray);
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${props => props.$active ? 'var(--gitthub-black)' : 'var(--gitthub-light-beige)'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid var(--gitthub-black);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'var(--gitthub-gray)' : 'var(--gitthub-beige)'};
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
`;

const ToolCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid ${props => props.$selected ? 'var(--gitthub-black)' : 'var(--gitthub-gray)'};
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$selected && `
    background: var(--gitthub-beige);
  `}
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ToolIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`;

const ToolBadge = styled.span`
  background: var(--gitthub-black);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ToolName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
`;

const ToolDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  min-height: 40px;
`;

const ToolTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const ToolTag = styled.span`
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ToolPricing = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--gitthub-gray);
`;

const SelectedCount = styled.div`
  padding: 0.75rem;
  background: var(--gitthub-beige);
  border-top: 2px solid var(--gitthub-black);
  font-weight: 600;
  text-align: center;
  color: var(--gitthub-black);
`;

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'llm', name: 'LLMs' },
  { id: 'vectordb', name: 'Vector DBs' },
  { id: 'framework', name: 'Frameworks' },
  { id: 'database', name: 'Databases' },
  { id: 'deployment', name: 'Deploy' },
  { id: 'monitoring', name: 'Monitor' },
  { id: 'platform', name: 'Platforms' }
];

const TOOL_ICONS = {
  llm: '🤖',
  vectordb: '🗄️',
  framework: '🔗',
  database: '💾',
  deployment: '🚀',
  monitoring: '📊',
  platform: '🌐'
};

function ToolLibraryPanel({ selectedTools = [], onToolSelect, onToolsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return TOOLS_WITH_CAPABILITIES.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleToolClick = (tool) => {
    const isSelected = selectedTools.some(t => t.id === tool.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedTools.filter(t => t.id !== tool.id);
    } else {
      newSelection = [...selectedTools, tool];
    }

    if (onToolsChange) {
      onToolsChange(newSelection);
    }
    if (onToolSelect) {
      onToolSelect(tool);
    }
  };

  const isToolSelected = (toolId) => {
    return selectedTools.some(t => t.id === toolId);
  };

  return (
    <PanelContainer>
      <div style={{ padding: '1rem', paddingBottom: 0 }}>
        <SearchInput
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <CategoryFilter>
          {CATEGORIES.map(category => (
            <CategoryButton
              key={category.id}
              $active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryFilter>
      </div>

      <div style={{ padding: '0 1rem 1rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ToolsGrid>
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              $selected={isToolSelected(tool.id)}
              onClick={() => handleToolClick(tool)}
            >
              <ToolHeader>
                <ToolIcon>{TOOL_ICONS[tool.category] || '🔧'}</ToolIcon>
                <ToolBadge>{tool.category}</ToolBadge>
              </ToolHeader>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.description}</ToolDescription>
              <ToolTags>
                {tool.tags.map(tag => (
                  <ToolTag key={tag}>{tag}</ToolTag>
                ))}
              </ToolTags>
              <ToolPricing>💰 {tool.pricing}</ToolPricing>
            </ToolCard>
          ))}
        </ToolsGrid>
      </div>

      {selectedTools.length > 0 && (
        <SelectedCount>
          {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
        </SelectedCount>
      )}
    </PanelContainer>
  );
}

export default ToolLibraryPanel;
