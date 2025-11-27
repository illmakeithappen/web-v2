import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

// Get API URL from environment or use relative path
const API_URL = import.meta.env.VITE_API_URL || ''

const ContactContainer = styled.div`
  padding: var(--spacing-xxl) 0;
  min-height: calc(100vh - 160px);
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

const ContactSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-light-beige);
`

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ContactForm = styled.form`
  background: var(--gitthub-beige);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
`

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.02em;
`

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`

const Label = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--gitthub-black);
  font-size: 1.1rem;
`

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1rem;
  border: 2px solid var(--gitthub-black);
  border-radius: var(--radius-sm);
  background: var(--gitthub-light-beige);
  color: var(--gitthub-black);
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: var(--gitthub-white);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: var(--gitthub-gray);
    opacity: 0.6;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1rem;
  border: 2px solid var(--gitthub-black);
  border-radius: var(--radius-sm);
  background: var(--gitthub-light-beige);
  color: var(--gitthub-black);
  font-family: inherit;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: var(--gitthub-white);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: var(--gitthub-gray);
    opacity: 0.6;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
  font-weight: 700;
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border: 2px solid var(--gitthub-black);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Message = styled.div`
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-md);
  font-weight: 600;
  text-align: center;

  ${props => props.$success ? `
    background: #d4edda;
    color: #155724;
    border: 2px solid #155724;
  ` : `
    background: #f8d7da;
    color: #721c24;
    border: 2px solid #721c24;
  `}
`

const ContactInfo = styled.div`
  padding: var(--spacing-xl);
`

const InfoSection = styled.div`
  margin-bottom: var(--spacing-xxl);

  h3 {
    font-size: 1.75rem;
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    letter-spacing: -0.01em;
  }

  p {
    color: var(--gitthub-gray);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }
`

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`

const ContactMethod = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
`

const IconBox = styled.div`
  width: 50px;
  height: 50px;
  background: var(--gitthub-black);
  color: var(--gitthub-beige);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const ContactDetails = styled.div`
  h4 {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: var(--spacing-xs);
  }

  p {
    color: var(--gitthub-gray);
    line-height: 1.6;
  }

  a {
    color: var(--gitthub-black);
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`

const FAQSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: var(--gitthub-beige);
  border-top: 3px solid var(--gitthub-black);
`

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);

  h2 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
  }
`

const FAQGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: var(--spacing-lg);
`

const FAQItem = styled.div`
  background: var(--gitthub-light-beige);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);

  h3 {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--gitthub-gray);
    line-height: 1.6;
  }
`

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)

    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData)
      if (response.status === 200) {
        setResponseMessage({ type: 'success', text: 'Thank you for your message! We\'ll get back to you soon.' })
        setFormData({ name: '', email: '', company: '', message: '' })
      }
    } catch (error) {
      setResponseMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. Simple analytics projects can be completed in 2-4 weeks, while comprehensive AI implementations may take 3-6 months.'
    },
    {
      question: 'Do you work with small businesses?',
      answer: 'Absolutely! We work with organizations of all sizes, from startups to enterprises. Our solutions are tailored to fit your specific needs and budget.'
    },
    {
      question: 'What industries do you specialize in?',
      answer: 'We have experience across multiple industries including finance, healthcare, retail, technology, and media. Our data science expertise is applicable to any data-driven challenge.'
    },
    {
      question: 'Can you help with data infrastructure?',
      answer: 'Yes, we provide end-to-end data solutions including infrastructure design, data pipeline development, and cloud architecture implementation.'
    }
  ]

  return (
    <ContactContainer>
      <HeroSection>
        <PageTitle>Get in Touch</PageTitle>
        <PageSubtitle>
          Ready to transform your data into insights? Let's discuss how we can help.
        </PageSubtitle>
      </HeroSection>

      <ContactSection>
        <ContactContent>
          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Send Us a Message</FormTitle>
            
            <FormGroup>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="company">Company</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or question..."
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </SubmitButton>

            {responseMessage && (
              <Message $success={responseMessage.type === 'success'}>
                {responseMessage.text}
              </Message>
            )}
          </ContactForm>

          <ContactInfo>
            <InfoSection>
              <h3>Let's Start a Conversation</h3>
              <p>
                Whether you're looking to implement AI solutions, need help with data analysis, 
                or want to explore how data can transform your business, we're here to help.
              </p>
              <p>
                Our team of experts is ready to understand your unique challenges and 
                develop tailored solutions that deliver real results.
              </p>
            </InfoSection>

            <ContactMethods>
              <ContactMethod>
                <IconBox>📧</IconBox>
                <ContactDetails>
                  <h4>Email</h4>
                  <p><a href="mailto:info@gitthub.org">info@gitthub.org</a></p>
                </ContactDetails>
              </ContactMethod>

              <ContactMethod>
                <IconBox>📍</IconBox>
                <ContactDetails>
                  <h4>Location</h4>
                  <p>Frankfurt am Main, Germany</p>
                </ContactDetails>
              </ContactMethod>

              <ContactMethod>
                <IconBox>💬</IconBox>
                <ContactDetails>
                  <h4>Response Time</h4>
                  <p>We typically respond within 24 hours</p>
                </ContactDetails>
              </ContactMethod>
            </ContactMethods>
          </ContactInfo>
        </ContactContent>
      </ContactSection>

      <FAQSection>
        <FAQHeader>
          <h2>Frequently Asked Questions</h2>
        </FAQHeader>
        <FAQGrid>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </FAQItem>
          ))}
        </FAQGrid>
      </FAQSection>
    </ContactContainer>
  )
}

export default Contact