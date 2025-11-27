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

const SkillHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SkillTitleSection = styled.div`
  flex: 1;
`;

const SkillTitle = styled.h2`
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
    return '#f6f8fa';
  }};
  color: ${props => {
    if (props.$type === 'beginner') return '#0969da';
    if (props.$type === 'intermediate') return '#9a6700';
    if (props.$type === 'advanced') return '#d1242f';
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

export default function SkillPreview({ skill }) {
  if (!skill) {
    return (
      <PreviewContainer>
        <EmptyState>
          <EmptyText>Select a skill to view details</EmptyText>
        </EmptyState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer>
      <PreviewContent>
        <SkillHeader>
          <SkillTitleSection>
            <SkillTitle>{skill.skill_name}</SkillTitle>

            <MetadataRow>
              <MetadataItem>
                <MetadataLabel>Type:</MetadataLabel>
                <MetadataValue>
                  {skill.skill_type.charAt(0).toUpperCase() + skill.skill_type.slice(1)}
                </MetadataValue>
              </MetadataItem>

              <MetadataItem>
                <MetadataLabel>Difficulty:</MetadataLabel>
                <Badge $type={skill.difficulty}>
                  {skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1)}
                </Badge>
              </MetadataItem>

              {skill.created_by && (
                <MetadataItem>
                  <MetadataLabel>Created by:</MetadataLabel>
                  <MetadataValue>{skill.created_by}</MetadataValue>
                </MetadataItem>
              )}
            </MetadataRow>
          </SkillTitleSection>
        </SkillHeader>

        {skill.description && (
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{skill.description}</Description>
          </Section>
        )}

        {skill.frontmatter_yaml && (
          <Section>
            <SectionTitle>Frontmatter</SectionTitle>
            <CodeBlock>{skill.frontmatter_yaml}</CodeBlock>
          </Section>
        )}

        {skill.tags && skill.tags.length > 0 && (
          <Section>
            <SectionTitle>Tags</SectionTitle>
            <TagsContainer>
              {skill.tags.map((tag, idx) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
            </TagsContainer>
          </Section>
        )}

        {skill.created_at && (
          <Section>
            <MetadataItem>
              <MetadataLabel>Created:</MetadataLabel>
              <MetadataValue>
                {new Date(skill.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </MetadataValue>
            </MetadataItem>
          </Section>
        )}
      </PreviewContent>
    </PreviewContainer>
  );
}
