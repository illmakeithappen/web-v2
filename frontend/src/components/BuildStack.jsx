import React, { useMemo } from 'react';
import styled from 'styled-components';
import { TOOL_CATEGORIES } from '../data/tools';

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

const ExportButton = styled.button`
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

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: 2px solid var(--gitthub-black);
  }
`;

const RightColumn = styled.div`
  padding: 2rem;
  background: #faf9f7;
`;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const ToolItemInfo = styled.div`
  flex: 1;
`;

const ToolItemName = styled.div`
  font-weight: 600;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const ToolItemMeta = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #DC2626;
  }
`;

const SummaryText = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  line-height: 1.7;
  font-size: 0.95rem;
  color: var(--gitthub-black);
`;

const SummaryParagraph = styled.p`
  margin: 0 0 1rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CapabilitiesList = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;

  li {
    margin-bottom: 0.5rem;
    color: var(--gitthub-black);
  }
`;

const ClearButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: white;
  color: var(--gitthub-black);
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: var(--gitthub-black);
  }
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

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

function BuildStack({ selectedTools, onRemoveTool, onClearAll }) {
  // Analyze capabilities and generate summary
  const analysis = useMemo(() => {
    const capabilitiesSet = new Set();
    const toolsByCategory = {};

    selectedTools.forEach(tool => {
      // Collect capabilities
      if (tool.capabilities) {
        tool.capabilities.forEach(cap => capabilitiesSet.add(cap));
      }

      // Group by category
      if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
      }
      toolsByCategory[tool.category].push(tool);
    });

    return {
      capabilities: Array.from(capabilitiesSet),
      toolsByCategory
    };
  }, [selectedTools]);

  // Generate capability summary text
  const generateSummary = () => {
    if (selectedTools.length === 0) return '';

    const categories = Object.keys(analysis.toolsByCategory);
    const capabilities = analysis.capabilities;

    const categoryDescriptions = {
      llm: 'foundational language models for natural language understanding and generation',
      vectordb: 'vector databases for efficient semantic search and similarity matching',
      framework: 'AI frameworks for building and orchestrating intelligent applications',
      mcp: 'MCP servers for extending AI capabilities with custom tools',
      deployment: 'deployment platforms for hosting and scaling your applications',
      monitoring: 'monitoring tools for tracking performance and usage',
      database: 'databases for persistent data storage',
      platform: 'AI platforms providing comprehensive development environments'
    };

    const capabilityDescriptions = {
      chat: 'conversational interfaces',
      nlp: 'natural language processing',
      code_generation: 'automated code generation',
      api_integration: 'seamless API integration',
      image_analysis: 'image understanding and analysis',
      document_processing: 'document parsing and analysis',
      vector_search: 'semantic search capabilities',
      memory_management: 'conversation history and context management',
      workflow_orchestration: 'multi-step workflow automation',
      function_calling: 'structured function execution',
      streaming: 'real-time response streaming',
      embeddings: 'text embedding generation'
    };

    return {
      categories,
      categoryDescriptions,
      capabilities,
      capabilityDescriptions
    };
  };

  const summary = generateSummary();

  // Export configuration
  const handleExport = () => {
    const config = {
      tools: selectedTools.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        capabilities: t.capabilities || []
      })),
      capabilities: analysis.capabilities,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-stack-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedTools.length === 0) {
    return (
      <BuildContainer>
        <BuildHeader>
          <BuildTitle>Claude Enhanced with MCP</BuildTitle>
        </BuildHeader>
        <BuildContent>
          <LeftColumn>
            <ColumnTitle>MCP SERVERS</ColumnTitle>
            <EmptyState>
              <EmptyText>No MCP servers selected</EmptyText>
              <EmptyHint>Browse available servers and add them to enhance Claude</EmptyHint>
            </EmptyState>
          </LeftColumn>
          <RightColumn>
            <ColumnTitle>CLAUDE'S ENHANCED CAPABILITIES</ColumnTitle>
            <EmptyState>
              <EmptyHint>Select MCP servers to see what Claude can do with them</EmptyHint>
            </EmptyState>
          </RightColumn>
        </BuildContent>
      </BuildContainer>
    );
  }

  return (
    <BuildContainer>
      <BuildHeader>
        <BuildTitle>Claude Enhanced with MCP</BuildTitle>
        <ExportButton onClick={handleExport}>Export</ExportButton>
      </BuildHeader>

      <BuildContent>
        {/* Left Column - Stack */}
        <LeftColumn>
          <ColumnTitle>MCP SERVERS</ColumnTitle>
          <ToolsList>
            {selectedTools.map(tool => (
              <ToolItem key={tool.id}>
                <ToolItemInfo>
                  <ToolItemName>{tool.name}</ToolItemName>
                  <ToolItemMeta>{tool.description}</ToolItemMeta>
                </ToolItemInfo>
                <RemoveButton onClick={() => onRemoveTool(tool)} title="Remove">
                  ×
                </RemoveButton>
              </ToolItem>
            ))}
          </ToolsList>
          <ClearButton onClick={onClearAll}>Clear All</ClearButton>
        </LeftColumn>

        {/* Right Column - Build Summary */}
        <RightColumn>
          <ColumnTitle>CLAUDE'S ENHANCED CAPABILITIES</ColumnTitle>
          <SummaryText>
            <SummaryParagraph>
              <strong>Claude is now equipped with {selectedTools.length} MCP {selectedTools.length === 1 ? 'server' : 'servers'}</strong>,
              extending its capabilities with specialized tools and integrations.
            </SummaryParagraph>

            {summary.capabilities && summary.capabilities.length > 0 && (
              <>
                <SummaryParagraph>
                  <strong>What Claude Can Now Do:</strong>
                </SummaryParagraph>
                <CapabilitiesList>
                  {summary.capabilities.slice(0, 12).map(capability => (
                    <li key={capability}>
                      {summary.capabilityDescriptions[capability] || capability.replace(/_/g, ' ')}
                    </li>
                  ))}
                  {summary.capabilities.length > 12 && (
                    <li>...and {summary.capabilities.length - 12} more capabilities</li>
                  )}
                </CapabilitiesList>
              </>
            )}

            <SummaryParagraph>
              With these MCP servers, Claude transforms from a conversational AI into a powerful assistant capable of {' '}
              {summary.capabilities?.includes('file_operations') && 'managing files, '}
              {summary.capabilities?.includes('web_search') && 'searching the web, '}
              {summary.capabilities?.includes('code_execution') && 'executing code, '}
              {summary.capabilities?.includes('database_access') && 'accessing databases, '}
              and performing specialized tasks tailored to your workflow.
            </SummaryParagraph>
          </SummaryText>
        </RightColumn>
      </BuildContent>
    </BuildContainer>
  );
}

export default BuildStack;
