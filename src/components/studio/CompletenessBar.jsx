import React from 'react';
import styled, { keyframes } from 'styled-components';

const fillAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: var(--target-width);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(36, 161, 72, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(36, 161, 72, 0);
  }
`;

const Container = styled.div`
  width: 100%;
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const Percentage = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${props => {
    if (props.$value >= 70) return '#24a148';
    if (props.$value >= 40) return '#f1c21b';
    return '#da1e28';
  }};
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div`
  --target-width: ${props => props.$percentage}%;
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => {
    if (props.$percentage >= 70) {
      return 'linear-gradient(90deg, #24a148 0%, #34c958 100%)';
    }
    if (props.$percentage >= 40) {
      return 'linear-gradient(90deg, #f1c21b 0%, #fcdc2b 100%)';
    }
    return 'linear-gradient(90deg, #da1e28 0%, #fa2e38 100%)';
  }};
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${props => props.$animate ? fillAnimation : 'none'} 0.8s ease-out;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${props => props.$percentage >= 70 ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

const StatusText = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 600;
`;

const Breakdown = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--gitthub-beige);
`;

const BreakdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
`;

const BreakdownDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$filled ? '#24a148' : 'var(--gitthub-gray)'};
`;

const BreakdownLabel = styled.span`
  color: ${props => props.$filled ? 'var(--gitthub-black)' : 'var(--gitthub-gray)'};
  font-weight: ${props => props.$filled ? '600' : '400'};
`;

export default function CompletenessBar({
  percentage = 0,
  showBreakdown = false,
  breakdown = null,
  animate = true
}) {
  const getStatusText = () => {
    if (percentage >= 70) return 'Ready to generate course!';
    if (percentage >= 40) return 'Getting there, keep adding details...';
    return 'Just getting started...';
  };

  return (
    <Container>
      <Header>
        <Title>Context Completeness</Title>
        <Percentage $value={percentage}>{percentage}%</Percentage>
      </Header>

      <BarContainer>
        <BarFill $percentage={percentage} $animate={animate} />
      </BarContainer>

      <StatusText>{getStatusText()}</StatusText>

      {showBreakdown && breakdown && (
        <Breakdown>
          {breakdown.map((item, index) => (
            <BreakdownItem key={index}>
              <BreakdownDot $filled={item.completed} />
              <BreakdownLabel $filled={item.completed}>{item.label}</BreakdownLabel>
            </BreakdownItem>
          ))}
        </Breakdown>
      )}
    </Container>
  );
}
