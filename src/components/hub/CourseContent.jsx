import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getCourseById } from '../../data/courseTemplates';
import CourseContentRenderer from './CourseContentRenderer';

const ContentContainer = styled.div`
  background: transparent;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const PaperWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;

  /* Paper texture subtle effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.01) 50%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.008) 2px,
        rgba(0,0,0,0.008) 4px
      );
    pointer-events: none;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const CourseHeader = styled.div`
  background: linear-gradient(135deg, #faf9f7 0%, var(--gitthub-light-beige) 100%);
  border-bottom: 3px solid var(--gitthub-black);
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(139, 122, 88, 0.08);
  position: relative;
  z-index: 1;
`;

const CourseTitle = styled.h1`
  font-size: 2.25rem;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  font-weight: 800;
`;

const CourseDescription = styled.p`
  font-size: 1.1rem;
  color: #2c2c2c;
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ContentBody = styled.div`
  padding: 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #faf9f7 100%);
  flex: 1;
  border-radius: 0 0 6px 6px;
  position: relative;
  z-index: 1;
`;

const ModuleHeader = styled.div`
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--gitthub-light-beige) 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid var(--gitthub-beige);
  box-shadow: 0 2px 6px rgba(139, 122, 88, 0.06);
`;

const ModuleTitle = styled.h2`
  font-size: 1.75rem;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  font-weight: 700;
`;

const ModuleDescription = styled.p`
  color: #2c2c2c;
  line-height: 1.7;
  font-size: 1.05rem;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--gitthub-black);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--gitthub-beige);
  font-weight: 600;
`;

const SectionContent = styled.div`
  line-height: 1.7;
  color: #2c2c2c;
`;

// Note: CommandBlock, CopyButton, and ChecklistItem are now handled by CourseContentRenderer

const ActivityCard = styled.div`
  background: linear-gradient(135deg, var(--gitthub-light-beige) 0%, #ffffff 100%);
  border-left: 4px solid var(--gitthub-black);
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 2px 6px rgba(139, 122, 88, 0.06);
`;

const ActivityTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--gitthub-black);
  font-weight: 600;
`;

const QuizContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, var(--gitthub-light-beige) 100%);
  border: 2px solid var(--gitthub-beige);
  border-radius: 8px;
  padding: 2rem;
  margin: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(139, 122, 88, 0.08);
`;

const Question = styled.div`
  margin-bottom: 1.5rem;
`;

const QuestionText = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--gitthub-light-beige);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: var(--gitthub-beige);
  }
`;

const ModuleActions = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--gitthub-light-beige) 0%, #f5f4f0 100%);
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--gitthub-beige);
  box-shadow: 0 4px 12px rgba(139, 122, 88, 0.08);
`;

const CompleteButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.$completed ? '#4caf50' : 'var(--gitthub-black)'};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ModuleNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--gitthub-light-beige);
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$disabled ? 'var(--gitthub-light-beige)' : 'var(--gitthub-black)'};
  color: ${props => props.$disabled ? 'var(--gitthub-gray)' : 'white'};
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const NavInfo = styled.span`
  color: var(--gitthub-gray);
  font-size: 0.9rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--gitthub-light-beige);
  border-top-color: var(--gitthub-black);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 2px solid #f44;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin: 2rem;
  text-align: center;
`;

export default function CourseContent({
  courseId,
  selectedModuleIndex,
  completedModules,
  checkedSteps,
  onModuleComplete,
  onModuleChange,
  onStepCheck
}) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const localCourse = getCourseById(courseId);

      if (localCourse) {
        const formattedCourse = {
          ...localCourse,
          id: localCourse.course_id,
          level: localCourse.difficulty,
          metadata: { uses_bedrock: false }
        };
        setCourse(formattedCourse);
        setError(null);
      } else {
        const response = await axios.get(`/api/v1/courses/bedrock/${courseId}`);
        setCourse(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content, contentType, moduleIndex, sectionIndex) => {
    // Handle special interactive content type
    if (contentType === 'interactive') {
      return (
        <div style={{ padding: '1rem', background: '#faf9f7', borderRadius: '6px', border: '1px solid var(--gitthub-beige)' }}>
          {content}
        </div>
      );
    }

    // Use the new CourseContentRenderer for all other content types
    return (
      <CourseContentRenderer
        content={content}
        contentType={contentType}
        onStepCheck={onStepCheck}
        checkedSteps={checkedSteps}
        moduleIndex={moduleIndex}
        sectionIndex={sectionIndex}
      />
    );
  };

  if (loading) {
    return (
      <ContentContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </ContentContainer>
    );
  }

  if (error) {
    return (
      <ContentContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </ContentContainer>
    );
  }

  if (!course) {
    return (
      <ContentContainer>
        <ErrorMessage>Course not found</ErrorMessage>
      </ContentContainer>
    );
  }

  const currentModule = course.modules[selectedModuleIndex];
  const isCompleted = completedModules?.has(selectedModuleIndex);

  return (
    <ContentContainer>
      <PaperWrapper>
        <CourseHeader>
          <CourseTitle>
            {course.title.includes('Deployment') ? course.title : `${course.title} - Deployment Manual`}
          </CourseTitle>
          <CourseDescription>{course.description}</CourseDescription>
          <CourseMeta>
            <MetaItem>
              <strong>Level:</strong> {course.level}
            </MetaItem>
            <MetaItem>
              <strong>Duration:</strong> {course.duration}
            </MetaItem>
            <MetaItem>
              <strong>Modules:</strong> {course.modules.length}
            </MetaItem>
            <MetaItem>
              <strong>Language:</strong> {course.language || 'English'}
            </MetaItem>
          </CourseMeta>
        </CourseHeader>

        <ContentBody>
        <ModuleHeader>
          <ModuleTitle>
            Module {selectedModuleIndex + 1}: {currentModule.title}
          </ModuleTitle>
          <ModuleDescription>{currentModule.description}</ModuleDescription>
        </ModuleHeader>

        {currentModule.objectives && currentModule.objectives.length > 0 && (
          <Section>
            <SectionTitle>Learning Objectives</SectionTitle>
            <ul style={{ marginLeft: '1.5rem' }}>
              {currentModule.objectives.map((objective, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {objective}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {currentModule.content_sections && currentModule.content_sections.map((section, index) => (
          <Section key={index}>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionContent>
              {renderContent(section.content, section.content_type, selectedModuleIndex, index)}
              {section.duration_minutes && (
                <p style={{ fontSize: '0.9rem', color: 'var(--gitthub-gray)', marginTop: '0.5rem' }}>
                  Estimated time: {section.duration_minutes} minutes
                </p>
              )}
            </SectionContent>
          </Section>
        ))}

        {currentModule.activities && currentModule.activities.length > 0 && (
          <Section>
            <SectionTitle>Activities</SectionTitle>
            {currentModule.activities.map((activity, index) => (
              <ActivityCard key={index}>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <p style={{ marginBottom: '0.5rem' }}>{activity.description}</p>
                <strong>Instructions:</strong>
                <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {activity.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
                {activity.hints && activity.hints.length > 0 && (
                  <details style={{ marginTop: '1rem' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                      Hints
                    </summary>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                      {activity.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </ActivityCard>
            ))}
          </Section>
        )}

        {currentModule.assessment && (
          <Section>
            <SectionTitle>{currentModule.assessment.title}</SectionTitle>
            <QuizContainer>
              {currentModule.assessment.questions.map((question, index) => (
                <Question key={index}>
                  <QuestionText>
                    {index + 1}. {question.question}
                  </QuestionText>
                  <Options>
                    {question.options && question.options.map((option, optIndex) => (
                      <Option key={optIndex}>
                        <input type="radio" name={`question-${index}`} />
                        <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                      </Option>
                    ))}
                  </Options>
                </Question>
              ))}
            </QuizContainer>
          </Section>
        )}

        <ModuleActions>
          <CompleteButton
            $completed={isCompleted}
            onClick={() => onModuleComplete(selectedModuleIndex)}
          >
            {isCompleted ? '✓ Phase Completed' : 'Mark Phase as Complete'}
          </CompleteButton>
        </ModuleActions>

        <ModuleNavigation>
          <NavButton
            $disabled={selectedModuleIndex === 0}
            disabled={selectedModuleIndex === 0}
            onClick={() => onModuleChange(Math.max(0, selectedModuleIndex - 1))}
          >
            ← Previous Phase
          </NavButton>

          <NavInfo>
            Phase {selectedModuleIndex + 1} of {course.modules.length}
          </NavInfo>

          <NavButton
            $disabled={selectedModuleIndex === course.modules.length - 1}
            disabled={selectedModuleIndex === course.modules.length - 1}
            onClick={() => onModuleChange(Math.min(course.modules.length - 1, selectedModuleIndex + 1))}
          >
            Next Phase →
          </NavButton>
        </ModuleNavigation>
        </ContentBody>
      </PaperWrapper>
    </ContentContainer>
  );
}
