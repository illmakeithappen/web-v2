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

// Section Summaries - Comprehensive descriptions inspired by Anthropic's blog style
const sectionSummaries = {
  welcome: {
    title: 'Getting Started',
    headline: 'Your guide to working with AI more effectively.',
    steps: [
      { action: 'Start with a Deploy workflow', desc: 'Pick a workflow that builds something you need. Follow along with AI.' },
      { action: 'Browse Workflows', desc: 'Explore Navigate, Educate, and Deploy guides for different learning styles.' },
      { action: 'Load a Skill', desc: 'Give AI consistent behavior by loading a skill into your session.' },
      { action: 'Connect MCP servers', desc: 'Let AI access your databases, files, and external services.' },
      { action: 'Try Subagents', desc: 'Delegate complex tasks to specialized AI workers.' }
    ],
    tip: 'Press Cmd+K to search across all content instantly.'
  },
  workflows: {
    title: 'Workflows',
    headline: 'Step-by-step guides for humans and AI to execute together.',
    description: 'Unlike automation tools that run without you, workflows keep you in control while AI handles the heavy lifting. They capture expertise so you can repeat successful processes.',
    types: [
      { name: 'Navigate', desc: 'Explore options before committing' },
      { name: 'Educate', desc: 'Learn by doing with explanations' },
      { name: 'Deploy', desc: 'Build something with clear steps' }
    ],
    whenToUse: 'Use workflows when you need guided structure for complex tasks.'
  },
  skills: {
    title: 'Skills',
    headline: 'Reusable instructions that give AI consistent, repeatable behavior.',
    description: 'A skill is a focused document that teaches AI how to do something specific - format code a certain way, analyze data with a framework, or generate content in a particular style. Once loaded, the AI applies the skill whenever relevant.',
    benefit: 'Skills are the secret weapon: small documents that produce consistent results across sessions. Stop re-explaining the same requirements.',
    whenToUse: 'Use skills when you want AI to behave the same way every time.'
  },
  mcp: {
    title: 'MCP Servers',
    headline: 'Model Context Protocol servers connect AI to external tools and data.',
    description: 'MCP is an open protocol that lets AI access databases, files, APIs, and other services. It\'s the bridge between AI and the real world - enabling database queries, file operations, GitHub interactions, and more.',
    benefit: 'Think of MCP servers as giving AI "hands" to interact with systems it couldn\'t otherwise touch.',
    whenToUse: 'Use MCP when AI needs to read/write real data or call external services.'
  },
  subagents: {
    title: 'Subagents',
    headline: 'Specialized AI agents for delegating specific tasks.',
    description: 'Subagents are focused AI workers that handle particular domains. A research subagent finds information. A code review subagent checks your work. An orchestrator coordinates multiple subagents for complex tasks.',
    benefit: 'They enable divide-and-conquer: break complex work into pieces, let specialized agents handle each part.',
    whenToUse: 'Use subagents when tasks benefit from decomposition or parallel processing.'
  }
}

// Styled components for rich summary display
const SummaryHeadline = styled.p`
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #24292f;
  line-height: 1.4;
`

const SummaryText = styled.p`
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #57606a;
  line-height: 1.5;
`

const TypesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;
`

const TypeItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 11px;
`

const TypeName = styled.span`
  font-weight: 600;
  color: #24292f;
`

const TypeDesc = styled.span`
  color: #57606a;
`

const WhenToUse = styled.p`
  margin: 8px 0 0 0;
  font-size: 11px;
  color: #0969da;
  font-style: italic;
`

const StepsList = styled.ol`
  margin: 8px 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StepListItem = styled.li`
  font-size: 12px;
  line-height: 1.4;
  color: #24292f;
`

const StepAction = styled.span`
  font-weight: 600;
  color: #0969da;
`

const StepDesc = styled.span`
  color: #57606a;
`

const ProTip = styled.div`
  margin-top: 10px;
  padding: 8px 10px;
  background: #f6f8fa;
  border-left: 3px solid #0969da;
  border-radius: 0 4px 4px 0;
  font-size: 11px;
  color: #57606a;

  strong {
    color: #24292f;
  }
`

// README Preview Component
function ReadmePreviewContent({ content, section }) {
  // Use dedicated comprehensive summaries for all main sections
  const summary = sectionSummaries[section]
  if (summary) {
    // Welcome section - show getting started steps
    if (summary.steps) {
      return (
        <>
          <Header>
            <Title>{summary.title}</Title>
          </Header>
          <Section>
            <SummaryHeadline>{summary.headline}</SummaryHeadline>
            <StepsList>
              {summary.steps.map((step, idx) => (
                <StepListItem key={idx}>
                  <StepAction>{step.action}</StepAction>
                  <StepDesc> — {step.desc}</StepDesc>
                </StepListItem>
              ))}
            </StepsList>
            {summary.tip && (
              <ProTip><strong>Tip:</strong> {summary.tip}</ProTip>
            )}
          </Section>
        </>
      )
    }

    // Other sections - show description with types/benefits
    return (
      <>
        <Header>
          <Title>{summary.title}</Title>
        </Header>
        <Section>
          <SummaryHeadline>{summary.headline}</SummaryHeadline>
          <SummaryText>{summary.description}</SummaryText>

          {summary.types && (
            <TypesList>
              <SectionTitle>Three types:</SectionTitle>
              {summary.types.map((type, idx) => (
                <TypeItem key={idx}>
                  <TypeName>{type.name}</TypeName>
                  <TypeDesc>- {type.desc}</TypeDesc>
                </TypeItem>
              ))}
            </TypesList>
          )}

          {summary.benefit && (
            <SummaryText>{summary.benefit}</SummaryText>
          )}

          <WhenToUse>{summary.whenToUse}</WhenToUse>
        </Section>
      </>
    )
  }

  // Fallback for tools or other sections - extract intro paragraphs
  if (content) {
    const afterTitle = content.replace(/^#[^#\n]*\n+/, '')
    const summaryMatch = afterTitle.match(/^[\s\S]*?(?=\n###|$)/)
    const summaryContent = summaryMatch ? summaryMatch[0].trim() : afterTitle.substring(0, 400)

    return (
      <>
        <Header>
          <Title>{section.charAt(0).toUpperCase() + section.slice(1)} Summary</Title>
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
