import React from 'react';
import styled from 'styled-components';

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
  padding: 12px 16px;

  &::-webkit-scrollbar {
    width: 6px;
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

const Header = styled.div`
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  line-height: 1.3;
`;

const MetadataRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #57606a;
`;

const MetadataLabel = styled.span`
  font-weight: 500;
`;

const MetadataValue = styled.span`
  color: #24292f;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    if (props.$type === 'beginner') return '#ddf4ff';
    if (props.$type === 'intermediate') return '#fff8c5';
    if (props.$type === 'advanced') return '#ffebe9';
    if (props.$type === 'deploy') return '#ddf4ff';
    if (props.$type === 'educate') return '#f0fdf4';
    if (props.$type === 'navigate') return '#fff8c5';
    if (props.$type === 'framework') return '#f0fdf4';
    if (props.$type === 'llm') return '#ddf4ff';
    if (props.$type === 'tool') return '#fef3c7';
    return '#f6f8fa';
  }};
  color: ${props => {
    if (props.$type === 'beginner') return '#0969da';
    if (props.$type === 'intermediate') return '#9a6700';
    if (props.$type === 'advanced') return '#d1242f';
    if (props.$type === 'deploy') return '#0969da';
    if (props.$type === 'educate') return '#16a34a';
    if (props.$type === 'navigate') return '#9a6700';
    if (props.$type === 'framework') return '#16a34a';
    if (props.$type === 'llm') return '#0969da';
    if (props.$type === 'tool') return '#ca8a04';
    return '#57606a';
  }};
`;

const Section = styled.div`
  margin-bottom: 8px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 6px 0;
  font-size: 11px;
  font-weight: 600;
  color: #57606a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: #57606a;
  line-height: 1.5;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
`;

const StepBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 12px;
  color: #24292f;
  transition: all 0.2s ease;
  cursor: default;

  &:hover {
    background: #eaeef2;
    border-color: #0969da;
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: #0969da;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  padding: 0 4px;
`;

const StepName = styled.div`
  flex: 1;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  font-size: 11px;
  color: #57606a;
`;

const CapabilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
`;

const CapabilityItem = styled.div`
  padding: 4px 8px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 11px;
  color: #24292f;
  text-align: center;
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

// Workflow Preview Component
function WorkflowPreviewContent({ metadata }) {
  const displaySteps = metadata.steps && metadata.steps.length > 0
    ? metadata.steps
    : metadata.total_steps
      ? Array.from({ length: metadata.total_steps }, (_, i) => `Step ${i + 1}`)
      : [];

  return (
    <>
      <Header>
        <Title>Overview</Title>
        <MetadataRow>
          {metadata.type && <Badge $type={metadata.type}>{metadata.type}</Badge>}
          {metadata.difficulty && <Badge $type={metadata.difficulty}>{metadata.difficulty}</Badge>}
        </MetadataRow>
      </Header>

      {metadata.description && (
        <Section>
          <Description>{metadata.description}</Description>
        </Section>
      )}

      {metadata.agent && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Agent:</MetadataLabel>
            <MetadataValue>{metadata.agent}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {metadata.estimated_time && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Time:</MetadataLabel>
            <MetadataValue>{metadata.estimated_time}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {displaySteps.length > 0 && (
        <Section>
          <SectionTitle>Steps ({displaySteps.length})</SectionTitle>
          <StepsContainer>
            {displaySteps.map((step, idx) => (
              <StepBar key={idx}>
                <StepNumber>{idx + 1}</StepNumber>
                <StepName>{step}</StepName>
              </StepBar>
            ))}
          </StepsContainer>
        </Section>
      )}

      {metadata.tags && (Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).length > 0 && (
        <Section>
          <SectionTitle>Tags</SectionTitle>
          <TagsContainer>
            {(Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).map((tag, idx) => (
              <Tag key={idx}>{tag}</Tag>
            ))}
          </TagsContainer>
        </Section>
      )}
    </>
  );
}

// Skill Preview Component
function SkillPreviewContent({ metadata }) {
  return (
    <>
      <Header>
        <Title>Overview</Title>
        {metadata.difficulty && (
          <MetadataRow>
            <Badge $type={metadata.difficulty}>{metadata.difficulty}</Badge>
          </MetadataRow>
        )}
      </Header>

      {metadata.description && (
        <Section>
          <Description>{metadata.description}</Description>
        </Section>
      )}

      {metadata.skill_type && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Type:</MetadataLabel>
            <MetadataValue>{metadata.skill_type}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {metadata.created_by && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Created by:</MetadataLabel>
            <MetadataValue>{metadata.created_by}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {metadata.tags && (Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).length > 0 && (
        <Section>
          <SectionTitle>Tags</SectionTitle>
          <TagsContainer>
            {(Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).map((tag, idx) => (
              <Tag key={idx}>{tag}</Tag>
            ))}
          </TagsContainer>
        </Section>
      )}
    </>
  );
}

// Tool Preview Component
function ToolPreviewContent({ metadata }) {
  return (
    <>
      <Header>
        <Title>Overview</Title>
        <MetadataRow>
          {metadata.category && <Badge $type={metadata.category}>{metadata.category}</Badge>}
        </MetadataRow>
      </Header>

      {metadata.description && (
        <Section>
          <Description>{metadata.description}</Description>
        </Section>
      )}

      {metadata.pricing && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Pricing:</MetadataLabel>
            <MetadataValue>{metadata.pricing}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {metadata.language && (
        <Section>
          <MetadataItem>
            <MetadataLabel>Language:</MetadataLabel>
            <MetadataValue>{metadata.language}</MetadataValue>
          </MetadataItem>
        </Section>
      )}

      {metadata.capabilities && metadata.capabilities.length > 0 && (
        <Section>
          <SectionTitle>Capabilities</SectionTitle>
          <CapabilitiesGrid>
            {metadata.capabilities.map((capability, idx) => (
              <CapabilityItem key={idx}>{capability.replace(/_/g, ' ')}</CapabilityItem>
            ))}
          </CapabilitiesGrid>
        </Section>
      )}

      {metadata.compatibility && metadata.compatibility.length > 0 && (
        <Section>
          <SectionTitle>Compatible With</SectionTitle>
          <TagsContainer>
            {metadata.compatibility.map((item, idx) => (
              <Tag key={idx}>{item}</Tag>
            ))}
          </TagsContainer>
        </Section>
      )}

      {metadata.tags && (Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).length > 0 && (
        <Section>
          <SectionTitle>Tags</SectionTitle>
          <TagsContainer>
            {(Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags]).map((tag, idx) => (
              <Tag key={idx}>{tag}</Tag>
            ))}
          </TagsContainer>
        </Section>
      )}
    </>
  );
}

// README Preview Component
function ReadmePreviewContent({ content, section }) {
  // For welcome.md, extract and show "Getting Started" section
  if (section === 'welcome' && content) {
    const gettingStartedMatch = content.match(/## Getting started:?[\s\S]*?(?=\n## |$)/i)
    const gettingStartedContent = gettingStartedMatch
      ? gettingStartedMatch[0].replace(/^## Getting started:?\s*\n/i, '').trim()
      : content.substring(0, 300)

    return (
      <>
        <Header>
          <Title>Getting Started</Title>
        </Header>
        <Section>
          <Description>{gettingStartedContent.substring(0, 400)}...</Description>
        </Section>
      </>
    )
  }

  // For workflows, skills, tools - extract intro paragraphs as summary
  if (['workflows', 'skills', 'tools'].includes(section) && content) {
    // Extract content after title but before any subheadings (###)
    const afterTitle = content.replace(/^#[^#\n]*\n+/, '') // Remove main title
    const summaryMatch = afterTitle.match(/^[\s\S]*?(?=\n###|$)/) // Get content before first ###
    const summaryContent = summaryMatch ? summaryMatch[0].trim() : afterTitle.substring(0, 400)

    const sectionTitles = {
      workflows: 'Workflows',
      skills: 'Skills',
      tools: 'Tools'
    }

    return (
      <>
        <Header>
          <Title>{sectionTitles[section]} Summary</Title>
        </Header>
        <Section>
          <Description>{summaryContent.substring(0, 500)}...</Description>
        </Section>
      </>
    )
  }

  // Default for other README tabs
  return (
    <>
      <Header>
        <Title>README Overview</Title>
        <MetadataRow>
          <Badge $type="readme">{section}</Badge>
        </MetadataRow>
      </Header>

      {content && (
        <Section>
          <Description>{content.substring(0, 300)}...</Description>
        </Section>
      )}
    </>
  );
}

// Generic Preview Content (fallback)
function GenericPreviewContent({ metadata }) {
  return (
    <>
      <Header>
        <Title>{metadata.title || metadata.name || 'Preview'}</Title>
        {metadata.description && (
          <Description>{metadata.description}</Description>
        )}
      </Header>

      {Object.keys(metadata).length > 0 && (
        <Section>
          <SectionTitle>Metadata</SectionTitle>
          {Object.entries(metadata).map(([key, value]) => {
            if (key === 'title' || key === 'name' || key === 'description') return null;
            return (
              <MetadataRow key={key}>
                <MetadataLabel>{key}:</MetadataLabel>
                <MetadataValue>{String(value)}</MetadataValue>
              </MetadataRow>
            );
          })}
        </Section>
      )}
    </>
  );
}

// Main DocsPreview Component
export default function DocsPreview({ data }) {
  if (!data) {
    return (
      <PreviewContainer>
        <EmptyState>
          <EmptyText>Select an item to preview</EmptyText>
        </EmptyState>
      </PreviewContainer>
    );
  }

  console.log('DocsPreview data:', data);

  return (
    <PreviewContainer>
      <PreviewContent>
        {data.type === 'workflow' && <WorkflowPreviewContent metadata={data.metadata} />}
        {data.type === 'skill' && <SkillPreviewContent metadata={data.metadata} />}
        {data.type === 'tool' && <ToolPreviewContent metadata={data.metadata} />}
        {data.type === 'readme' && <ReadmePreviewContent content={data.rawContent} section={data.section} />}
        {data.type === 'generic' && <GenericPreviewContent metadata={data.metadata} />}
        {!['workflow', 'skill', 'tool', 'readme', 'generic'].includes(data.type) && (
          <EmptyState>
            <EmptyText>No preview available (type: {data.type})</EmptyText>
          </EmptyState>
        )}
      </PreviewContent>
    </PreviewContainer>
  );
}
