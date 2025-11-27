import React, { useState } from 'react';
import styled from 'styled-components';
import { usePipeline } from '../../contexts/PipelineContext';

const Container = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: var(--gitthub-beige);
  border-bottom: 2px solid var(--gitthub-black);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  flex: 1;
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

const ExportButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ExportButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: ${props => props.$primary ? '#FFA500' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid ${props => props.$primary ? '#FFA500' : 'var(--gitthub-black)'};
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#FF8C00' : 'var(--gitthub-black)'};
    color: white;
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const SummarySection = styled.div`
  margin-bottom: 2rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
`;

const SummaryNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFA500;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PipelineFlow = styled.div`
  background: #f9f9f9;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const FlowStage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const StageIcon = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const StageLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gitthub-black);
  text-align: center;
`;

const StageCount = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
`;

const FlowArrow = styled.div`
  font-size: 2rem;
  color: var(--gitthub-gray);
  margin: 0 1rem;

  @media (max-width: 768px) {
    transform: rotate(90deg);
    margin: 1rem 0;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Item = styled.div`
  background: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemIcon = styled.div`
  font-size: 1.5rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
`;

const ItemDescription = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
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

const ExportPreview = styled.div`
  background: #1e1e1e;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  max-height: 400px;
  overflow: auto;
`;

const PreviewCode = styled.pre`
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export default function PipelineOverview() {
  const { pipeline, inputs, tools, outputs, metadata } = usePipeline();
  const [showPreview, setShowPreview] = useState(false);
  const [previewFormat, setPreviewFormat] = useState('json');

  const hasValidPipeline = inputs.length > 0 && outputs.length > 0;

  const handleExportJSON = () => {
    const { activeTab, ...exportData } = pipeline;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.name.replace(/\s+/g, '-').toLowerCase()}-pipeline.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportClaudeConfig = () => {
    const mcpServers = {};

    tools.forEach(tool => {
      const serverId = tool.toolId.replace('mcp-', '');
      mcpServers[serverId] = {
        command: 'npx',
        args: ['-y', `@modelcontextprotocol/server-${serverId}`]
      };
    });

    const config = {
      mcpServers
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claude_desktop_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const md = `# ${metadata.name}

${metadata.description || 'Claude Pipeline Configuration'}

## Overview

**Created:** ${new Date(metadata.createdAt).toLocaleDateString()}
**Last Updated:** ${new Date(metadata.updatedAt).toLocaleDateString()}

## Pipeline Summary

- **Inputs:** ${inputs.length}
- **Tools:** ${tools.length}
- **Outputs:** ${outputs.length}

## Input Sources

${inputs.map(input => `- **${input.name}** (${input.category})`).join('\n')}

## MCP Tools

${tools.length > 0 ? tools.map(tool => `- **${tool.name}**: ${tool.description}`).join('\n') : '*No tools configured*'}

## Output Formats

${outputs.map(output => `- **${output.name}** (${output.category})`).join('\n')}

## Setup Instructions

1. Install required MCP servers
2. Configure input sources
3. Set up output destinations
4. Run the pipeline

---

*Generated by gitthub.org Pipeline Builder*
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.name.replace(/\s+/g, '-').toLowerCase()}-pipeline.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewContent = () => {
    if (previewFormat === 'json') {
      const { activeTab, ...exportData } = pipeline;
      return JSON.stringify(exportData, null, 2);
    } else if (previewFormat === 'claude') {
      const mcpServers = {};
      tools.forEach(tool => {
        const serverId = tool.toolId.replace('mcp-', '');
        mcpServers[serverId] = {
          command: 'npx',
          args: ['-y', `@modelcontextprotocol/server-${serverId}`]
        };
      });
      return JSON.stringify({ mcpServers }, null, 2);
    }
    return '';
  };

  if (!hasValidPipeline) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Pipeline Overview</Title>
            <Description>Complete all required steps to see your pipeline summary</Description>
          </HeaderLeft>
        </Header>
        <Content>
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>Incomplete Pipeline</EmptyText>
            <EmptyHint>Add at least 1 input and 1 output to continue</EmptyHint>
          </EmptyState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Pipeline Overview</Title>
          <Description>Review your pipeline configuration and export</Description>
        </HeaderLeft>
        <ExportButtons>
          <ExportButton onClick={handleExportJSON} $primary>
            Export JSON
          </ExportButton>
          <ExportButton onClick={handleExportClaudeConfig}>
            Export Claude Config
          </ExportButton>
          <ExportButton onClick={handleExportMarkdown}>
            Export Markdown
          </ExportButton>
          <ExportButton onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide' : 'Show'} Preview
          </ExportButton>
        </ExportButtons>
      </Header>

      <Content>
        <SummarySection>
          <SummaryGrid>
            <SummaryCard>
              <SummaryNumber>{inputs.length}</SummaryNumber>
              <SummaryLabel>Inputs</SummaryLabel>
            </SummaryCard>
            <SummaryCard>
              <SummaryNumber>{tools.length}</SummaryNumber>
              <SummaryLabel>Tools</SummaryLabel>
            </SummaryCard>
            <SummaryCard>
              <SummaryNumber>{outputs.length}</SummaryNumber>
              <SummaryLabel>Outputs</SummaryLabel>
            </SummaryCard>
          </SummaryGrid>

          <PipelineFlow>
            <FlowStage>
              <StageIcon>📥</StageIcon>
              <StageLabel>Inputs</StageLabel>
              <StageCount>{inputs.length} sources</StageCount>
            </FlowStage>
            <FlowArrow>→</FlowArrow>
            <FlowStage>
              <StageIcon>🔧</StageIcon>
              <StageLabel>Claude + Tools</StageLabel>
              <StageCount>{tools.length} MCP servers</StageCount>
            </FlowStage>
            <FlowArrow>→</FlowArrow>
            <FlowStage>
              <StageIcon>📤</StageIcon>
              <StageLabel>Outputs</StageLabel>
              <StageCount>{outputs.length} formats</StageCount>
            </FlowStage>
          </PipelineFlow>
        </SummarySection>

        <DetailSection>
          <SectionTitle>Input Sources ({inputs.length})</SectionTitle>
          <ItemList>
            {inputs.map(input => (
              <Item key={input.id}>
                <ItemIcon>{input.icon}</ItemIcon>
                <ItemInfo>
                  <ItemName>{input.name}</ItemName>
                  <ItemDescription>Type: {input.type}</ItemDescription>
                </ItemInfo>
              </Item>
            ))}
          </ItemList>
        </DetailSection>

        {tools.length > 0 && (
          <DetailSection>
            <SectionTitle>MCP Tools ({tools.length})</SectionTitle>
            <ItemList>
              {tools.map(tool => (
                <Item key={tool.id}>
                  <ItemIcon>🔌</ItemIcon>
                  <ItemInfo>
                    <ItemName>{tool.name}</ItemName>
                    <ItemDescription>{tool.description}</ItemDescription>
                  </ItemInfo>
                </Item>
              ))}
            </ItemList>
          </DetailSection>
        )}

        <DetailSection>
          <SectionTitle>Output Formats ({outputs.length})</SectionTitle>
          <ItemList>
            {outputs.map(output => (
              <Item key={output.id}>
                <ItemIcon>{output.icon}</ItemIcon>
                <ItemInfo>
                  <ItemName>{output.name}</ItemName>
                  <ItemDescription>Type: {output.type}</ItemDescription>
                </ItemInfo>
              </Item>
            ))}
          </ItemList>
        </DetailSection>

        {showPreview && (
          <ExportPreview>
            <PreviewCode>{getPreviewContent()}</PreviewCode>
          </ExportPreview>
        )}
      </Content>
    </Container>
  );
}
