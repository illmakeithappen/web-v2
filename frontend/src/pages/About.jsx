import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const AboutContainer = styled.div`
  padding: var(--spacing-xxl) 0;
`

const HeroSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-beige);
  text-align: center;
  border-bottom: 3px solid var(--gitthub-black);
`

const PageTitle = styled.h1`
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.03em;
`

const PageSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--gitthub-gray);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`

const ContentSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: ${props => props.$alt ? 'var(--gitthub-light-beige)' : 'var(--gitthub-beige)'};
  border-bottom: 3px solid var(--gitthub-black);
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${props => props.$reverse ? '1fr 1fr' : '1fr 1fr'};
  gap: var(--spacing-xxl);
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  ${props => props.$reverse && `
    @media (min-width: 1025px) {
      > *:first-child {
        order: 2;
      }
    }
  `}
`

const ContentText = styled.div`
  h2 {
    font-size: clamp(2rem, 3vw, 2.5rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.125rem;
    color: var(--gitthub-gray);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }
`

const ContentVisual = styled.div`
  background: var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xxl);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(232, 221, 212, 0.05) 10px,
      rgba(232, 221, 212, 0.05) 20px
    );
    animation: slide 20s linear infinite;
  }

  @keyframes slide {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
`

const VisualContent = styled.div`
  color: var(--gitthub-beige);
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  z-index: 1;
  position: relative;
`

const ValuesSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
`

const ValuesHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);

  h2 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: 1.25rem;
    color: var(--gitthub-light-beige);
    max-width: 800px;
    margin: 0 auto;
  }
`

const ValuesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
`

const ValueCard = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  border: 2px solid var(--gitthub-beige);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: var(--gitthub-beige);
    color: var(--gitthub-black);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: var(--spacing-md);
  }

  p {
    line-height: 1.6;
  }
`

const TeamSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-beige);
`

const TeamHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);

  h2 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.25rem;
    color: var(--gitthub-gray);
    max-width: 800px;
    margin: 0 auto;
  }
`

const TeamStats = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TeamStat = styled.div`
  padding: var(--spacing-xl);
  background: var(--gitthub-light-beige);
  border-radius: var(--radius-lg);
  border: 3px solid var(--gitthub-black);

  h3 {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: var(--spacing-sm);
  }

  p {
    font-size: 1.1rem;
    color: var(--gitthub-gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`

const CTASection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-light-beige);
  text-align: center;
`

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: 1.25rem;
    color: var(--gitthub-gray);
    margin-bottom: var(--spacing-xl);
    line-height: 1.8;
  }
`

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border: 2px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`

function About() {
  return (
    <AboutContainer>
      <HeroSection>
        <PageTitle>About gitthub</PageTitle>
        <PageSubtitle>
          Pioneering the intersection of data science, artificial intelligence, 
          and storytelling to create meaningful impact.
        </PageSubtitle>
      </HeroSection>

      <ContentSection>
        <ContentWrapper>
          <ContentText>
            <h2>Our Mission</h2>
            <p>
              At gitthub, we believe in the transformative power of data. Our mission 
              is to democratize access to advanced analytics and AI technologies, 
              enabling organizations of all sizes to make informed, data-driven decisions.
            </p>
            <p>
              We combine cutting-edge technology with deep domain expertise to deliver 
              solutions that not only solve complex problems but also tell compelling 
              stories through data visualization and journalism.
            </p>
          </ContentText>
          <ContentVisual>
            <VisualContent>Mission</VisualContent>
          </ContentVisual>
        </ContentWrapper>
      </ContentSection>

      <ContentSection $alt>
        <ContentWrapper $reverse>
          <ContentText>
            <h2>Our Approach</h2>
            <p>
              We take a holistic approach to data science, combining technical excellence 
              with creative storytelling. Our interdisciplinary team brings together 
              expertise in machine learning, statistics, journalism, and design.
            </p>
            <p>
              Every project begins with understanding your unique challenges and goals. 
              We then apply our expertise to develop tailored solutions that deliver 
              measurable results and actionable insights.
            </p>
          </ContentText>
          <ContentVisual>
            <VisualContent>Approach</VisualContent>
          </ContentVisual>
        </ContentWrapper>
      </ContentSection>

      <ValuesSection>
        <ValuesHeader>
          <h2>Our Core Values</h2>
          <p>The principles that guide everything we do</p>
        </ValuesHeader>
        <ValuesGrid>
          <ValueCard>
            <h3>Innovation</h3>
            <p>Pushing boundaries with cutting-edge technology and creative solutions</p>
          </ValueCard>
          <ValueCard>
            <h3>Integrity</h3>
            <p>Maintaining the highest standards of ethics and transparency in our work</p>
          </ValueCard>
          <ValueCard>
            <h3>Impact</h3>
            <p>Creating meaningful change through data-driven insights and solutions</p>
          </ValueCard>
          <ValueCard>
            <h3>Collaboration</h3>
            <p>Working together with clients as partners in their success journey</p>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>

      <TeamSection>
        <TeamHeader>
          <h2>Our Team</h2>
          <p>
            A diverse group of data scientists, engineers, journalists, and designers 
            united by a passion for innovation
          </p>
        </TeamHeader>
        <TeamStats>
          <TeamStat>
            <h3>25+</h3>
            <p>Expert Professionals</p>
          </TeamStat>
          <TeamStat>
            <h3>10+</h3>
            <p>Disciplines</p>
          </TeamStat>
          <TeamStat>
            <h3>5+</h3>
            <p>Years Experience</p>
          </TeamStat>
        </TeamStats>
      </TeamSection>

      <ContentSection>
        <ContentWrapper>
          <ContentText>
            <h2>Technology Stack</h2>
            <p>
              We leverage the latest technologies and frameworks to deliver robust, 
              scalable solutions. Our expertise spans Python, R, TensorFlow, PyTorch, 
              and cloud platforms including AWS, Google Cloud, and Azure.
            </p>
            <p>
              From real-time data processing to advanced neural networks, we have the 
              technical capabilities to tackle any data challenge.
            </p>
          </ContentText>
          <ContentVisual>
            <VisualContent>Tech</VisualContent>
          </ContentVisual>
        </ContentWrapper>
      </ContentSection>

      <CTASection>
        <CTAContent>
          <h2>Let's Work Together</h2>
          <p>
            Ready to unlock the potential of your data? We're here to help you 
            navigate the journey from raw data to actionable insights.
          </p>
          <Button to="/contact">Get in Touch</Button>
        </CTAContent>
      </CTASection>
    </AboutContainer>
  )
}

export default About