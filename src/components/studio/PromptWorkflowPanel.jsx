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
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--gitthub-black);
  background: var(--gitthub-light-beige);
`;

const PanelTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const WorkflowSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom,
    rgba(250, 250, 250, 0.5),
    rgba(245, 245, 245, 0.5)
  );
`;

const FlowchartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Lucida Grande', sans-serif;
`;

const FlowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FlowStep = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: ${props => props.$clickable ? '0.5rem 0.75rem' : '0.4rem 0.65rem'};
  background: ${props => props.$highlight ?
    'linear-gradient(to bottom, rgba(255, 165, 0, 0.15), rgba(255, 165, 0, 0.25))' :
    'white'
  };
  border: 1px solid ${props => props.$highlight ?
    'rgba(255, 165, 0, 0.4)' :
    'rgba(0, 0, 0, 0.15)'
  };
  border-radius: 4px;
  font-weight: ${props => props.$highlight ? '600' : '500'};
  color: var(--gitthub-black);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.15s ease;

  ${props => props.$clickable && `
    &:hover {
      background: ${props.$highlight ?
        'linear-gradient(to bottom, rgba(255, 165, 0, 0.25), rgba(255, 165, 0, 0.35))' :
        'linear-gradient(to bottom, #f8f8f8, #f0f0f0)'
      };
      border-color: ${props.$highlight ?
        'rgba(255, 165, 0, 0.6)' :
        'rgba(0, 0, 0, 0.25)'
      };
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const PromptBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 0.3rem;
  background: ${props => props.$active ?
    'linear-gradient(to bottom, #FFA500, #FF8C00)' :
    'linear-gradient(to bottom, #666, #555)'
  };
  color: white;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Arrow = styled.span`
  color: #999;
  font-weight: 700;
  font-size: 0.85rem;
`;

export default function PromptWorkflowPanel({ prompts, selectedTab, onSelectTab }) {
  // Get array of prompt names
  const promptNames = Array.isArray(prompts) ? prompts : Object.keys(prompts || {});

  // Find index of selected prompt for highlighting in workflow
  const selectedIndex = promptNames.indexOf(selectedTab);

  return (
    <PanelContainer>
      <ContentFrame>
        <PanelHeader>
          <PanelTitle>
            <span>🔄</span>
            Course Generation Workflow
          </PanelTitle>
        </PanelHeader>

        <ScrollableContent>
          <WorkflowSection>
            <FlowchartContainer>
              {/* Phase 1: User Input */}
              <FlowRow>
                <FlowStep>
                  📝 User Input
                </FlowStep>
                <Arrow>→</Arrow>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  topic, level, duration
                </FlowStep>
              </FlowRow>

              {/* Phase 2: Course Structure Generation */}
              <FlowRow style={{ marginTop: '0.5rem' }}>
                <Arrow style={{ fontSize: '1rem' }}>↓</Arrow>
              </FlowRow>

              <FlowRow>
                <FlowStep
                  $highlight={selectedIndex === 0}
                  $clickable
                  onClick={() => onSelectTab(promptNames[0])}
                  title={promptNames[0]}
                >
                  <PromptBadge $active={selectedIndex === 0}>1</PromptBadge>
                  Course Outline
                </FlowStep>
                <Arrow>→</Arrow>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  title, description, modules
                </FlowStep>
              </FlowRow>

              {/* Phase 3: Module Content Generation */}
              <FlowRow style={{ marginTop: '0.5rem' }}>
                <Arrow style={{ fontSize: '1rem' }}>↓</Arrow>
              </FlowRow>

              <FlowRow>
                <FlowStep
                  $highlight={selectedIndex === 1}
                  $clickable
                  onClick={() => onSelectTab(promptNames[1])}
                  title={promptNames[1]}
                >
                  <PromptBadge $active={selectedIndex === 1}>2</PromptBadge>
                  Module Content
                </FlowStep>
                <Arrow>→</Arrow>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  lessons, examples, exercises
                </FlowStep>
              </FlowRow>

              {/* Phase 4: Assessment & Project Generation (Conditional) */}
              <FlowRow style={{ marginTop: '0.75rem' }}>
                <FlowStep style={{ opacity: 0.5, fontSize: '0.7rem', fontStyle: 'italic' }}>
                  ⤷ if enabled
                </FlowStep>
              </FlowRow>

              <FlowRow>
                <FlowStep
                  $highlight={selectedIndex === 2}
                  $clickable
                  onClick={() => onSelectTab(promptNames[2])}
                  title={promptNames[2]}
                >
                  <PromptBadge $active={selectedIndex === 2}>3</PromptBadge>
                  Assessments
                </FlowStep>
                <Arrow>+</Arrow>
                <FlowStep
                  $highlight={selectedIndex === 3}
                  $clickable
                  onClick={() => onSelectTab(promptNames[3])}
                  title={promptNames[3]}
                >
                  <PromptBadge $active={selectedIndex === 3}>4</PromptBadge>
                  Projects
                </FlowStep>
              </FlowRow>

              <FlowRow style={{ marginTop: '0.5rem' }}>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  quizzes, scenarios, hands-on tasks
                </FlowStep>
              </FlowRow>

              {/* Phase 5: Cross-Cutting Concerns */}
              <FlowRow style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(0,0,0,0.15)' }}>
                <FlowStep style={{ fontSize: '0.7rem', fontStyle: 'italic', opacity: 0.7 }}>
                  🔄 Applied Throughout:
                </FlowStep>
              </FlowRow>

              <FlowRow>
                <FlowStep
                  $highlight={selectedIndex === 4}
                  $clickable
                  onClick={() => onSelectTab(promptNames[4])}
                  title={promptNames[4]}
                >
                  <PromptBadge $active={selectedIndex === 4}>5</PromptBadge>
                  Style & Tone
                </FlowStep>
                <Arrow>+</Arrow>
                <FlowStep
                  $highlight={selectedIndex === 5}
                  $clickable
                  onClick={() => onSelectTab(promptNames[5])}
                  title={promptNames[5]}
                >
                  <PromptBadge $active={selectedIndex === 5}>6</PromptBadge>
                  Best Practices
                </FlowStep>
              </FlowRow>

              <FlowRow style={{ marginTop: '0.5rem' }}>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  consistency, pedagogy, engagement
                </FlowStep>
              </FlowRow>

              {/* Final Output */}
              <FlowRow style={{ marginTop: '0.75rem' }}>
                <Arrow style={{ fontSize: '1rem' }}>↓</Arrow>
              </FlowRow>

              <FlowRow>
                <FlowStep style={{
                  background: 'linear-gradient(to bottom, rgba(36, 161, 72, 0.15), rgba(36, 161, 72, 0.25))',
                  borderColor: 'rgba(36, 161, 72, 0.4)',
                  fontWeight: '600'
                }}>
                  ✅ Complete Course
                </FlowStep>
                <Arrow>→</Arrow>
                <FlowStep style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                  JSON output
                </FlowStep>
              </FlowRow>
            </FlowchartContainer>
          </WorkflowSection>
        </ScrollableContent>
      </ContentFrame>
    </PanelContainer>
  );
}
