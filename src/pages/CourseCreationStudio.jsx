import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NavigationLayout from '../components/shared/NavigationLayout';
import ContextCollectorChat from '../components/studio/ContextCollectorChat';
import ContextArtifact from '../components/studio/ContextArtifact';
import SystemPromptViewer from '../components/studio/SystemPromptViewer';

const RightPaneContent = styled.div`
  flex: 1;
  padding: 0;
  margin: 0;
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

const StudioHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(250, 249, 247, 0.98);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--gitthub-beige);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StudioTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gitthub-black);
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.85rem;
    color: var(--gitthub-gray);
    margin: 0;
  }
`;

const StudioActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ArtifactWrapper = styled.div`
  height: calc(100% - 78px); /* Subtract header height */
  overflow-y: auto;
`;

// Context reducer for managing complex state
const contextReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_CONTEXT':
      return { ...state, ...action.payload };
    case 'UPDATE_PROBLEM':
      return { ...state, problem: action.payload };
    case 'UPDATE_GOALS':
      return { ...state, goals: action.payload };
    case 'UPDATE_AUDIENCE':
      return { ...state, targetAudience: action.payload };
    case 'UPDATE_CONSTRAINTS':
      return { ...state, constraints: action.payload };
    case 'UPDATE_REQUIREMENTS':
      return { ...state, requirements: action.payload };
    case 'UPDATE_TECH_STACK':
      return { ...state, techStack: action.payload };
    case 'UPDATE_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'RESET':
      return initialContext;
    default:
      return state;
  }
};

const initialContext = {
  problem: null,
  goals: [],
  targetAudience: {
    role: null,
    experience: null,
    verified: false
  },
  constraints: {
    time: null,
    budget: null,
    technical: []
  },
  requirements: {
    mustHave: [],
    niceToHave: []
  },
  techStack: [],
  difficulty: null
};

export default function CourseCreationStudio() {
  const navigate = useNavigate();
  const [context, dispatch] = useReducer(contextReducer, initialContext);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save context to localStorage
  useEffect(() => {
    const saveContext = () => {
      try {
        localStorage.setItem('course_creation_context', JSON.stringify(context));
      } catch (error) {
        console.error('Error saving context:', error);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveContext, 500);
    return () => clearTimeout(timeoutId);
  }, [context]);

  // Load context from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('course_creation_context');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'UPDATE_CONTEXT', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading context:', error);
    }
  }, []);

  const handleContextUpdate = (newContext) => {
    dispatch({ type: 'UPDATE_CONTEXT', payload: newContext });
  };

  const handleEditContext = (section) => {
    // For now, just log the section being edited
    // In a full implementation, this would open an edit modal
    console.log('Edit context section:', section);
  };

  const handleGenerate = async (finalContext) => {
    console.log('Generating course with context:', finalContext);

    // TODO: Call the backend API to generate the course
    try {
      // For now, navigate to the course generator page with the context
      // In a full implementation, this would:
      // 1. Call the backend API with the context
      // 2. Wait for the course to be generated
      // 3. Navigate to the generated course

      // Placeholder: navigate to course generator
      navigate('/generate-course', {
        state: {
          prefillData: {
            topic: finalContext.problem?.statement || '',
            level: finalContext.difficulty || 'intermediate',
            targetAudience: finalContext.targetAudience?.role || '',
            learningObjectives: finalContext.goals?.map(g => g.text || g).join('\n') || '',
            prerequisites: finalContext.techStack?.join('\n') || '',
            includeAssessments: true,
            includeProjects: true
          }
        }
      });
    } catch (error) {
      console.error('Error generating course:', error);
      alert('Failed to generate course. Please try again.');
    }
  };

  return (
    <NavigationLayout
      selectedSection="studio"
      bottomContent={
        <ContextCollectorChat
          context={context}
          onContextUpdate={handleContextUpdate}
        />
      }
      rightPane={
        <RightPaneContent>
          <StudioHeader>
            <StudioTitle>
              <h1>Course Creation Studio</h1>
              <p>AI-powered conversational course design</p>
            </StudioTitle>
            <StudioActions>
              <SystemPromptViewer />
            </StudioActions>
          </StudioHeader>
          <ArtifactWrapper>
            <ContextArtifact
              context={context}
              onGenerate={handleGenerate}
              onEditContext={handleEditContext}
            />
          </ArtifactWrapper>
        </RightPaneContent>
      }
    />
  );
}
