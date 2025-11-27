import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
`;

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
  background: var(--gitthub-light-beige);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.75rem;
  width: 100%;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
`;

const CourseTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.4rem 0;
  line-height: 1.3;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.7rem;
  color: var(--gitthub-gray);
  font-weight: 600;
  margin-top: 0.4rem;
`;

const ProgressSection = styled.div`
  padding: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gitthub-black);
`;

const ProgressBar = styled.div`
  height: 6px;
  background: var(--gitthub-light-beige);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.$progress === 100 ? '#10B981' : 'var(--gitthub-black)'};
  border-radius: 3px;
  width: ${props => props.$progress}%;
  transition: width 0.5s ease, background 0.3s ease;
`;

const ModulesSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ModuleItem = styled.button`
  padding: 0.6rem;
  border: 2px solid ${props => props.$active ? 'var(--gitthub-black)' : 'rgba(0, 0, 0, 0.1)'};
  background: ${props => props.$active ? 'var(--gitthub-light-beige)' : 'white'};
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: var(--gitthub-light-beige);
    border-color: var(--gitthub-black);
  }

  ${props => props.$completed && `
    &::after {
      content: '✓';
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      color: #10B981;
      font-weight: bold;
      font-size: 0.95rem;
    }
  `}
`;

const ModuleNumber = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--gitthub-gray);
  margin-bottom: 0.2rem;
  text-transform: uppercase;
`;

const ModuleTitle = styled.div`
  font-size: 0.8rem;
  font-weight: ${props => props.$active ? '700' : '600'};
  color: var(--gitthub-black);
  line-height: 1.3;
  padding-right: ${props => props.$completed ? '1.3rem' : '0'};
`;

const StatsSection = styled.div`
  padding: 0.75rem 1rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  background: var(--gitthub-light-beige);
  display: flex;
  justify-content: space-around;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gitthub-black);
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  color: var(--gitthub-gray);
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.2rem;
`;

export default function ProgressPanel({
  course,
  selectedModuleIndex,
  completedModules,
  onModuleSelect,
  onBackToCatalog
}) {
  if (!course) {
    return (
      <PanelContainer>
        <PanelHeader>
          <BackButton onClick={onBackToCatalog}>
            ← Back to Catalog
          </BackButton>
        </PanelHeader>
      </PanelContainer>
    );
  }

  const totalModules = course.modules?.length || 0;
  const completedCount = completedModules?.size || 0;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <PanelContainer>
      <ContentFrame>
        <PanelHeader>
          <BackButton onClick={onBackToCatalog}>
            ← Back to Catalog
          </BackButton>
          <CourseTitle>{course.title}</CourseTitle>
          <CourseMeta>
            <span>{course.difficulty}</span>
            <span>•</span>
            <span>{course.duration}</span>
          </CourseMeta>
        </PanelHeader>

        <ProgressSection>
          <ProgressLabel>
            <span>Overall Progress</span>
            <span>{progressPercent}%</span>
          </ProgressLabel>
          <ProgressBar>
            <ProgressFill $progress={progressPercent} />
          </ProgressBar>
        </ProgressSection>

        <ModulesSection>
          <SectionTitle>Course Modules</SectionTitle>
          <ModulesList>
            {course.modules?.map((module, index) => (
              <ModuleItem
                key={module.module_id}
                $active={selectedModuleIndex === index}
                $completed={completedModules?.has(index)}
                onClick={() => onModuleSelect(index)}
              >
                <ModuleNumber>Module {index + 1}</ModuleNumber>
                <ModuleTitle
                  $active={selectedModuleIndex === index}
                  $completed={completedModules?.has(index)}
                >
                  {module.title}
                </ModuleTitle>
              </ModuleItem>
            ))}
          </ModulesList>
        </ModulesSection>

        <StatsSection>
          <StatItem>
            <StatValue>{completedCount}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalModules - completedCount}</StatValue>
            <StatLabel>Remaining</StatLabel>
          </StatItem>
        </StatsSection>
      </ContentFrame>
    </PanelContainer>
  );
}
