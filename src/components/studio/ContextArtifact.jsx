import React, { useState } from 'react';
import styled from 'styled-components';
import ContextCard from './ContextCard';
import EmptySlot from './EmptySlot';
import CompletenessBar from './CompletenessBar';
import { calculateCompleteness } from '../../utils/contextExtractor';

const ArtifactContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
  overflow-y: auto;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gitthub-black);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
  gap: 1rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCard = styled.div`
  grid-column: 1 / -1;
`;

const GenerateButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const GenerateButton = styled.button`
  padding: 1rem 2.5rem;
  background: ${props => props.disabled ? 'var(--gitthub-gray)' : 'var(--gitthub-black)'};
  color: white;
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-size: 1.125rem;
  font-weight: 700;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: ${props => props.disabled ? 'none' : 'var(--shadow-md)'};
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const DifficultyGauge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
`;

const GaugeLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
`;

const GaugeBar = styled.div`
  flex: 1;
  height: 12px;
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const GaugeFill = styled.div`
  height: 100%;
  width: ${props => {
    switch (props.$level) {
      case 'beginner': return '33%';
      case 'intermediate': return '66%';
      case 'advanced': return '100%';
      default: return '0%';
    }
  }};
  background: ${props => {
    switch (props.$level) {
      case 'beginner': return 'linear-gradient(90deg, #24a148, #34c958)';
      case 'intermediate': return 'linear-gradient(90deg, #f1c21b, #fcdc2b)';
      case 'advanced': return 'linear-gradient(90deg, #da1e28, #fa2e38)';
      default: return 'transparent';
    }
  }};
  transition: width 0.5s ease;
`;

const GaugeText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gitthub-black);
  min-width: 100px;
  text-align: right;
  text-transform: capitalize;
`;

const AudienceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const BadgeIcon = styled.div`
  font-size: 2rem;
`;

const BadgeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BadgeTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gitthub-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BadgeValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gitthub-black);
`;

export default function ContextArtifact({
  context,
  onGenerate,
  onEditContext
}) {
  const [completeness] = useState(() => calculateCompleteness(context));

  const handleEditProblem = () => {
    if (onEditContext) {
      onEditContext('problem');
    }
  };

  const handleEditGoals = () => {
    if (onEditContext) {
      onEditContext('goals');
    }
  };

  const handleEditAudience = () => {
    if (onEditContext) {
      onEditContext('audience');
    }
  };

  const handleGenerate = () => {
    if (completeness >= 70 && onGenerate) {
      onGenerate(context);
    }
  };

  // Calculate breakdown for completeness bar
  const breakdown = [
    { label: 'Problem', completed: !!context.problem?.statement },
    { label: 'Goals', completed: context.goals?.length > 0 },
    { label: 'Audience', completed: !!context.targetAudience?.role },
    { label: 'Requirements', completed: context.requirements?.mustHave?.length > 0 },
    { label: 'Tech Stack', completed: context.techStack?.length > 0 },
    { label: 'Difficulty', completed: !!context.difficulty }
  ];

  return (
    <ArtifactContainer>
      {/* Hero: Problem Statement */}
      <Section>
        <SectionTitle>The Problem</SectionTitle>
        {context.problem?.statement ? (
          <HeroCard>
            <ContextCard
              icon="🎯"
              title="Problem Statement"
              content={context.problem.statement}
              severity={context.problem.severity}
              verified={context.problem.verified}
              editable={true}
              onClick={handleEditProblem}
              badge={context.problem.severity ? {
                text: context.problem.severity,
                variant: context.problem.severity
              } : null}
            />
          </HeroCard>
        ) : (
          <EmptySlot
            icon="🎯"
            label="Problem Statement"
            hint="Tell the chatbot what problem you're solving"
            minHeight="140px"
          />
        )}
      </Section>

      {/* Goals & Objectives */}
      <Section>
        <SectionTitle>Goals & Objectives</SectionTitle>
        <Grid $columns="repeat(auto-fit, minmax(250px, 1fr))">
          {context.goals && context.goals.length > 0 ? (
            context.goals.slice(0, 4).map((goal, index) => (
              <ContextCard
                key={index}
                icon="🎲"
                title={`Goal ${index + 1}`}
                content={goal.text || goal}
                verified={goal.verified}
                editable={true}
                onClick={handleEditGoals}
              />
            ))
          ) : (
            <>
              <EmptySlot icon="🎲" label="Goal 1" hint="What do you want to achieve?" />
              <EmptySlot icon="🎲" label="Goal 2" hint="Another objective?" />
            </>
          )}
        </Grid>
      </Section>

      {/* Target Audience */}
      <Section>
        <SectionTitle>Target Audience</SectionTitle>
        {context.targetAudience?.role || context.targetAudience?.experience ? (
          <AudienceBadge>
            <BadgeIcon>👥</BadgeIcon>
            <BadgeContent>
              <BadgeTitle>Target Audience</BadgeTitle>
              <BadgeValue>
                {context.targetAudience.role && context.targetAudience.experience
                  ? `${context.targetAudience.experience} ${context.targetAudience.role}`
                  : context.targetAudience.role || context.targetAudience.experience}
              </BadgeValue>
            </BadgeContent>
          </AudienceBadge>
        ) : (
          <EmptySlot
            icon="👥"
            label="Target Audience"
            hint="Who is this for?"
          />
        )}
      </Section>

      {/* Constraints */}
      {(context.constraints?.time || context.constraints?.technical?.length > 0) && (
        <Section>
          <SectionTitle>Constraints</SectionTitle>
          <Grid $columns="1fr">
            <ContextCard
              icon="⏱️"
              title="Constraints"
              items={[
                context.constraints.time && `Time: ${context.constraints.time}`,
                context.constraints.budget && `Budget: ${context.constraints.budget}`,
                ...(context.constraints.technical || [])
              ].filter(Boolean)}
            />
          </Grid>
        </Section>
      )}

      {/* Requirements */}
      <Section>
        <SectionTitle>Requirements</SectionTitle>
        <Grid $columns="repeat(auto-fit, minmax(250px, 1fr))">
          {context.requirements?.mustHave && context.requirements.mustHave.length > 0 ? (
            <ContextCard
              icon="✓"
              title="Must Have"
              items={context.requirements.mustHave}
            />
          ) : (
            <EmptySlot
              icon="✓"
              label="Must Have"
              hint="Essential requirements"
            />
          )}

          {context.requirements?.niceToHave && context.requirements.niceToHave.length > 0 ? (
            <ContextCard
              icon="✨"
              title="Nice to Have"
              items={context.requirements.niceToHave}
            />
          ) : (
            <EmptySlot
              icon="✨"
              label="Nice to Have"
              hint="Optional features"
            />
          )}
        </Grid>
      </Section>

      {/* Technology Stack */}
      {context.techStack && context.techStack.length > 0 && (
        <Section>
          <SectionTitle>Technology Stack</SectionTitle>
          <Grid $columns="1fr">
            <ContextCard
              icon="💡"
              title="Technologies"
              tags={context.techStack}
            />
          </Grid>
        </Section>
      )}

      {/* Difficulty Level */}
      <Section>
        <SectionTitle>Difficulty Level</SectionTitle>
        {context.difficulty ? (
          <DifficultyGauge>
            <GaugeLabel>Level:</GaugeLabel>
            <GaugeBar>
              <GaugeFill $level={context.difficulty} />
            </GaugeBar>
            <GaugeText>{context.difficulty}</GaugeText>
          </DifficultyGauge>
        ) : (
          <EmptySlot
            icon="📊"
            label="Difficulty Level"
            hint="What's your experience level?"
          />
        )}
      </Section>

      {/* Completeness Bar */}
      <Section>
        <CompletenessBar
          percentage={completeness}
          showBreakdown={true}
          breakdown={breakdown}
        />
      </Section>

      {/* Generate Button */}
      <GenerateButtonContainer>
        <GenerateButton
          onClick={handleGenerate}
          disabled={completeness < 70}
        >
          {completeness >= 70 ? '🚀 Generate Course' : '🔒 Need More Context'}
        </GenerateButton>
      </GenerateButtonContainer>
    </ArtifactContainer>
  );
}
