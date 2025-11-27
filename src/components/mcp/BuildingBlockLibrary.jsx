import React, { useState } from 'react';
import styled from 'styled-components';

const LibraryContainer = styled.div`
  width: 300px;
  background: white;
  border-right: 2px solid var(--gitthub-black);
  overflow-y: auto;
  height: 100%;
`;

const LibraryHeader = styled.div`
  background: var(--gitthub-light-beige);
  border-bottom: 2px solid var(--gitthub-black);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const LibraryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const LibrarySubtitle = styled.p`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: 0.75rem;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  background: #F5F5F5;
`;

const CategoryTab = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-bottom: ${props => props.$active ? '2px solid #FFA500' : 'none'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const BlockList = styled.div`
  padding: 1rem;
`;

const BlockItem = styled.div`
  background: ${props => {
    if (props.$type === 'tool') return '#FFF9F0';
    if (props.$type === 'resource') return '#F0FDF4';
    return '#F5F3FF';
  }};
  border: 2px solid ${props => {
    if (props.$type === 'tool') return '#FFA500';
    if (props.$type === 'resource') return '#10B981';
    return '#8B5CF6';
  }};
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    cursor: grabbing;
  }
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const BlockIcon = styled.div`
  font-size: 1.2rem;
`;

const BlockName = styled.div`
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--gitthub-black);
  flex: 1;
`;

const BlockBadge = styled.div`
  background: ${props => {
    if (props.$type === 'tool') return '#FFA500';
    if (props.$type === 'resource') return '#10B981';
    return '#8B5CF6';
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BlockDescription = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  line-height: 1.3;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--gitthub-gray);
  font-size: 0.85rem;
`;

const BUILDING_BLOCKS = {
  tools: [
    { id: 'create', name: 'Create', operation_type: 'create', icon: '➕', description: 'Create new data entry' },
    { id: 'read', name: 'Read', operation_type: 'read', icon: '📖', description: 'Fetch/retrieve data' },
    { id: 'update', name: 'Update', operation_type: 'update', icon: '🔄', description: 'Modify existing data' },
    { id: 'delete', name: 'Delete', operation_type: 'delete', icon: '🗑️', description: 'Remove data entry' },
    { id: 'search', name: 'Search', operation_type: 'search', icon: '🔍', description: 'Search/query data' },
    { id: 'api_call', name: 'API Call', operation_type: 'api_call', icon: '🌐', description: 'Make HTTP request' },
    { id: 'calculate', name: 'Calculate', operation_type: 'calculate', icon: '🧮', description: 'Perform calculations' },
    { id: 'transform', name: 'Transform', operation_type: 'transform', icon: '🔀', description: 'Convert data format' },
  ],
  resources: [
    { id: 'static_list', name: 'Static List', resource_type: 'static', icon: '📋', description: 'Fixed list of items', uri: 'protocol://collection' },
    { id: 'item', name: 'Item by ID', resource_type: 'templated', icon: '📄', description: 'Single item access', uri: 'protocol://item/{id}' },
    { id: 'filtered', name: 'Filtered View', resource_type: 'templated', icon: '🔎', description: 'Filtered results', uri: 'protocol://items?filter={filter}' },
    { id: 'file', name: 'File Resource', resource_type: 'templated', icon: '📁', description: 'File content', uri: 'file://{path}' },
  ],
  prompts: [
    { id: 'single_step', name: 'Single Step', workflow_type: 'single_step', icon: '1️⃣', description: 'Simple one-step action' },
    { id: 'multi_step', name: 'Multi Step', workflow_type: 'multi_step', icon: '🔢', description: 'Complex workflow' },
    { id: 'interactive', name: 'Interactive', workflow_type: 'interactive', icon: '💬', description: 'Conversational flow' },
  ]
};

function BuildingBlockLibrary({ onDragStart }) {
  const [activeCategory, setActiveCategory] = useState('tools');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragStart = (event, block, type) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ block, type }));
    event.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(block, type);
    }
  };

  const filteredBlocks = BUILDING_BLOCKS[activeCategory].filter(block =>
    searchQuery === '' ||
    block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LibraryContainer>
      <LibraryHeader>
        <LibraryTitle>Building Blocks</LibraryTitle>
        <LibrarySubtitle>Drag blocks onto the canvas</LibrarySubtitle>
        <SearchInput
          type="text"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </LibraryHeader>

      <CategoryTabs>
        <CategoryTab
          $active={activeCategory === 'tools'}
          onClick={() => setActiveCategory('tools')}
        >
          🔧 Tools
        </CategoryTab>
        <CategoryTab
          $active={activeCategory === 'resources'}
          onClick={() => setActiveCategory('resources')}
        >
          📁 Resources
        </CategoryTab>
        <CategoryTab
          $active={activeCategory === 'prompts'}
          onClick={() => setActiveCategory('prompts')}
        >
          💬 Prompts
        </CategoryTab>
      </CategoryTabs>

      <BlockList>
        {filteredBlocks.length === 0 ? (
          <EmptyState>No blocks found</EmptyState>
        ) : (
          filteredBlocks.map(block => (
            <BlockItem
              key={block.id}
              $type={activeCategory.slice(0, -1)}
              draggable
              onDragStart={(e) => handleDragStart(e, block, activeCategory.slice(0, -1))}
            >
              <BlockHeader>
                <BlockIcon>{block.icon}</BlockIcon>
                <BlockName>{block.name}</BlockName>
                <BlockBadge $type={activeCategory.slice(0, -1)}>
                  {block.operation_type || block.resource_type || block.workflow_type}
                </BlockBadge>
              </BlockHeader>
              <BlockDescription>{block.description}</BlockDescription>
            </BlockItem>
          ))
        )}
      </BlockList>
    </LibraryContainer>
  );
}

export default BuildingBlockLibrary;
