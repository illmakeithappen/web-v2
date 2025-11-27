import React from 'react';
import styled from 'styled-components';
import { TOOLS_DATABASE, TOOL_CATEGORIES } from '../data/tools';

const BuildContainer = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
`;

const BuildHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 1.5rem;
  border-bottom: 2px solid var(--gitthub-black);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BuildTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
`;

const ClearButton = styled.button`
  background: white;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
`;

const BuildContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  padding: 2rem;
  border-right: 2px solid var(--gitthub-black);
  max-height: 600px;
  overflow-y: auto;

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: 2px solid var(--gitthub-black);
  }
`;

const RightColumn = styled.div`
  padding: 2rem;
  background: #faf9f7;
  max-height: 600px;
  overflow-y: auto;
`;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  input[type="checkbox"] {
    margin-top: 0.25rem;
    cursor: pointer;
  }
`;

const CheckboxLabel = styled.div`
  flex: 1;
`;

const CheckboxLabelText = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gitthub-black);
  margin-bottom: 0.125rem;
`;

const CheckboxDescription = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
`;

const AnalysisSection = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AnalysisTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
`;

const AnalysisText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--gitthub-black);
  margin: 0 0 0.75rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ToolsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ToolItem = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.75rem;
`;

const ToolName = styled.div`
  font-weight: 600;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const ToolMeta = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin-bottom: 0.25rem;
`;

const ToolCapabilities = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--gitthub-gray);
`;

const EmptyText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const EmptyHint = styled.p`
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
`;

// Capability categories
const CAPABILITY_CATEGORIES = {
  core_capabilities: {
    title: 'Core Capabilities',
    items: [
      { id: 'chat', label: 'Chat/Conversational Interface', description: 'Interactive dialogue with users' },
      { id: 'nlp', label: 'Natural Language Processing', description: 'Parse and understand text' },
      { id: 'code_generation', label: 'Code Generation', description: 'Generate programming code' },
      { id: 'document_processing', label: 'Document Processing', description: 'Handle PDFs, Word, text files' },
      { id: 'api_integration', label: 'API Integration', description: 'Connect with external services' }
    ]
  },
  ai_features: {
    title: 'AI Features',
    items: [
      { id: 'image_analysis', label: 'Image Analysis', description: 'Extract information from images' },
      { id: 'vector_search', label: 'Vector Search', description: 'Semantic similarity search' },
      { id: 'embeddings', label: 'Embeddings Generation', description: 'Create vector representations' },
      { id: 'streaming', label: 'Real-time Streaming', description: 'Stream responses in real-time' },
      { id: 'function_calling', label: 'Function Calling', description: 'Structured function execution' }
    ]
  },
  data_management: {
    title: 'Data Management',
    items: [
      { id: 'vector_storage', label: 'Vector Storage', description: 'Store embeddings and vectors' },
      { id: 'memory_management', label: 'Memory Management', description: 'Conversation history and context' },
      { id: 'caching', label: 'Caching Layer', description: 'Fast data access' },
      { id: 'real_time_sync', label: 'Real-time Sync', description: 'Keep data synchronized' }
    ]
  },
  infrastructure: {
    title: 'Infrastructure',
    items: [
      { id: 'workflow_orchestration', label: 'Workflow Orchestration', description: 'Multi-step automation' },
      { id: 'serverless', label: 'Serverless Functions', description: 'Event-driven compute' },
      { id: 'edge_computing', label: 'Edge Computing', description: 'Process at network edge' },
      { id: 'monitoring', label: 'Monitoring & Logging', description: 'Track system health' }
    ]
  }
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

function CapabilitiesBuilder({ selectedCapabilities, onToggleCapability, onClearAll }) {
  // Analyze matching tools
  const matchingTools = React.useMemo(() => {
    if (selectedCapabilities.length === 0) return [];

    return TOOLS_DATABASE.filter(tool => {
      if (!tool.capabilities) return false;
      // Check if tool has at least one of the selected capabilities
      return selectedCapabilities.some(cap => tool.capabilities.includes(cap));
    }).map(tool => {
      // Count matching capabilities
      const matches = selectedCapabilities.filter(cap =>
        tool.capabilities.includes(cap)
      );
      return { ...tool, matchCount: matches.length, matches };
    }).sort((a, b) => b.matchCount - a.matchCount); // Sort by match count
  }, [selectedCapabilities]);

  const handleClear = () => {
    onClearAll();
  };

  return (
    <BuildContainer>
      <BuildHeader>
        <BuildTitle>Application Requirements</BuildTitle>
        {selectedCapabilities.length > 0 && (
          <ClearButton onClick={handleClear}>
            Clear ({selectedCapabilities.length})
          </ClearButton>
        )}
      </BuildHeader>

      <BuildContent>
        {/* Left Column - Capabilities Selection */}
        <LeftColumn>
          <ColumnTitle>SELECT CAPABILITIES</ColumnTitle>

          {Object.entries(CAPABILITY_CATEGORIES).map(([categoryKey, category]) => (
            <CategorySection key={categoryKey}>
              <CategoryTitle>{category.title}</CategoryTitle>
              {category.items.map(item => (
                <CheckboxItem key={item.id}>
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={selectedCapabilities.includes(item.id)}
                    onChange={() => onToggleCapability(item.id)}
                  />
                  <CheckboxLabel htmlFor={item.id}>
                    <CheckboxLabelText>{item.label}</CheckboxLabelText>
                    <CheckboxDescription>{item.description}</CheckboxDescription>
                  </CheckboxLabel>
                </CheckboxItem>
              ))}
            </CategorySection>
          ))}
        </LeftColumn>

        {/* Right Column - Analysis */}
        <RightColumn>
          <ColumnTitle>APPLICATION ANALYSIS</ColumnTitle>

          {selectedCapabilities.length === 0 ? (
            <EmptyState>
              <EmptyText>No capabilities selected</EmptyText>
              <EmptyHint>Select capabilities to see matching tools and recommendations</EmptyHint>
            </EmptyState>
          ) : (
            <>
              <AnalysisSection>
                <AnalysisTitle>Requirements Summary</AnalysisTitle>
                <AnalysisText>
                  You have selected <strong>{selectedCapabilities.length}</strong> {selectedCapabilities.length === 1 ? 'capability' : 'capabilities'} for your application.
                </AnalysisText>
                <AnalysisText>
                  Based on your requirements, we found <strong>{matchingTools.length}</strong> {matchingTools.length === 1 ? 'tool' : 'tools'} that can support your needs.
                </AnalysisText>
              </AnalysisSection>

              {matchingTools.length > 0 && (
                <AnalysisSection>
                  <AnalysisTitle>Recommended Tools ({matchingTools.length})</AnalysisTitle>
                  <ToolsList>
                    {matchingTools.map(tool => (
                      <ToolItem key={tool.id}>
                        <ToolName>{tool.name}</ToolName>
                        <ToolMeta>
                          {getCategoryName(tool.category)} • {tool.matchCount} matching {tool.matchCount === 1 ? 'capability' : 'capabilities'}
                        </ToolMeta>
                        <ToolCapabilities>
                          Matches: {tool.matches.map(cap => cap.replace(/_/g, ' ')).join(', ')}
                        </ToolCapabilities>
                      </ToolItem>
                    ))}
                  </ToolsList>
                </AnalysisSection>
              )}
            </>
          )}
        </RightColumn>
      </BuildContent>
    </BuildContainer>
  );
}

export default CapabilitiesBuilder;
