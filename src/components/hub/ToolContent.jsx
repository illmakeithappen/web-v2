import React, { useState } from 'react';
import styled from 'styled-components';
import { TOOL_CATEGORIES } from '../../data/tools';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
`;

const MainCard = styled.div`
  background: white;
  border: 1px solid #8d8d8d;
  border-radius: 8px;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  background: #f4f4f4;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  background: transparent;
  color: #161616;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #0f62fe;
  }
`;

const ToolTitle = styled.h1`
  font-size: 1.25rem;
  color: #161616;
  margin: 0;
  font-weight: 600;
  flex: 1;
  text-align: center;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  color: #161616;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #525252;
  line-height: 1.5;
`;

const CodeBlock = styled.pre`
  background: #f4f4f4;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  margin: 0;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CopyButton = styled.button`
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #525252;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.75rem;

  &:hover {
    background: #e0e0e0;
    border-color: #0f62fe;
    color: #0f62fe;
  }
`;

const MetadataRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #525252;
`;

const MetadataLabel = styled.span`
  font-weight: 500;
`;

const MetadataValue = styled.span`
  color: #161616;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.$category === 'llm') return '#ddf4ff';
    if (props.$category === 'vectordb') return '#e0f2fe';
    if (props.$category === 'framework') return '#f0fdf4';
    if (props.$category === 'mcp') return '#fef3c7';
    if (props.$category === 'deployment') return '#f3e8ff';
    if (props.$category === 'monitoring') return '#fee2e2';
    if (props.$category === 'database') return '#dbeafe';
    if (props.$category === 'platform') return '#fce7f3';
    return '#f6f8fa';
  }};
  color: ${props => {
    if (props.$category === 'llm') return '#0969da';
    if (props.$category === 'vectordb') return '#0284c7';
    if (props.$category === 'framework') return '#16a34a';
    if (props.$category === 'mcp') return '#ca8a04';
    if (props.$category === 'deployment') return '#9333ea';
    if (props.$category === 'monitoring') return '#dc2626';
    if (props.$category === 'database') return '#2563eb';
    if (props.$category === 'platform') return '#db2777';
    return '#57606a';
  }};
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ToolContent({ tool, onBack }) {
  const [copied, setCopied] = useState(false);

  // Copy content to clipboard
  const handleCopy = async () => {
    if (tool?.frontmatter_yaml) {
      try {
        await navigator.clipboard.writeText(tool.frontmatter_yaml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!tool) {
    return (
      <ContentContainer>
        <MainCard>
          <Header>
            <ToolTitle>No Tool Selected</ToolTitle>
          </Header>
        </MainCard>
      </ContentContainer>
    );
  }

  const categoryName = TOOL_CATEGORIES.find(cat => cat.id === tool.category)?.name || tool.category;

  return (
    <ContentContainer>
      <MainCard>
        {/* Header */}
        <Header>
          {onBack && (
            <BackButton onClick={onBack}>
              Back to Tools
            </BackButton>
          )}
          <ToolTitle>{tool.name}</ToolTitle>
          <div style={{ width: '100px' }} /> {/* Spacer for centering */}
        </Header>

        {/* Content Area */}
        <ContentArea>
          {/* Metadata */}
          <MetadataRow>
            <MetadataItem>
              <MetadataLabel>Category:</MetadataLabel>
              <CategoryBadge $category={tool.category}>{categoryName}</CategoryBadge>
            </MetadataItem>

            {tool.pricing && (
              <MetadataItem>
                <MetadataLabel>Pricing:</MetadataLabel>
                <MetadataValue>{tool.pricing}</MetadataValue>
              </MetadataItem>
            )}

            {tool.author && (
              <MetadataItem>
                <MetadataLabel>Author:</MetadataLabel>
                <MetadataValue>{tool.author}</MetadataValue>
              </MetadataItem>
            )}
          </MetadataRow>

          {/* Description */}
          {tool.description && (
            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{tool.description}</Description>
            </Section>
          )}

          {/* Frontmatter YAML */}
          {tool.frontmatter_yaml && (
            <Section>
              <SectionTitle>Frontmatter</SectionTitle>
              <CopyButton onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy YAML'}
              </CopyButton>
              <CodeBlock>{tool.frontmatter_yaml}</CodeBlock>
            </Section>
          )}
        </ContentArea>
      </MainCard>
    </ContentContainer>
  );
}
