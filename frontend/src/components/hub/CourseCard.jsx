import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid var(--gitthub-black);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const CourseType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: ${props => props.$type === 'pipeline' ? '#FFF9F0' : '#F5F3FF'};
  border: 2px solid ${props => props.$type === 'pipeline' ? '#FFA500' : '#8B5CF6'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const TypeIcon = styled.span`
  font-size: 0.9rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const CourseDescription = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  line-height: 1.5;
  margin: 0;
`;

const DifficultyBadge = styled.div`
  padding: 0.25rem 0.75rem;
  background: ${props => {
    switch(props.$level) {
      case 'beginner': return '#D1FAE5';
      case 'intermediate': return '#FEF3C7';
      case 'advanced': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  }};
  color: ${props => {
    switch(props.$level) {
      case 'beginner': return '#065F46';
      case 'intermediate': return '#92400E';
      case 'advanced': return '#991B1B';
      default: return '#374151';
    }
  }};
  border: 2px solid ${props => {
    switch(props.$level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#9CA3AF';
    }
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const WhatYouBuild = styled.div`
  background: var(--gitthub-light-beige);
  border-left: 3px solid #FFA500;
  padding: 1rem;
  border-radius: 0 4px 4px 0;
`;

const WhatYouBuildTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const WhatYouBuildText = styled.p`
  font-size: 0.9rem;
  color: var(--gitthub-gray);
  line-height: 1.4;
  margin: 0;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  font-weight: 600;
`;

const MetaIcon = styled.span`
  font-size: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  font-weight: 600;
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  background: var(--gitthub-light-beige);
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StartButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--gitthub-black);
  color: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #FFA500;
    border-color: #FFA500;
    transform: translateY(-2px);
  }
`;

const PrerequisitesHint = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  font-style: italic;
`;

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Don't navigate if clicking the button directly
    if (e.target.closest('button')) return;
    navigate(`/course/${course.course_id}`);
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    navigate(`/course/${course.course_id}`);
  };

  return (
    <CardContainer onClick={handleClick}>
      <CardHeader>
        <HeaderLeft>
          <CourseType $type={course.type}>
            <TypeIcon>{course.type === 'pipeline' ? '⚡' : '🔌'}</TypeIcon>
            {course.type === 'pipeline' ? 'Pipeline Course' : 'MCP Server Course'}
          </CourseType>
          <CourseTitle>{course.title}</CourseTitle>
          <CourseDescription>{course.description}</CourseDescription>
        </HeaderLeft>
        <DifficultyBadge $level={course.difficulty}>
          {course.difficulty}
        </DifficultyBadge>
      </CardHeader>

      <CardBody>
        <WhatYouBuild>
          <WhatYouBuildTitle>What You'll Build</WhatYouBuildTitle>
          <WhatYouBuildText>{course.whatYouWillBuild}</WhatYouBuildText>
        </WhatYouBuild>

        <CardMeta>
          <MetaItem>
            <MetaIcon>⏱️</MetaIcon>
            {course.duration}
          </MetaItem>
          <MetaItem>
            <MetaIcon>📚</MetaIcon>
            {course.modulesCount} modules
          </MetaItem>
        </CardMeta>

        <TagsContainer>
          {course.tags.slice(0, 4).map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
          {course.tags.length > 4 && (
            <Tag>+{course.tags.length - 4} more</Tag>
          )}
        </TagsContainer>
      </CardBody>

      <CardFooter>
        <PrerequisitesHint>
          {course.prerequisites.length > 0
            ? `Prerequisites: ${course.prerequisites.slice(0, 2).join(', ')}${course.prerequisites.length > 2 ? '...' : ''}`
            : 'No prerequisites'
          }
        </PrerequisitesHint>
        <StartButton onClick={handleStartClick}>
          Start Course →
        </StartButton>
      </CardFooter>
    </CardContainer>
  );
}

export default CourseCard;
