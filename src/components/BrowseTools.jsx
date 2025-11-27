import React from 'react';
import styled from 'styled-components';
import { TOOL_CATEGORIES } from '../data/tools';

const BrowseContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const ToolCard = styled.div`
  background: white;
  border: 2px solid ${props => props.$selected ? 'var(--gitthub-black)' : '#ddd'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$selected && `
    background: var(--gitthub-light-beige);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `}
`;

const ToolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const ToolDescription = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  line-height: 1.5;
  margin: 0;
`;

const SelectionBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$selected ? 'var(--gitthub-black)' : '#f0f0f0'};
  color: ${props => props.$selected ? 'white' : 'var(--gitthub-gray)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.2s;
`;

const ToolTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CategoryBadge = styled.span`
  background: ${props => getCategoryColor(props.$category)};
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ToolFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
`;

const Pricing = styled.div`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  font-weight: 600;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gitthub-gray);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyHint = styled.p`
  font-size: 0.95rem;
  opacity: 0.7;
`;

// Helper function to get category color
const getCategoryColor = (category) => {
  const colors = {
    llm: '#3B82F6',
    vectordb: '#10B981',
    framework: '#8B5CF6',
    mcp: '#F59E0B',
    deployment: '#EF4444',
    monitoring: '#6366F1',
    database: '#EC4899',
    platform: '#14B8A6'
  };
  return colors[category] || '#666';
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

function BrowseTools({ tools, selectedTools, onToggleTool }) {
  const isToolSelected = (tool) => {
    return selectedTools.some(t => t.id === tool.id);
  };

  if (tools.length === 0) {
    return (
      <BrowseContainer>
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyText>No tools found</EmptyText>
          <EmptyHint>Try adjusting your search filters</EmptyHint>
        </EmptyState>
      </BrowseContainer>
    );
  }

  return (
    <BrowseContainer>
      {tools.map(tool => {
        const selected = isToolSelected(tool);
        return (
          <ToolCard
            key={tool.id}
            $selected={selected}
            onClick={() => onToggleTool(tool)}
          >
            <ToolHeader>
              <ToolInfo>
                <ToolName>{tool.name}</ToolName>
                <ToolDescription>{tool.description}</ToolDescription>
              </ToolInfo>
              <SelectionBadge $selected={selected}>
                {selected ? '✓' : '+'}
              </SelectionBadge>
            </ToolHeader>

            <ToolTags>
              {tool.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </ToolTags>

            <ToolFooter>
              <CategoryBadge $category={tool.category}>
                {getCategoryName(tool.category)}
              </CategoryBadge>
              <Pricing>{tool.pricing}</Pricing>
            </ToolFooter>
          </ToolCard>
        );
      })}
    </BrowseContainer>
  );
}

export default BrowseTools;
