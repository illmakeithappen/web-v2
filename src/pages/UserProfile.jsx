import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(to bottom,
    rgba(236, 236, 236, 0.95) 0%,
    rgba(220, 220, 220, 0.95) 3%,
    rgba(232, 232, 232, 0.95) 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
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
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gitthub-black);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  color: var(--gitthub-black);
`;

const UserEmail = styled.div`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VerifiedBadge = styled.span`
  background: #d4edda;
  color: #155724;
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
`;

const MemberSince = styled.div`
  color: var(--gitthub-gray);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const ProfileBody = styled.div`
  padding: 1.5rem 2rem 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--gitthub-black);
  line-height: 1;
`;

const StatLabel = styled.div`
  color: var(--gitthub-gray);
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  font-size: 0.9rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--gitthub-gray);
`;

const InfoValue = styled.span`
  color: var(--gitthub-black);
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyableId = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: var(--gitthub-black);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: ${props => props.$primary ? 'var(--gitthub-black)' : 'rgba(255, 255, 255, 0.6)'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${props => props.$primary ? '#2a2a2a' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf9f7;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 238, 238, 0.9);
  border: 1px solid rgba(255, 204, 204, 0.8);
  color: #c00;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: rgba(212, 237, 218, 0.9);
  border: 1px solid rgba(195, 230, 203, 0.8);
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

function UserProfile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    workflows: 0,
    skills: 0,
    mcpServers: 0,
    subagents: 0
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchAllCounts();
    }
  }, [isAuthenticated, loading, navigate, user]);

  const fetchAllCounts = async () => {
    try {
      // Fetch all counts in parallel
      const [projectsRes, workflowsRes, skillsRes, mcpRes, subagentsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('workflows')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('skills')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('mcp_servers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('subagents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      setStats({
        projects: projectsRes.count || 0,
        workflows: workflowsRes.count || 0,
        skills: skillsRes.count || 0,
        mcpServers: mcpRes.count || 0,
        subagents: subagentsRes.count || 0
      });
    } catch (err) {
      console.error('Error fetching counts:', err);
      // Don't show error - just default to 0
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

  const handleChangePassword = () => {
    navigate('/auth?mode=reset');
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user?.id || '');
      setCopied(true);
      setSuccessMessage('User ID copied to clipboard');
      setTimeout(() => {
        setCopied(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get user data from Supabase auth
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const organization = user?.user_metadata?.organization || null;
  const emailVerified = user?.email_confirmed_at != null;
  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

  // Generate initials for avatar
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoadingContainer>
        <LoadingMessage>Redirecting to authentication...</LoadingMessage>
      </LoadingContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <Avatar>{getInitials(fullName)}</Avatar>
          <HeaderInfo>
            <UserName>{fullName}</UserName>
            <UserEmail>
              {email}
              {emailVerified && <VerifiedBadge>Verified</VerifiedBadge>}
            </UserEmail>
            {createdAt && (
              <MemberSince>Member since {formatDate(createdAt)}</MemberSince>
            )}
          </HeaderInfo>
        </ProfileHeader>

        <ProfileBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <Section>
            <SectionTitle>Your Content</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatNumber>{stats.projects}</StatNumber>
                <StatLabel>Projects</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.workflows}</StatNumber>
                <StatLabel>Workflows</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.skills}</StatNumber>
                <StatLabel>Skills</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.mcpServers}</StatNumber>
                <StatLabel>MCP Servers</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.subagents}</StatNumber>
                <StatLabel>Subagents</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <SectionTitle>Activity</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatNumber>{formatRelativeTime(lastSignIn)}</StatNumber>
                <StatLabel>Last Active</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <SectionTitle>Account Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Full Name</InfoLabel>
                <InfoValue>{fullName}</InfoValue>
              </InfoItem>
              {organization && (
                <InfoItem>
                  <InfoLabel>Organization</InfoLabel>
                  <InfoValue>{organization}</InfoValue>
                </InfoItem>
              )}
              <InfoItem>
                <InfoLabel>User ID</InfoLabel>
                <CopyableId onClick={copyUserId} title="Click to copy">
                  {copied ? 'Copied!' : user?.id || 'Not available'}
                </CopyableId>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>Quick Actions</SectionTitle>
            <ButtonGroup>
              <Button onClick={handleChangePassword}>
                Change Password
              </Button>
              <Button
                $primary
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </ButtonGroup>
          </Section>
        </ProfileBody>
      </ProfileCard>
    </ProfileContainer>
  );
}

export default UserProfile;
