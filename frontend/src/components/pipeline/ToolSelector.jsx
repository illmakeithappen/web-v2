import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { usePipeline } from '../../contexts/PipelineContext';
import { TOOLS_DATABASE } from '../../data/tools';

const Container = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  min-height: 600px;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: var(--gitthub-beige);
  border-bottom: 2px solid var(--gitthub-black);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const Controls = styled.div`
  padding: 1rem 1.5rem;
  background: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const TagFilter = styled.select`
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const SelectedToolsBar = styled.div`
  background: #FFF8E8;
  border: 2px solid #FFA500;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SelectedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SelectedTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gitthub-black);
`;

const InfoText = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  font-style: italic;
`;

const ClearButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 0.85rem;
`;

const SelectedItemName = styled.span`
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  margin-left: 0.25rem;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #FF0000;
  }
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

const ToolCard = styled.div`
  background: white;
  border: 2px solid ${props => props.$selected ? '#FFA500' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.$selected ? '#FFA500' : 'var(--gitthub-black)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$selected && `
    background: #FFF8E8;
  `}
`;

const ToolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin: 0 0 0.25rem 0;
`;

const ToolDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const ToolTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
`;

const ToolTag = styled.span`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  color: var(--gitthub-gray);
  font-weight: 500;
`;

const ToolCapabilities = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
`;

const CapabilitiesLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CapabilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const Capability = styled.span`
  &::after {
    content: ' •';
  }

  &:last-child::after {
    content: '';
  }
`;

const AddButton = styled.button`
  width: 32px;
  height: 32px;
  background: ${props => props.$added ? '#10B981' : '#FFA500'};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gitthub-gray);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyHint = styled.div`
  font-size: 0.9rem;
`;

export default function ToolSelector() {
  const { tools, addTool, removeTool } = usePipeline();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Filter to only MCP servers
  const mcpServers = useMemo(() => {
    return TOOLS_DATABASE.filter(tool => tool.category === 'mcp');
  }, []);

  // Extract unique tags from MCP servers
  const allTags = useMemo(() => {
    const tags = new Set();
    mcpServers.forEach(tool => {
      if (tool.tags) {
        tool.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['all', ...Array.from(tags).sort()];
  }, [mcpServers]);

  // Filter MCP servers based on search and tag
  const filteredTools = useMemo(() => {
    return mcpServers.filter(tool => {
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag === 'all' || (tool.tags && tool.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag, mcpServers]);

  const isToolAdded = (toolId) => {
    return tools.some(tool => tool.toolId === toolId);
  };

  const handleToggleTool = (mcpTool) => {
    if (!isToolAdded(mcpTool.id)) {
      addTool({
        toolId: mcpTool.id,
        name: mcpTool.name,
        description: mcpTool.description,
        capabilities: mcpTool.capabilities || [],
        config: {}
      });
    } else {
      const toolToRemove = tools.find(tool => tool.toolId === mcpTool.id);
      if (toolToRemove) {
        removeTool(toolToRemove.id);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Select MCP Tools</Title>
        <Description>
          Choose MCP servers to enhance Claude's capabilities. Tools are optional but recommended.
        </Description>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search MCP servers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TagFilter value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="all">All Categories</option>
          {allTags.filter(tag => tag !== 'all').map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </TagFilter>
      </Controls>

      <Content>
        {tools.length > 0 && (
          <SelectedToolsBar>
            <SelectedHeader>
              <div>
                <SelectedTitle>Selected Tools ({tools.length})</SelectedTitle>
                <InfoText>These MCP servers will enhance Claude's capabilities</InfoText>
              </div>
              <ClearButton onClick={() => tools.forEach(tool => removeTool(tool.id))}>
                Clear All
              </ClearButton>
            </SelectedHeader>
            <SelectedList>
              {tools.map(tool => (
                <SelectedItem key={tool.id}>
                  <SelectedItemName>{tool.name}</SelectedItemName>
                  <RemoveButton onClick={() => removeTool(tool.id)}>×</RemoveButton>
                </SelectedItem>
              ))}
            </SelectedList>
          </SelectedToolsBar>
        )}

        {filteredTools.length > 0 ? (
          <ToolGrid>
            {filteredTools.map(mcpTool => {
              const added = isToolAdded(mcpTool.id);
              return (
                <ToolCard
                  key={mcpTool.id}
                  $selected={added}
                  onClick={() => handleToggleTool(mcpTool)}
                >
                  <ToolHeader>
                    <ToolInfo>
                      <ToolName>{mcpTool.name}</ToolName>
                    </ToolInfo>
                    <AddButton $added={added}>
                      {added ? '✓' : '+'}
                    </AddButton>
                  </ToolHeader>
                  <ToolDescription>{mcpTool.description}</ToolDescription>
                  {mcpTool.tags && mcpTool.tags.length > 0 && (
                    <ToolTags>
                      {mcpTool.tags.map((tag, idx) => (
                        <ToolTag key={idx}>{tag}</ToolTag>
                      ))}
                    </ToolTags>
                  )}
                  {mcpTool.capabilities && mcpTool.capabilities.length > 0 && (
                    <ToolCapabilities>
                      <CapabilitiesLabel>Capabilities:</CapabilitiesLabel>
                      <CapabilitiesList>
                        {mcpTool.capabilities.slice(0, 4).map((cap, idx) => (
                          <Capability key={idx}>
                            {cap.replace(/_/g, ' ')}
                          </Capability>
                        ))}
                        {mcpTool.capabilities.length > 4 && (
                          <Capability>+{mcpTool.capabilities.length - 4} more</Capability>
                        )}
                      </CapabilitiesList>
                    </ToolCapabilities>
                  )}
                </ToolCard>
              );
            })}
          </ToolGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>No tools found</EmptyText>
            <EmptyHint>Try adjusting your search or filter</EmptyHint>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
}
