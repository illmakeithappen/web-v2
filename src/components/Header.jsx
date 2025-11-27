import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const HeaderContainer = styled.header`
  background-color: ${props => props.$scrolled ? 'rgba(255, 241, 229, 0.95)' : '#FFF1E5'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 2px solid var(--gitthub-black);
  backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};

  ${props => props.$scrolled && `
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  `}
`

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 var(--spacing-md);
  }
`

const Logo = styled(Link)`
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--gitthub-black);
  letter-spacing: -0.05em;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`;

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: #FFF1E5;
    flex-direction: column;
    padding: var(--spacing-lg);
    border-bottom: 2px solid var(--gitthub-black);
    transform: translateY(${props => props.$open ? '0' : '-100%'});
    opacity: ${props => props.$open ? '1' : '0'};
    pointer-events: ${props => props.$open ? 'all' : 'none'};
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`

const NavLink = styled(Link)`
  color: var(--gitthub-black);
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: var(--spacing-xs) 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--gitthub-black);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  ${props => props.$active && `
    &::after {
      width: 100%;
      background: #FFA500;
    }
  `}

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: var(--spacing-sm) 0;
  }
`

const UserIcon = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #002FA7;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 47, 167, 0.3);
    background: #0039CE;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    display: block;
    width: 100%;
    height: 3px;
    background: var(--gitthub-black);
    transition: all 0.3s ease;
    transform-origin: center;

    &:nth-child(1) {
      transform: ${props => props.$open ? 'translateY(10.5px) rotate(45deg)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${props => props.$open ? '0' : '1'};
    }

    &:nth-child(3) {
      transform: ${props => props.$open ? 'translateY(-10.5px) rotate(-45deg)' : 'none'};
    }
  }
`

function Header() {
  const location = useLocation()
  const { isAuthenticated, user, getUserAttributes } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userAttributes, setUserAttributes] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const fetchUserAttributes = async () => {
      if (isAuthenticated && user) {
        try {
          const attributes = await getUserAttributes()
          setUserAttributes(attributes)
        } catch (error) {
          console.error('Error fetching user attributes:', error)
        }
      } else {
        setUserAttributes(null)
      }
    }

    fetchUserAttributes()
  }, [isAuthenticated, user, getUserAttributes])

  // Navigation items - hub and docs visible to all users
  const navItems = [
    { path: '/doc', label: 'docs' },
    { path: '/hub', label: 'hub' }
  ]

  const getUserInitial = () => {
    if (userAttributes?.name) {
      return userAttributes.name.charAt(0).toUpperCase()
    }
    if (userAttributes?.email) {
      return userAttributes.email.charAt(0).toUpperCase()
    }
    return ''
  }

  const getUserName = () => {
    return userAttributes?.name || userAttributes?.email || 'User'
  }

  return (
    <HeaderContainer $scrolled={scrolled}>
      <Nav>
        <Logo to="/">gitthub</Logo>
        <NavContainer>
          <NavLinks $open={menuOpen}>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={
                  location.pathname === item.path ||
                  (item.path === '/courses' && location.pathname === '/hub') ||
                  (item.path === '/hub' && location.pathname === '/courses') ||
                  (item.path === '/hub' && location.pathname === '/create-course')
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <NavLink to="/auth">
                Sign In
              </NavLink>
            )}
          </NavLinks>
          {isAuthenticated && (
            <UserIcon to="/profile" title={`${getUserName()} - View Profile`}>
              {getUserInitial()}
            </UserIcon>
          )}
          <MenuButton
            $open={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </MenuButton>
        </NavContainer>
      </Nav>
    </HeaderContainer>
  )
}

export default Header