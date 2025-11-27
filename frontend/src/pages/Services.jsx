import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ServicesContainer = styled.div`
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

const ServicesSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-light-beige);
  border-bottom: 3px solid var(--gitthub-black);
`

const ServicesGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ServiceCard = styled.div`
  background: var(--gitthub-beige);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    &::before {
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: var(--gitthub-black);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
`

const ServiceIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  font-weight: 900;
`

const ServiceTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.01em;
`

const ServiceDescription = styled.p`
  color: var(--gitthub-gray);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: var(--spacing-lg);
`

const ServiceFeature = styled.li`
  padding: var(--spacing-sm) 0;
  color: var(--gitthub-gray);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  &::before {
    content: '✓';
    font-weight: bold;
    color: var(--gitthub-black);
    font-size: 1.2rem;
  }
`

const ServiceLink = styled.button`
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`

const ProcessSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border-bottom: 3px solid var(--gitthub-black);
`

const ProcessHeader = styled.div`
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

const ProcessSteps = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 10%;
    right: 10%;
    height: 2px;
    background: var(--gitthub-light-beige);
    opacity: 0.3;
    z-index: 0;

    @media (max-width: 1024px) {
      display: none;
    }
  }
`

const ProcessStep = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
`

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  margin: 0 auto var(--spacing-md);
  border: 3px solid var(--gitthub-beige);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
`

const StepDescription = styled.p`
  color: var(--gitthub-light-beige);
  font-size: 0.95rem;
  line-height: 1.6;
`

const TestimonialsSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-beige);
  border-bottom: 3px solid var(--gitthub-black);
`

const TestimonialsHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);

  h2 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    letter-spacing: -0.02em;
  }
`

const TestimonialCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: var(--gitthub-light-beige);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;

  p {
    font-size: 1.25rem;
    line-height: 1.8;
    color: var(--gitthub-gray);
    margin-bottom: var(--spacing-lg);
    font-style: italic;
  }

  cite {
    font-style: normal;
    font-weight: 700;
    display: block;
    color: var(--gitthub-black);
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

function Services() {
  const services = [
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics and visualization.',
      features: [
        'Exploratory Data Analysis',
        'Statistical Modeling',
        'Interactive Dashboards',
        'Real-time Analytics',
        'Custom Reports'
      ]
    },
    {
      icon: '🤖',
      title: 'AI & Machine Learning',
      description: 'Build intelligent systems that learn from data and improve over time.',
      features: [
        'Predictive Modeling',
        'Natural Language Processing',
        'Computer Vision',
        'Deep Learning',
        'Model Deployment'
      ]
    },
    {
      icon: '📰',
      title: 'Data Journalism',
      description: 'Tell compelling stories backed by data-driven research and visualization.',
      features: [
        'Data Investigation',
        'Story Development',
        'Interactive Visualizations',
        'Fact Checking',
        'Publication Support'
      ]
    },
    {
      icon: '🎯',
      title: 'Business Intelligence',
      description: 'Enable data-driven decision making across your organization.',
      features: [
        'KPI Development',
        'Performance Tracking',
        'Competitive Analysis',
        'Market Research',
        'Strategy Consulting'
      ]
    },
    {
      icon: '⚙️',
      title: 'Data Engineering',
      description: 'Build robust data infrastructure for scalable analytics.',
      features: [
        'Data Pipeline Development',
        'ETL/ELT Processes',
        'Data Warehouse Design',
        'Cloud Architecture',
        'API Development'
      ]
    },
    {
      icon: '🎓',
      title: 'Training & Workshops',
      description: 'Empower your team with data literacy and technical skills.',
      features: [
        'Custom Training Programs',
        'Hands-on Workshops',
        'Data Literacy',
        'Tool Training',
        'Best Practices'
      ]
    }
  ]

  const processSteps = [
    {
      number: '1',
      title: 'Discovery',
      description: 'Understanding your needs and defining objectives'
    },
    {
      number: '2',
      title: 'Analysis',
      description: 'Deep dive into your data and requirements'
    },
    {
      number: '3',
      title: 'Development',
      description: 'Building and testing tailored solutions'
    },
    {
      number: '4',
      title: 'Deployment',
      description: 'Implementation and continuous optimization'
    }
  ]

  return (
    <ServicesContainer>
      <HeroSection>
        <PageTitle>Our Services</PageTitle>
        <PageSubtitle>
          Comprehensive data solutions designed to accelerate your 
          digital transformation and drive business growth.
        </PageSubtitle>
      </HeroSection>

      <ServicesSection>
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, idx) => (
                  <ServiceFeature key={idx}>{feature}</ServiceFeature>
                ))}
              </ServiceFeatures>
              <ServiceLink>Learn More →</ServiceLink>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>

      <ProcessSection>
        <ProcessHeader>
          <h2>Our Process</h2>
          <p>A proven methodology that delivers results</p>
        </ProcessHeader>
        <ProcessSteps>
          {processSteps.map((step, index) => (
            <ProcessStep key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </ProcessStep>
          ))}
        </ProcessSteps>
      </ProcessSection>

      <TestimonialsSection>
        <TestimonialsHeader>
          <h2>Client Success Stories</h2>
        </TestimonialsHeader>
        <TestimonialCard>
          <p>
            "gitthub transformed our data chaos into clear insights. Their team's 
            expertise in both technical implementation and strategic thinking helped 
            us make data-driven decisions that increased our efficiency by 40%."
          </p>
          <cite>— Director of Operations, Tech Startup</cite>
        </TestimonialCard>
      </TestimonialsSection>

      <CTASection>
        <CTAContent>
          <h2>Ready to Get Started?</h2>
          <p>
            Let's discuss how our services can help you achieve your data goals 
            and drive meaningful business outcomes.
          </p>
          <Button to="/contact">Schedule a Consultation</Button>
        </CTAContent>
      </CTASection>
    </ServicesContainer>
  )
}

export default Services