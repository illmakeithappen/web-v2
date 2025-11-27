import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: #f9f6f1;
  border-radius: 8px;
`;

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #000;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const SectionHeader = styled.div`
  color: #2563eb;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 12px;
`;

const MetadataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: ${props => props.$index % 2 === 0 ? '#f9fafb' : 'white'};
  border-radius: 6px;
`;

const MetadataIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const MetadataContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MetadataLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 2px;
`;

const MetadataValue = styled.div`
  font-size: 0.875rem;
  color: #000;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem 1rem;
  color: #888;
  text-align: center;

  svg {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    opacity: 0.3;
    stroke: currentColor;
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
  }

  p {
    font-size: 0.75rem;
    margin: 0;
    color: #999;
  }
`;

const ActionBar = styled.div`
  padding: 12px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: ${props => props.$primary ? '#000' : 'white'};
  color: ${props => props.$primary ? 'white' : '#000'};
  border: 2px solid #000;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const parseSkillMetadata = (skillContent) => {
  if (!skillContent) return null;

  // Extract YAML frontmatter
  const yamlMatch = skillContent.match(/---\n(.*?)\n---/s);
  if (!yamlMatch) return null;

  const yaml = yamlMatch[1];

  // Parse name
  const nameMatch = yaml.match(/name:\s*["']([^"']+)["']/);
  const name = nameMatch ? nameMatch[1] : 'Unnamed Skill';

  // Parse description
  const descMatch = yaml.match(/description:\s*["']([^"']+)["']/);
  const description = descMatch ? descMatch[1] : 'No description';

  // Parse allowed tools
  const toolsMatch = yaml.match(/allowed-tools:\s*\[(.*?)\]/);
  const tools = toolsMatch
    ? toolsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
    : ['All tools'];

  return { name, description, tools };
};

export default function SkillPreview({ skillContent, onRefine, onDownload }) {
  const metadata = parseSkillMetadata(skillContent);

  // Show empty state when no skill exists
  if (!skillContent) {
    return (
      <Container>
        <ContentFrame>
          <Header>
            <Title>Skill Outline</Title>
          </Header>

          <PreviewContent>
            <EmptyState>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4>No skill yet</h4>
              <p>Start chatting to generate</p>
            </EmptyState>
          </PreviewContent>
        </ContentFrame>
      </Container>
    );
  }

  // Show skill outline when available
  return (
    <Container>
      <ContentFrame>
        <Header>
          <Title>Skill Outline</Title>
        </Header>

        <PreviewContent>
          <SectionHeader>Skill Details</SectionHeader>

          <MetadataList>
            <MetadataItem $index={0}>
              <MetadataIcon>📝</MetadataIcon>
              <MetadataContent>
                <MetadataLabel>Name</MetadataLabel>
                <MetadataValue>{metadata.name}</MetadataValue>
              </MetadataContent>
            </MetadataItem>

            <MetadataItem $index={1}>
              <MetadataIcon>📋</MetadataIcon>
              <MetadataContent>
                <MetadataLabel>Description</MetadataLabel>
                <MetadataValue>{metadata.description}</MetadataValue>
              </MetadataContent>
            </MetadataItem>

            <MetadataItem $index={2}>
              <MetadataIcon>🔧</MetadataIcon>
              <MetadataContent>
                <MetadataLabel>Allowed Tools</MetadataLabel>
                <MetadataValue>{metadata.tools.join(', ')}</MetadataValue>
              </MetadataContent>
            </MetadataItem>
          </MetadataList>
        </PreviewContent>

        <ActionBar>
          <ActionButton onClick={onRefine}>
            ✨ Refine
          </ActionButton>
          <ActionButton $primary onClick={onDownload}>
            💾 Save
          </ActionButton>
        </ActionBar>
      </ContentFrame>
    </Container>
  );
}
