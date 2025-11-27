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

const WorkflowHeader = styled.div`
  margin-bottom: 10px;
`;

const WorkflowTitle = styled.h2`
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

// No longer parsing steps from markdown - using frontmatter steps array

export default function CoursePreview({ course }) {
  if (!course) {
    return (
      <PreviewContainer>
        <EmptyState>
          <EmptyText>Select a workflow to view details</EmptyText>
        </EmptyState>
      </PreviewContainer>
    );
  }

  // Use steps from frontmatter YAML, or create numbered steps as fallback
  const displaySteps = course.steps && course.steps.length > 0
    ? course.steps
    : course.total_steps
      ? Array.from({ length: course.total_steps }, (_, i) => `Step ${i + 1}`)
      : [];

  return (
    <PreviewContainer>
      <PreviewContent>
        <WorkflowHeader>
          <WorkflowTitle>{course.title}</WorkflowTitle>
        </WorkflowHeader>

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
      </PreviewContent>
    </PreviewContainer>
  );
}
