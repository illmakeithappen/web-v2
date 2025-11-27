import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.2;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--gitthub-gray);
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }
`;

function MyDesigns() {
  return (
    <Container>
      <Icon>📁</Icon>
      <Title>My Designs</Title>
      <Description>
        Save your workflows and designs here. This feature will allow you to persist your work,
        share designs with others, and load previous projects.
      </Description>
      <Button>Coming Soon</Button>
    </Container>
  );
}

export default MyDesigns;
