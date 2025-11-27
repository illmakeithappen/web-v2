import React, { useState } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonTypography, carbonSpacing } from '../../styles/carbonTheme';
import { DifficultyBadge } from '../carbon/CarbonTag';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
  overflow-y: auto;
  position: relative;
`;

const DetailContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${carbonSpacing.spacing07} ${carbonSpacing.spacing06};
`;

const Header = styled.div`
  margin-bottom: ${carbonSpacing.spacing06};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing04};
  margin-bottom: ${carbonSpacing.spacing04};
`;

const AgentLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: ${carbonSpacing.spacing02} ${carbonSpacing.spacing04};
  background: ${carbonColors.layer02};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 4px;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  color: ${carbonColors.text02};
  font-weight: ${carbonTypography.fontWeight.semibold};
  text-transform: uppercase;
`;

const CourseTitle = styled.h1`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: 2.25rem;
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text01};
  margin: 0 0 ${carbonSpacing.spacing04} 0;
  line-height: 1.2;
`;

const CourseDescription = styled.p`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyLong01};
  color: ${carbonColors.text02};
  line-height: 1.6;
  margin: 0 0 ${carbonSpacing.spacing06} 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing05};
  margin-bottom: ${carbonSpacing.spacing06};
  padding: ${carbonSpacing.spacing05};
  background: ${carbonColors.layer01};
  border-radius: 8px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing02};

  .label {
    font-family: ${carbonTypography.fontFamily.sans};
    font-size: ${carbonTypography.fontSize.label01};
    color: ${carbonColors.text02};
    text-transform: uppercase;
    font-weight: ${carbonTypography.fontWeight.semibold};
  }

  .value {
    font-family: ${carbonTypography.fontFamily.sans};
    font-size: ${carbonTypography.fontSize.heading03};
    color: ${carbonColors.text01};
    font-weight: ${carbonTypography.fontWeight.regular};
  }
`;

const Section = styled.section`
  margin-bottom: ${carbonSpacing.spacing07};
`;

const SectionTitle = styled.h2`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.heading02};
  font-weight: ${carbonTypography.fontWeight.semibold};
  color: ${carbonColors.text01};
  margin: 0 0 ${carbonSpacing.spacing04} 0;
  padding-bottom: ${carbonSpacing.spacing03};
  border-bottom: 2px solid #D97757;
`;

const SectionContent = styled.div`
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyLong01};
  color: ${carbonColors.text02};
  line-height: 1.6;
`;

const HighlightBox = styled.div`
  padding: ${carbonSpacing.spacing05};
  background: linear-gradient(135deg, rgba(217, 119, 87, 0.1) 0%, rgba(217, 119, 87, 0.05) 100%);
  border-left: 4px solid #D97757;
  border-radius: 4px;
  margin: ${carbonSpacing.spacing04} 0;

  p {
    margin: 0;
    font-family: ${carbonTypography.fontFamily.sans};
    font-size: ${carbonTypography.fontSize.bodyLong01};
    color: ${carbonColors.text01};
    line-height: 1.6;
  }
`;

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing04};
`;

const ModuleCard = styled.div`
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${carbonColors.borderInteractive};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ModuleHeader = styled.button`
  width: 100%;
  padding: ${carbonSpacing.spacing05};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${carbonSpacing.spacing04};
  text-align: left;

  &:hover {
    background: ${carbonColors.hoverUI};
  }
`;

const ModuleHeaderLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing04};
`;

const ModuleNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #D97757;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  font-weight: ${carbonTypography.fontWeight.semibold};
  flex-shrink: 0;
`;

const ModuleTitleGroup = styled.div`
  .module-title {
    font-family: ${carbonTypography.fontFamily.sans};
    font-size: ${carbonTypography.fontSize.heading04};
    font-weight: ${carbonTypography.fontWeight.semibold};
    color: ${carbonColors.text01};
    margin: 0 0 ${carbonSpacing.spacing02} 0;
  }

  .module-description {
    font-family: ${carbonTypography.fontFamily.sans};
    font-size: ${carbonTypography.fontSize.bodyShort01};
    color: ${carbonColors.text02};
    margin: 0;
  }
`;

const ExpandIcon = styled.span`
  font-size: 1.25rem;
  color: ${carbonColors.text02};
  transition: transform 0.2s ease;
  transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ModuleBody = styled.div`
  padding: 0 ${carbonSpacing.spacing05} ${carbonSpacing.spacing05};
  display: ${props => props.$expanded ? 'block' : 'none'};
`;

const ObjectiveList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing03};
`;

const ObjectiveItem = styled.li`
  padding-left: ${carbonSpacing.spacing05};
  position: relative;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #24A936;
    font-weight: bold;
  }
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${carbonSpacing.spacing03};
`;

const Tag = styled.span`
  display: inline-block;
  padding: ${carbonSpacing.spacing02} ${carbonSpacing.spacing04};
  background: ${carbonColors.layer02};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 16px;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.label01};
  color: ${carbonColors.text01};
  font-weight: ${carbonTypography.fontWeight.regular};
`;

const PrereqList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing03};
`;

const PrereqItem = styled.li`
  padding-left: ${carbonSpacing.spacing05};
  position: relative;
  font-family: ${carbonTypography.fontFamily.sans};
  font-size: ${carbonTypography.fontSize.bodyShort01};
  color: ${carbonColors.text02};

  &::before {
    content: '●';
    position: absolute;
    left: 0;
    color: #D97757;
  }
`;


// ============================================================================
// COMPONENT
// ============================================================================

export default function CourseDetailView({ course, progressData }) {
  if (!course) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DetailContainer>
      <DetailContent>
        {/* Header */}
        <Header>
          <HeaderTop>
            <AgentLogo src="/images/agents/anthropic-logo.png" alt={course.agent} title={course.agent} />
            <TypeBadge>{course.type === 'pipeline' ? 'Flow' : course.type === 'mcp' ? 'MCP' : course.type}</TypeBadge>
            <DifficultyBadge difficulty={course.difficulty} />
          </HeaderTop>
          <CourseTitle>Course Generation Configuration</CourseTitle>
          <CourseDescription>{course.title}</CourseDescription>
        </Header>

        {/* Basic Information */}
        <Section>
          <SectionTitle>📋 Basic Information</SectionTitle>
          <StatsRow>
            <StatItem>
              <div className="label">Topic</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {course.topic || course.title}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Target Audience</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {course.target_audience || 'General audience'}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Duration</div>
              <div className="value">{course.duration}</div>
            </StatItem>
            <StatItem>
              <div className="label">Difficulty</div>
              <div className="value">
                <DifficultyBadge difficulty={course.difficulty} />
              </div>
            </StatItem>
          </StatsRow>
        </Section>

        {/* Learning Goals */}
        {course.learning_objectives && course.learning_objectives.length > 0 && (
          <Section>
            <SectionTitle>🎯 Learning Goals</SectionTitle>
            <ObjectiveList>
              {course.learning_objectives.map((objective, index) => (
                <ObjectiveItem key={index}>{objective}</ObjectiveItem>
              ))}
            </ObjectiveList>
          </Section>
        )}

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Section>
            <SectionTitle>📚 Requirements</SectionTitle>
            <PrereqList>
              {course.prerequisites.map((prereq, index) => (
                <PrereqItem key={index}>{prereq}</PrereqItem>
              ))}
            </PrereqList>
          </Section>
        )}

        {/* Generation Settings */}
        <Section>
          <SectionTitle>🤖 Generation Settings</SectionTitle>
          <StatsRow>
            <StatItem>
              <div className="label">AI Model</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {course.ai_model_used || 'Template-based'}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Assessments</div>
              <div className="value">
                {course.include_assessments ? '✓ Yes' : '✗ No'}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Projects</div>
              <div className="value">
                {course.include_projects ? '✓ Yes' : '✗ No'}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Language</div>
              <div className="value">{course.language || 'English'}</div>
            </StatItem>
          </StatsRow>
        </Section>

        {/* Resources Used */}
        {course.databank_resources_used && course.databank_resources_used.length > 0 && (
          <Section>
            <SectionTitle>🔗 Resources Used</SectionTitle>
            <PrereqList>
              {course.databank_resources_used.map((resource, index) => (
                <PrereqItem key={index}>
                  {resource.name} <span style={{ color: carbonColors.text02, fontSize: '0.85rem' }}>({resource.type})</span>
                </PrereqItem>
              ))}
            </PrereqList>
          </Section>
        )}

        {/* Metadata */}
        <Section>
          <SectionTitle>ℹ️ Metadata</SectionTitle>
          <StatsRow>
            <StatItem>
              <div className="label">Created</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {formatDate(course.created_at)}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Created By</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {course.created_by || 'System'}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Last Modified</div>
              <div className="value" style={{ fontSize: '0.95rem' }}>
                {formatDate(course.last_modified)}
              </div>
            </StatItem>
            <StatItem>
              <div className="label">Status</div>
              <div className="value">
                <TypeBadge style={{ background: course.status === 'published' ? 'rgba(52, 201, 72, 0.15)' : 'rgba(255, 165, 0, 0.15)', color: course.status === 'published' ? '#24A936' : '#FF8C00' }}>
                  {course.status || 'draft'}
                </TypeBadge>
              </div>
            </StatItem>
          </StatsRow>
        </Section>
      </DetailContent>
    </DetailContainer>
  );
}
