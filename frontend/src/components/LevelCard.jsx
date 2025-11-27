import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none'};
  }
`;

const LevelBadge = styled.div`
  display: inline-block;
  background: ${props => {
    switch(props.$level) {
      case 1: return '#4CAF50';
      case 2: return '#FF9800';
      case 3: return '#9C27B0';
      default: return 'var(--gitthub-black)';
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
`;

const LevelTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const LevelSubtitle = styled.div`
  font-size: 1.1rem;
  color: var(--gitthub-gray);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const SkillItem = styled.li`
  display: flex;
  align-items: start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;

  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: ${props => {
      switch(props.$level) {
        case 1: return '#4CAF50';
        case 2: return '#FF9800';
        case 3: return '#9C27B0';
        default: return 'var(--gitthub-black)';
      }
    }};
    color: white;
    border-radius: 50%;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const Duration = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--gitthub-light-beige);
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  margin-top: 1rem;

  &::before {
    content: '⏱️';
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IconDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--gitthub-light-beige);
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active ? 'var(--gitthub-black)' : '#ddd'};
  transition: all 0.3s;
`;

function LevelCard({
  level = 1,
  title,
  subtitle,
  description,
  skills = [],
  duration,
  icon,
  onClick,
  buttonText = "Start Learning",
  showProgress = false,
  currentStep = 0,
  totalSteps = 0,
  clickable = true
}) {

  const getLevelColor = (lvl) => {
    switch(lvl) {
      case 1: return '#4CAF50';
      case 2: return '#FF9800';
      case 3: return '#9C27B0';
      default: return 'var(--gitthub-black)';
    }
  };

  const getLevelName = (lvl) => {
    switch(lvl) {
      case 1: return 'Level 1: Fundamentals';
      case 2: return 'Level 2: Intermediate';
      case 3: return 'Level 3: Advanced';
      default: return `Level ${lvl}`;
    }
  };

  return (
    <Card $clickable={clickable} onClick={clickable ? onClick : undefined}>
      {icon && <IconDisplay>{icon}</IconDisplay>}

      <LevelBadge $level={level}>
        {getLevelName(level)}
      </LevelBadge>

      <LevelTitle>{title}</LevelTitle>

      {subtitle && <LevelSubtitle>{subtitle}</LevelSubtitle>}

      {description && (
        <LevelSubtitle style={{ fontSize: '0.95rem', marginTop: '1rem' }}>
          {description}
        </LevelSubtitle>
      )}

      {skills.length > 0 && (
        <SkillsList>
          {skills.map((skill, index) => (
            <SkillItem key={index} $level={level}>
              {skill}
            </SkillItem>
          ))}
        </SkillsList>
      )}

      {duration && <Duration>{duration}</Duration>}

      {showProgress && totalSteps > 0 && (
        <ProgressIndicator>
          {[...Array(totalSteps)].map((_, index) => (
            <ProgressDot key={index} $active={index < currentStep} />
          ))}
          <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--gitthub-gray)' }}>
            {currentStep} / {totalSteps} steps
          </span>
        </ProgressIndicator>
      )}

      {onClick && clickable && (
        <ActionButton onClick={(e) => { e.stopPropagation(); onClick(); }}>
          {buttonText}
        </ActionButton>
      )}
    </Card>
  );
}

export default LevelCard;
