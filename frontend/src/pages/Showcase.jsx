import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LevelCard from '../components/LevelCard';
import PromptTester from '../components/PromptTester';
import { exampleCourse } from '../data/exampleCourse';
import examplePrompts from '../data/examplePrompts';

const ShowcaseContainer = styled.div`
  min-height: 100vh;
  background: var(--gitthub-white);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--gitthub-light-beige) 0%, #fff 100%);
  border-bottom: 3px solid var(--gitthub-black);
  padding: 4rem 2rem;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  font-weight: 900;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: var(--gitthub-gray);
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CourseInfo = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const InfoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;

  span:first-child {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: var(--gitthub-gray);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LevelSection = styled.section`
  margin: 4rem 0;
  padding: 3rem;
  background: ${props => {
    switch(props.$level) {
      case 1: return '#f1f8f4';
      case 2: return '#fff8f0';
      case 3: return '#f3e5f5';
      default: return 'white';
    }
  }};
  border-radius: 8px;
  border: 3px solid var(--gitthub-black);
`;

const LevelHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LevelNumber = styled.div`
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    switch(props.$level) {
      case 1: return '#4CAF50';
      case 2: return '#FF9800';
      case 3: return '#9C27B0';
      default: return 'var(--gitthub-black)';
    }
  }};
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const LevelName = styled.h3`
  font-size: 2rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const LevelDesc = styled.p`
  font-size: 1.1rem;
  color: var(--gitthub-gray);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SkillHighlight = styled.div`
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const SkillTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  font-weight: 700;
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--gitthub-light-beige);
  border-radius: 4px;

  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: ${props => props.$color || 'var(--gitthub-black)'};
    color: white;
    border-radius: 50%;
    font-weight: 700;
    flex-shrink: 0;
  }
`;

const WorkflowDiagram = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

const WorkflowSteps = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
`;

const WorkflowStep = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: var(--gitthub-gray);
  }

  @media (max-width: 768px) {
    &:not(:last-child)::after {
      content: '↓';
      right: auto;
      top: auto;
      bottom: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const CTASection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--gitthub-light-beige);
  border-top: 3px solid var(--gitthub-black);
  margin-top: 4rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  font-weight: 700;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 1.2rem 3rem;
  background: var(--gitthub-black);
  color: white;
  border-radius: 4px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 1.2rem 3rem;
  background: white;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
    transform: translateY(-3px);
  }
`;

const ProgressionPath = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 3rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProgressionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -2rem;
    font-size: 2rem;
    color: var(--gitthub-gray);

    @media (max-width: 768px) {
      content: '↓';
      right: auto;
      bottom: -1.5rem;
    }
  }
`;

const ProgressionIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$color || 'var(--gitthub-black)'};
  color: white;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressionLabel = styled.div`
  font-weight: 700;
  color: var(--gitthub-black);
  text-align: center;
  max-width: 150px;
`;

function Showcase() {
  const [activeLevel, setActiveLevel] = useState(1);

  const levels = exampleCourse.modules;

  const scrollToLevel = (level) => {
    setActiveLevel(level);
    const element = document.getElementById(`level-${level}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ShowcaseContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Build Your First AI Assistant</HeroTitle>
          <HeroSubtitle>
            An interactive tutorial that takes you from basic prompts to building an autonomous AI agent.
            Learn by doing, with real code and immediate results.
          </HeroSubtitle>

          <CourseInfo>
            <InfoBadge>
              <span>📚</span>
              <span>{exampleCourse.modules.length} Modules</span>
            </InfoBadge>
            <InfoBadge>
              <span>⏱️</span>
              <span>{exampleCourse.duration}</span>
            </InfoBadge>
            <InfoBadge>
              <span>🎯</span>
              <span>{exampleCourse.level}</span>
            </InfoBadge>
          </CourseInfo>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <SectionTitle>Your Learning Journey</SectionTitle>
        <SectionDescription>
          This course demonstrates gitthub's core philosophy: progressive skill building through hands-on practice.
          You'll start with simple prompts and progressively build toward sophisticated AI systems.
        </SectionDescription>

        <ProgressionPath>
          <ProgressionItem>
            <ProgressionIcon $color="#4CAF50">1</ProgressionIcon>
            <ProgressionLabel>Prompt Engineering Basics</ProgressionLabel>
          </ProgressionItem>
          <ProgressionItem>
            <ProgressionIcon $color="#FF9800">2</ProgressionIcon>
            <ProgressionLabel>Multi-Step Workflows</ProgressionLabel>
          </ProgressionItem>
          <ProgressionItem>
            <ProgressionIcon $color="#9C27B0">3</ProgressionIcon>
            <ProgressionLabel>Agentic Behavior</ProgressionLabel>
          </ProgressionItem>
        </ProgressionPath>

        <LevelsGrid>
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level.level}
              title={level.levelName}
              subtitle={level.title}
              description={level.description}
              skills={level.learningObjectives}
              duration={level.duration}
              onClick={() => scrollToLevel(level.level)}
              buttonText="Explore This Level"
            />
          ))}
        </LevelsGrid>

        {/* Level 1: Interactive Section */}
        <LevelSection id="level-1" $level={1}>
          <LevelHeader>
            <LevelNumber $level={1}>1</LevelNumber>
            <LevelName>{levels[0].levelName}</LevelName>
            <LevelDesc>{levels[0].description}</LevelDesc>
          </LevelHeader>

          <SkillHighlight>
            <SkillTitle>What You'll Master</SkillTitle>
            <SkillGrid>
              {levels[0].learningObjectives.map((objective, index) => (
                <SkillItem key={index} $color="#4CAF50">
                  {objective}
                </SkillItem>
              ))}
            </SkillGrid>
          </SkillHighlight>

          <PromptTester
            examplePrompts={examplePrompts.level1.prompts}
            currentLevel={1}
          />
        </LevelSection>

        {/* Level 2: Workflow Visualization */}
        <LevelSection id="level-2" $level={2}>
          <LevelHeader>
            <LevelNumber $level={2}>2</LevelNumber>
            <LevelName>{levels[1].levelName}</LevelName>
            <LevelDesc>{levels[1].description}</LevelDesc>
          </LevelHeader>

          <SkillHighlight>
            <SkillTitle>What You'll Master</SkillTitle>
            <SkillGrid>
              {levels[1].learningObjectives.map((objective, index) => (
                <SkillItem key={index} $color="#FF9800">
                  {objective}
                </SkillItem>
              ))}
            </SkillGrid>
          </SkillHighlight>

          <WorkflowDiagram>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Daily Briefing Workflow
            </h4>
            <p style={{ color: 'var(--gitthub-gray)', marginBottom: '2rem' }}>
              Learn to chain prompts and integrate tools for automated intelligence
            </p>
            <WorkflowSteps>
              <WorkflowStep>Fetch News</WorkflowStep>
              <WorkflowStep>Filter Articles</WorkflowStep>
              <WorkflowStep>Summarize</WorkflowStep>
              <WorkflowStep>Aggregate</WorkflowStep>
              <WorkflowStep>Deliver</WorkflowStep>
            </WorkflowSteps>
            <p style={{ fontSize: '0.9rem', color: 'var(--gitthub-gray)', marginTop: '1.5rem' }}>
              Each step feeds the next, creating compound value through systematic processing
            </p>
          </WorkflowDiagram>

          <PromptTester
            examplePrompts={examplePrompts.level2.prompts}
            currentLevel={2}
          />
        </LevelSection>

        {/* Level 3: Agentic Concepts */}
        <LevelSection id="level-3" $level={3}>
          <LevelHeader>
            <LevelNumber $level={3}>3</LevelNumber>
            <LevelName>{levels[2].levelName}</LevelName>
            <LevelDesc>{levels[2].description}</LevelDesc>
          </LevelHeader>

          <SkillHighlight>
            <SkillTitle>What You'll Master</SkillTitle>
            <SkillGrid>
              {levels[2].learningObjectives.map((objective, index) => (
                <SkillItem key={index} $color="#9C27B0">
                  {objective}
                </SkillItem>
              ))}
            </SkillGrid>
          </SkillHighlight>

          <WorkflowDiagram>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              From Scripted to Intelligent
            </h4>
            <p style={{ color: 'var(--gitthub-gray)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Agents don't just execute steps—they learn preferences, make contextual decisions,
              and improve autonomously based on outcomes.
            </p>
            <SkillGrid style={{ marginTop: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
                <strong>Learns Preferences</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--gitthub-gray)', marginTop: '0.5rem' }}>
                  Observes behavior and adapts
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                <strong>Makes Decisions</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--gitthub-gray)', marginTop: '0.5rem' }}>
                  Autonomous judgment, not just rules
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                <strong>Self-Improves</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--gitthub-gray)', marginTop: '0.5rem' }}>
                  Reflects and optimizes performance
                </p>
              </div>
            </SkillGrid>
          </WorkflowDiagram>

          <PromptTester
            examplePrompts={examplePrompts.level3.prompts}
            currentLevel={3}
          />
        </LevelSection>
      </MainContent>

      <CTASection>
        <CTATitle>Ready to Build Your Own?</CTATitle>
        <CTADescription>
          This example shows what's possible with gitthub. The full platform helps you design,
          plan, and build ANY AI project—with personalized courses adapted to your skill level.
        </CTADescription>

        <CTAButtons>
          <PrimaryButton to="/src">
            Design Your Project
          </PrimaryButton>
          <SecondaryButton to="/generate-course">
            Generate a Course
          </SecondaryButton>
          <SecondaryButton to="/doc">
            Learn More
          </SecondaryButton>
        </CTAButtons>

        <div style={{ marginTop: '3rem', fontSize: '0.95rem', color: 'var(--gitthub-gray)', maxWidth: '700px', margin: '3rem auto 0' }}>
          <strong>What makes gitthub different:</strong> You're not just following tutorials—you're learning
          to work with foundational AI models through real projects you actually want to build. Skills that
          last, not just today's tools.
        </div>
      </CTASection>
    </ShowcaseContainer>
  );
}

export default Showcase;
