import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { getCourseById } from '../data/courseTemplates';
import ProgressPanel from '../components/hub/ProgressPanel';
import CourseContent from '../components/hub/CourseContent';

// Use the same container styles as Hub page
const HubContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
  padding-top: 0;
`;

const HubContent = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  min-height: calc(100vh - 4rem);
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LeftPane = styled.div`
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 90px;
  height: calc(100vh - 120px);
  max-height: calc(100vh - 120px);
  background: linear-gradient(to bottom,
    rgba(236, 236, 236, 0.95) 0%,
    rgba(220, 220, 220, 0.95) 3%,
    rgba(232, 232, 232, 0.95) 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  align-self: flex-start;

  @media (max-width: 968px) {
    flex: none;
    position: static;
    height: auto;
    min-height: 500px;
    max-height: 600px;
  }
`;

const ProgressPanelTitleBar = styled.div`
  background: linear-gradient(to bottom,
    rgba(230, 230, 230, 0.98) 0%,
    rgba(210, 210, 210, 0.98) 50%,
    rgba(200, 200, 200, 0.98) 100%
  );
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  height: 22px;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const PanelTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #3C3C3C;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Lucida Grande', 'Helvetica Neue', sans-serif;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  left: 10px;
`;

const WindowButton = styled.button`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: ${props =>
    props.$close ? 'linear-gradient(145deg, #FC615D 0%, #FB4943 100%)' :
    props.$maximize ? 'linear-gradient(145deg, #FDBC40 0%, #FCA310 100%)' :
    'linear-gradient(145deg, #34C948 0%, #24A936 100%)'
  };
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.15s ease;
  padding: 0;
  font-size: 0;
  line-height: 0;

  &:hover {
    filter: brightness(1.05);
    transform: scale(1.05);
  }

  &:active {
    filter: brightness(0.95);
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.2);
  }
`;

const ProgressPanelWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const RightPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  min-height: calc(100vh - 120px);
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 968px) {
    min-height: 600px;
  }
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
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
`;

function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [checkedSteps, setCheckedSteps] = useState({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchCourse();
    loadProgressFromStorage();
  }, [courseId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (course && courseId) {
      saveProgressToStorage();
    }
  }, [completedModules, checkedSteps, course]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      // First, check if course exists in local templates
      const localCourse = getCourseById(courseId);

      if (localCourse) {
        // Convert template format to CourseViewer format
        const formattedCourse = {
          ...localCourse,
          id: localCourse.course_id,
          level: localCourse.difficulty,
          metadata: {
            uses_bedrock: false
          }
        };
        setCourse(formattedCourse);
        setError(null);
      } else {
        // Fall back to API if not in templates
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

  const loadProgressFromStorage = () => {
    if (courseId) {
      const storageKey = `course_progress_${courseId}`;
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        try {
          const progressData = JSON.parse(savedProgress);
          if (progressData.completedModules) {
            setCompletedModules(new Set(progressData.completedModules));
          }
          if (progressData.checkedSteps) {
            setCheckedSteps(progressData.checkedSteps);
          }
          if (progressData.selectedModuleIndex !== undefined) {
            setSelectedModuleIndex(progressData.selectedModuleIndex);
          }
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }
  };

  const saveProgressToStorage = () => {
    if (courseId && course) {
      const storageKey = `course_progress_${courseId}`;
      const progressData = {
        courseId: courseId,
        courseTitle: course.title,
        totalModules: course.modules?.length || 0,
        completedModules: Array.from(completedModules),
        checkedSteps: checkedSteps,
        selectedModuleIndex: selectedModuleIndex,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(progressData));

      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify(progressData),
        url: window.location.href
      }));
    }
  };

  const handleBackToCatalog = () => {
    navigate('/hub');
  };

  const handleModuleSelect = (moduleIndex) => {
    setSelectedModuleIndex(moduleIndex);
  };

  const handleModuleComplete = (moduleIndex) => {
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleIndex)) {
        newSet.delete(moduleIndex);
      } else {
        newSet.add(moduleIndex);
      }
      return newSet;
    });
  };

  const handleStepCheck = (stepId) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };


  if (loading) {
    return (
      <HubContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </HubContainer>
    );
  }

  if (error) {
    return (
      <HubContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </HubContainer>
    );
  }

  if (!course) {
    return (
      <HubContainer>
        <ErrorMessage>Course not found</ErrorMessage>
      </HubContainer>
    );
  }

  return (
    <HubContainer>
      <HubContent>
        <LeftPane>
          <ProgressPanelTitleBar>
            <WindowControls>
              <WindowButton $close />
              <WindowButton $maximize />
              <WindowButton />
            </WindowControls>
            <PanelTitle>
              📚 Course Progress
            </PanelTitle>
          </ProgressPanelTitleBar>
          <ProgressPanelWrapper>
            <ProgressPanel
              course={course}
              selectedModuleIndex={selectedModuleIndex}
              completedModules={completedModules}
              onModuleSelect={handleModuleSelect}
              onBackToCatalog={handleBackToCatalog}
            />
          </ProgressPanelWrapper>
        </LeftPane>

        <RightPane>
          <CourseContent
            courseId={courseId}
            selectedModuleIndex={selectedModuleIndex}
            completedModules={completedModules}
            checkedSteps={checkedSteps}
            onModuleComplete={handleModuleComplete}
            onModuleChange={handleModuleSelect}
            onStepCheck={handleStepCheck}
          />
        </RightPane>
      </HubContent>
    </HubContainer>
  );
}

export default CourseViewer;
