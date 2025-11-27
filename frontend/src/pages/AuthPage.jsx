import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PostgresAuth from '../components/PostgresAuth';

const AuthContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const AuthLeft = styled.div`
  background: linear-gradient(135deg, var(--gitthub-black) 0%, var(--gitthub-gray) 100%);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 968px) {
    padding: 2rem;
  }
`;

const Logo = styled.h1`
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: 900;
  letter-spacing: -0.05em;

  @media (max-width: 968px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.6;
`;

const AuthBody = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 968px) {
    padding: 2rem;
  }
`;


const GuestLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gitthub-light-beige);
`;

const GuestButton = styled.button`
  background: none;
  border: 2px solid var(--gitthub-gray);
  color: var(--gitthub-gray);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    border-color: var(--gitthub-black);
    color: var(--gitthub-black);
  }
`;

const Features = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 6px;
  margin-top: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: white;
  opacity: 0.95;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '✓';
    display: inline-block;
    width: 24px;
    height: 24px;
    background: #4caf50;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    margin-right: 0.75rem;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

function AuthPage() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Navigate to courses page after successful authentication
    navigate('/courses');
  };

  const handleGuestAccess = () => {
    // Clear any existing auth
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/courses');
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthLeft>
          <Logo>gitthub</Logo>
          <Tagline>Your workbench for learning to work with AI</Tagline>
          <Features>
            <FeatureList>
              <FeatureItem>Access to hub learning lab</FeatureItem>
              <FeatureItem>Build AI workflows in src</FeatureItem>
              <FeatureItem>Save progress and projects</FeatureItem>
              <FeatureItem>Track your learning journey</FeatureItem>
            </FeatureList>
          </Features>
        </AuthLeft>

        <AuthBody>
          <PostgresAuth onSuccess={handleAuthSuccess} />

          <GuestLink>
            <p style={{ marginBottom: '1rem', color: 'var(--gitthub-gray)' }}>
              Or continue as guest
            </p>
            <GuestButton onClick={handleGuestAccess}>
              Continue as Guest
            </GuestButton>
          </GuestLink>
        </AuthBody>
      </AuthCard>
    </AuthContainer>
  );
}

export default AuthPage;
