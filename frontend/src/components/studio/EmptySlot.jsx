import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SlotContainer = styled.div`
  background: var(--gitthub-light-beige);
  border: 3px dashed var(--gitthub-gray);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.$minHeight || '120px'};
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2s ease-in-out infinite;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--gitthub-black);
    animation: none;
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.03),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s linear infinite;
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: grayscale(0.5) opacity(0.5);
`;

const Label = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Hint = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-light-gray);
  text-align: center;
  margin-top: 0.25rem;
  font-style: italic;
`;

export default function EmptySlot({
  icon = '❓',
  label = 'Waiting for information',
  hint = null,
  minHeight = '120px'
}) {
  return (
    <SlotContainer $minHeight={minHeight}>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
      {hint && <Hint>{hint}</Hint>}
    </SlotContainer>
  );
}
