import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  background-color: var(--gitthub-black);
  color: var(--gitthub-beige);
  padding: var(--spacing-xxl) 0 var(--spacing-lg);
  margin-top: 0;
`

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FooterSection = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
    font-weight: 900;
  }

  p {
    color: var(--gitthub-light-beige);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }
`

const FooterLogo = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  margin-bottom: var(--spacing-md);
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`

const FooterLink = styled(Link)`
  color: var(--gitthub-light-beige);
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: var(--gitthub-beige);
    transform: translateX(5px);
  }
`

const ExternalLink = styled.a`
  color: var(--gitthub-light-beige);
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: var(--gitthub-beige);
    transform: translateX(5px);
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border: 2px solid var(--gitthub-light-beige);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--gitthub-light-beige);

  &:hover {
    background: var(--gitthub-beige);
    color: var(--gitthub-black);
    border-color: var(--gitthub-beige);
    transform: translateY(-3px);
  }
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  color: var(--gitthub-light-beige);
  
  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
`

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  border-top: 1px solid var(--gitthub-gray);
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--gitthub-light-beige);
  font-size: 0.9rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
`

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>gitthub</FooterLogo>
          <p>
            Transforming data into insights. We specialize in AI solutions, 
            data journalism, and cutting-edge analytics to help organizations 
            make data-driven decisions.
          </p>
          <SocialLinks>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/services">Services</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/auth">Login</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Services</h3>
          <FooterLinks>
            <FooterLink to="/services">Data Analysis</FooterLink>
            <FooterLink to="/services">AI Solutions</FooterLink>
            <FooterLink to="/services">Data Journalism</FooterLink>
            <FooterLink to="/services">Consulting</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <ContactInfo>
            <span>📧 info@gitthub.org</span>
            <span>📍 Frankfurt, Germany</span>
            <span>🌐 www.gitthub.org</span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <div>© 2025 gitthub. All rights reserved.</div>
        <div>
          <Link to="/privacy" style={{ color: 'inherit', marginRight: '20px' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'inherit' }}>Terms of Service</Link>
        </div>
      </FooterBottom>
    </FooterContainer>
  )
}

export default Footer