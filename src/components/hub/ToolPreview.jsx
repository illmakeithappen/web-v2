import React from 'react';
import styled from 'styled-components';
import { TOOL_CATEGORIES } from '../../data/tools';

const PreviewContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

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

const ToolHeader = styled.div`
  margin-bottom: 24px;
`;

const ToolTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #24292f;
`;

const MetadataRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #57606a;
`;

const MetadataLabel = styled.span`
  font-weight: 500;
`;

const MetadataValue = styled.span`
  color: #24292f;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
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

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #57606a;
  line-height: 1.5;
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: 16px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  color: #24292f;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  font-size: 12px;
  color: #57606a;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 24px;
`;

const EmptyText = styled.div`
  color: #57606a;
  font-size: 14px;
`;

export default function ToolPreview({ tool }) {
  if (!tool) {
    return (
      <PreviewContainer>
        <EmptyState>
          <EmptyText>Select a tool to view details</EmptyText>
        </EmptyState>
      </PreviewContainer>
    );
  }

  const categoryName = TOOL_CATEGORIES.find(cat => cat.id === tool.category)?.name || tool.category;

  return (
    <PreviewContainer>
      <PreviewContent>
        <ToolHeader>
          <ToolTitle>{tool.name}</ToolTitle>

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
          </MetadataRow>
        </ToolHeader>

        {tool.description && (
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{tool.description}</Description>
          </Section>
        )}

        {tool.frontmatter_yaml && (
          <Section>
            <SectionTitle>Frontmatter</SectionTitle>
            <CodeBlock>{tool.frontmatter_yaml}</CodeBlock>
          </Section>
        )}

        {tool.tags && tool.tags.length > 0 && (
          <Section>
            <SectionTitle>Tags</SectionTitle>
            <TagsContainer>
              {tool.tags.map((tag, idx) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
            </TagsContainer>
          </Section>
        )}
      </PreviewContent>
    </PreviewContainer>
  );
}
