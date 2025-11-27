import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatWindow from '../components/ChatWindow';

const ProfileContainer = styled.div`
  height: 100%;
  background: #faf9f7;
  overflow: hidden;
`;

const ProfileCard = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  background: linear-gradient(to bottom,
    rgba(236, 236, 236, 0.95) 0%,
    rgba(220, 220, 220, 0.95) 3%,
    rgba(232, 232, 232, 0.95) 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  overflow: hidden;
  backdrop-filter: blur(20px);
`;

const ProfileHeader = styled.div`
  background: linear-gradient(to bottom,
    rgba(230, 230, 230, 0.98) 0%,
    rgba(210, 210, 210, 0.98) 50%,
    rgba(200, 200, 200, 0.98) 100%
  );
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const ProfileTitle = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
  color: var(--gitthub-black);
`;

const ProfileBody = styled.div`
  padding: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.active ? 'var(--gitthub-black)' : 'var(--gitthub-gray)'};
  font-weight: ${props => props.active ? '700' : '600'};
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)'};
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

const ChatSection = styled.div`
  margin-top: 1rem;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.5);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gitthub-black);
`;

const StatLabel = styled.div`
  color: var(--gitthub-gray);
  font-size: 0.875rem;
  font-weight: 500;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.75rem;
  color: var(--gitthub-black);
  font-size: 1rem;
  font-weight: 700;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  font-size: 0.875rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--gitthub-gray);
`;

const InfoValue = styled.span`
  color: var(--gitthub-black);
  font-weight: 500;
`;

const APIKeysSection = styled.div`
  margin-bottom: 1.5rem;
`;

const APIKeyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const APIKeyStatus = styled.span`
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.configured ? '#d4edda' : '#f8d7da'};
  color: ${props => props.configured ? '#155724' : '#721c24'};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gitthub-gray);
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 238, 238, 0.9);
  border: 1px solid rgba(255, 204, 204, 0.8);
  color: #c00;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SignOutButton = styled.button`
  background: var(--gitthub-black);
  color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2a2a2a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function UserProfile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, getUserAttributes, signOut, loading } = useAuth();
  const [userAttributes, setUserAttributes] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    fetchUserAttributes();
  }, [isAuthenticated, navigate]);

  const fetchUserAttributes = async () => {
    try {
      if (user) {
        const attributes = await getUserAttributes();
        setUserAttributes(attributes);
      }
    } catch (err) {
      setError('Failed to load user profile');
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      navigate('/');
    } catch (err) {
      setError('Failed to sign out');
    } finally {
      setSigningOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ProfileContainer>
        <LoadingMessage>Redirecting to authentication...</LoadingMessage>
      </ProfileContainer>
    );
  }

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <ProfileBody>
            <ErrorMessage>{error}</ErrorMessage>
          </ProfileBody>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>User Dashboard</ProfileTitle>
        </ProfileHeader>

        <ProfileBody>
          <TabContainer>
            <Tab
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </Tab>
            <Tab
              active={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
            >
              AI Chat
            </Tab>
          </TabContainer>

          {activeTab === 'profile' && (
            <div>
              <StatsGrid>
                <StatCard>
                  <StatLabel>Courses Created:</StatLabel>
                  <StatNumber>0</StatNumber>
                </StatCard>
                <StatCard>
                  <StatLabel>Daily Limit:</StatLabel>
                  <StatNumber>5</StatNumber>
                </StatCard>
                <StatCard>
                  <StatLabel>Monthly Limit:</StatLabel>
                  <StatNumber>100</StatNumber>
                </StatCard>
                <StatCard>
                  <StatLabel>Subscription:</StatLabel>
                  <StatNumber>Free</StatNumber>
                </StatCard>
              </StatsGrid>

              <InfoSection>
                <InfoTitle>Account Information</InfoTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Email:</InfoLabel>
                    <InfoValue>{userAttributes?.email || 'Not available'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Full Name:</InfoLabel>
                    <InfoValue>{userAttributes?.name || 'Not available'}</InfoValue>
                  </InfoItem>
                  {userAttributes?.['custom:organization'] && (
                    <InfoItem>
                      <InfoLabel>Organization:</InfoLabel>
                      <InfoValue>{userAttributes['custom:organization']}</InfoValue>
                    </InfoItem>
                  )}
                  <InfoItem>
                    <InfoLabel>User ID:</InfoLabel>
                    <InfoValue>{userAttributes?.sub || 'Not available'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email Verified:</InfoLabel>
                    <InfoValue>{userAttributes?.email_verified === 'true' ? 'Yes' : 'No'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </InfoSection>

              <APIKeysSection>
                <InfoTitle>API Keys</InfoTitle>
                <APIKeyItem>
                  <InfoLabel>OpenAI API Key</InfoLabel>
                  <APIKeyStatus configured={false}>
                    Not Configured
                  </APIKeyStatus>
                </APIKeyItem>
                <APIKeyItem>
                  <InfoLabel>Anthropic API Key</InfoLabel>
                  <APIKeyStatus configured={false}>
                    Not Configured
                  </APIKeyStatus>
                </APIKeyItem>
                <APIKeyItem>
                  <InfoLabel>Google API Key</InfoLabel>
                  <APIKeyStatus configured={false}>
                    Not Configured
                  </APIKeyStatus>
                </APIKeyItem>
              </APIKeysSection>

              <SignOutButton 
                onClick={handleSignOut} 
                disabled={signingOut}
              >
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </SignOutButton>
            </div>
          )}

          {activeTab === 'chat' && (
            <ChatSection>
              <ChatWindow />
            </ChatSection>
          )}
        </ProfileBody>
      </ProfileCard>
    </ProfileContainer>
  );
}

export default UserProfile;