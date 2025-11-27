import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import BrowseTools from '../components/BrowseTools';
import BuildStack from '../components/BuildStack';
import CapabilitiesBuilder from '../components/CapabilitiesBuilder';
import { TOOLS_DATABASE, TOOL_CATEGORIES } from '../data/tools';

// Main Container (matches DataBank)
const HubContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
  position: relative;

  /* White background cover for the gap between header and sticky nav */
  &::before {
    content: '';
    position: fixed;
    top: 82px; /* Header height + border */
    left: 0;
    right: 0;
    height: 2rem; /* Content padding */
    background: #faf9f7;
    z-index: 99;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    &::before {
      top: 72px;
    }
  }
`;

// Main Content Area
const HubContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

// Navigation Pane (exact copy from DataBank)
const NavigationPane = styled.div`
  position: sticky;
  top: calc(82px + 2rem); /* Header height (80px) + 2px border + content padding */
  z-index: 100;
  background: #DDDDDD;
  padding: 12px;
  border: 1px solid black;
  border-radius: 4px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  max-height: calc(100vh - 82px - 4rem);
  overflow-y: auto;

  @media (max-width: 768px) {
    top: calc(72px + 2rem); /* Header height (70px) + 2px border + content padding */
    max-height: calc(100vh - 72px - 4rem);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 8px;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: var(--gitthub-black);
  border: ${props => props.$active ? '1px solid black' : 'none'};
  border-bottom: ${props => props.$active ? 'none' : '1px solid transparent'};
  border-radius: ${props => props.$active ? '4px 4px 0 0' : '0'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  bottom: ${props => props.$active ? '-2px' : '0'};

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

// Filter Bar (only shown in Browse tab)
const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;

  &:focus {
    outline: none;
    border-color: black;
  }

  &::placeholder {
    color: var(--gitthub-gray);
  }
`;

const Select = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: black;
  }
`;

const ClearButton = styled.button`
  padding: 8px 16px;
  background: #FFA500;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #FF8C00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Stack Display Pane
const StackPane = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const StackHeader = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gitthub-black);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StackItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f0f0;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;
`;

const StackItemName = styled.span`
  font-weight: 600;
  color: var(--gitthub-black);
`;

const StackItemCategory = styled.span`
  color: var(--gitthub-gray);
  font-size: 0.8rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #FF0000;
  }
`;

// Overview sections for Build and Capabilities tabs
const OverviewSection = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const OverviewTitle = styled.div`
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--gitthub-black);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewColumn = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const OverviewColumnTitle = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--gitthub-black);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const OverviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
`;

const OverviewItem = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-black);
  padding: 4px 6px;
  background: white;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
`;

const OverviewItemName = styled.span`
  flex: 1;
  font-weight: 500;
`;

const OverviewItemMeta = styled.span`
  font-size: 0.7rem;
  color: var(--gitthub-gray);
`;

const OverviewText = styled.div`
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--gitthub-black);
  margin-bottom: 8px;
`;

const OverviewEmpty = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  text-align: center;
  padding: 12px;
  font-style: italic;
`;

function DesignPlayground() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);

  // Filter to only MCP servers
  const mcpServers = useMemo(() => {
    return TOOLS_DATABASE.filter(tool => tool.category === 'mcp');
  }, []);

  // Extract unique tags from MCP servers
  const allTags = useMemo(() => {
    const tags = new Set();
    mcpServers.forEach(tool => {
      tool.tags.forEach(tag => tags.add(tag));
    });
    return ['all', ...Array.from(tags).sort()];
  }, [mcpServers]);

  // Filter MCP servers based on search and filters
  const filteredTools = useMemo(() => {
    return mcpServers.filter(tool => {
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag === 'all' || tool.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag, mcpServers]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
  };

  // Toggle tool selection
  const toggleToolSelection = (tool) => {
    setSelectedTools(prev => {
      const isSelected = prev.some(t => t.id === tool.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  // Get category display name
  const getCategoryName = (categoryId) => {
    const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Toggle capability selection
  const toggleCapability = (capabilityId) => {
    setSelectedCapabilities(prev => {
      if (prev.includes(capabilityId)) {
        return prev.filter(id => id !== capabilityId);
      } else {
        return [...prev, capabilityId];
      }
    });
  };

  // Calculate matching tools for capabilities
  const matchingTools = useMemo(() => {
    if (selectedCapabilities.length === 0) return [];

    return TOOLS_DATABASE.filter(tool => {
      if (!tool.capabilities) return false;
      return selectedCapabilities.some(cap => tool.capabilities.includes(cap));
    }).map(tool => {
      const matches = selectedCapabilities.filter(cap =>
        tool.capabilities.includes(cap)
      );
      return { ...tool, matchCount: matches.length };
    }).sort((a, b) => b.matchCount - a.matchCount).slice(0, 10);
  }, [selectedCapabilities]);

  // Calculate stack capabilities
  const stackCapabilities = useMemo(() => {
    const caps = new Set();
    selectedTools.forEach(tool => {
      if (tool.capabilities) {
        tool.capabilities.forEach(cap => caps.add(cap));
      }
    });
    return Array.from(caps);
  }, [selectedTools]);

  return (
    <HubContainer>
      <HubContent>
        <NavigationPane>
          <TabsContainer>
            <Tab
              $active={activeTab === 'browse'}
              onClick={() => setActiveTab('browse')}
            >
              Browse MCP Servers
            </Tab>
            <Tab
              $active={activeTab === 'build'}
              onClick={() => setActiveTab('build')}
            >
              Claude + MCP
            </Tab>
          </TabsContainer>

          {/* Filter Bar - only shown in Browse tab */}
          {activeTab === 'browse' && (
            <>
              <FilterBar>
                <SearchInput
                  type="text"
                  placeholder="Search MCP servers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="all">All Tags</option>
                  {allTags.filter(tag => tag !== 'all').map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </Select>

                {(searchQuery || selectedTag !== 'all') && (
                  <ClearButton onClick={handleClearFilters}>
                    Clear
                  </ClearButton>
                )}
              </FilterBar>

              {/* Stack Display - show selected MCP servers */}
              {selectedTools.length > 0 && (
                <StackPane>
                  <StackHeader>
                    Selected MCP Servers ({selectedTools.length})
                  </StackHeader>
                  <StackItemsContainer>
                    {selectedTools.map(tool => (
                      <StackItem key={tool.id}>
                        <div>
                          <StackItemName>{tool.name}</StackItemName>
                        </div>
                        <RemoveButton
                          onClick={() => toggleToolSelection(tool)}
                          title="Remove"
                        >
                          ×
                        </RemoveButton>
                      </StackItem>
                    ))}
                  </StackItemsContainer>
                </StackPane>
              )}
            </>
          )}

          {/* Build Tab Overview */}
          {activeTab === 'build' && (
            <OverviewSection>
              <OverviewTitle>Claude Enhanced with MCP ({selectedTools.length} servers)</OverviewTitle>
              {selectedTools.length > 0 ? (
                <OverviewGrid>
                  <OverviewColumn>
                    <OverviewColumnTitle>MCP Servers Enabled</OverviewColumnTitle>
                    <OverviewList>
                      {selectedTools.map(tool => (
                        <OverviewItem key={tool.id}>
                          <OverviewItemName>{tool.name}</OverviewItemName>
                        </OverviewItem>
                      ))}
                    </OverviewList>
                  </OverviewColumn>
                  <OverviewColumn>
                    <OverviewColumnTitle>Claude's New Powers ({stackCapabilities.length})</OverviewColumnTitle>
                    <OverviewList>
                      {stackCapabilities.map(cap => (
                        <OverviewItem key={cap}>
                          <OverviewItemName>{cap.replace(/_/g, ' ')}</OverviewItemName>
                        </OverviewItem>
                      ))}
                    </OverviewList>
                  </OverviewColumn>
                </OverviewGrid>
              ) : (
                <OverviewEmpty>No MCP servers selected. Browse and select servers to see what Claude can do.</OverviewEmpty>
              )}
            </OverviewSection>
          )}

        </NavigationPane>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <BrowseTools
            tools={filteredTools}
            selectedTools={selectedTools}
            onToggleTool={toggleToolSelection}
          />
        )}

        {activeTab === 'build' && (
          <BuildStack
            selectedTools={selectedTools}
            onRemoveTool={(tool) => toggleToolSelection(tool)}
            onClearAll={() => setSelectedTools([])}
          />
        )}
      </HubContent>
    </HubContainer>
  );
}

export default DesignPlayground;
