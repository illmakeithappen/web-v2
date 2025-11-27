import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { testimonials } from '../data/testimonials'

const HomeContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
`

const HeroSection = styled.section`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: white;
  padding: var(--spacing-xxl) var(--spacing-lg);

  @media (max-width: 768px) {
    min-height: calc(100vh - 70px);
    padding: var(--spacing-xl) var(--spacing-md);
  }
`

const HeroContent = styled.div`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`

const HeroText = styled.div`
  animation: fadeInUp 1s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.03em;
  text-align: center;

  span {
    display: block;
    background: linear-gradient(135deg, var(--gitthub-black) 0%, var(--gitthub-gray) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .indented {
    padding-left: 4rem;
  }
  
  .indented-small {
    padding-left: 1rem;
  }
`

const HeroSubtitle = styled.p`
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--gitthub-gray);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-top: 5rem;
`

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  text-align: center;
  min-width: 150px;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #ffb366 0%, #ffa347 100%);
    color: white;
    border: none;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 600;
    padding: 1.2rem 3rem;
    border-radius: 12px;
    box-shadow:
      0 4px 15px rgba(255, 163, 71, 0.35),
      0 2px 4px rgba(255, 179, 102, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-3px);
      box-shadow:
        0 8px 25px rgba(255, 163, 71, 0.5),
        0 4px 10px rgba(255, 179, 102, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
      background: linear-gradient(135deg, #ffc280 0%, #ffb366 100%);
    }

    &:active {
      transform: translateY(-1px);
      box-shadow:
        0 3px 10px rgba(255, 163, 71, 0.4),
        0 2px 4px rgba(255, 179, 102, 0.25);
    }
  ` : `
    background: transparent;
    color: var(--gitthub-black);
    border: 2px solid var(--gitthub-black);

    &:hover {
      background: var(--gitthub-black);
      color: var(--gitthub-beige);
      transform: translateY(-3px);
    }
  `}
`

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`

const DataVisualization = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin-top: -2rem;

  @media (max-width: 1024px) {
    width: 100%;
    height: 160px;
    margin-top: -1rem;
  }
`

const TestimonialsContainer = styled.div`
  width: 100%;
  max-width: 700px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  perspective: 1000px;
  padding: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 160px;
    padding: 15px;
    max-width: 500px;
  }
`

const Testimonial = styled.div`
  font-size: 3rem;
  font-weight: 600;
  font-style: italic;
  text-align: center;
  width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  line-height: 1.3;
  position: absolute;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Word = styled.span`
  display: inline-flex;
  white-space: nowrap;
`

const Character = styled.span`
  display: inline-block;
  color: var(--gitthub-gray);
  text-shadow:
    0 0 10px rgba(100, 100, 100, 0.1),
    0 0 20px rgba(100, 100, 100, 0.05),
    0 2px 8px rgba(100, 100, 100, 0.15);
  min-width: ${props => props.$isSpace ? '0.5em' : 'auto'};
  padding: 0 4px;
  perspective: 600px;
  transform-style: preserve-3d;
  transition: all 0.05s ease-in-out;
  animation: subtleGlow 3s ease-in-out infinite;

  @keyframes subtleGlow {
    0%, 100% {
      text-shadow:
        0 0 10px rgba(100, 100, 100, 0.1),
        0 0 20px rgba(100, 100, 100, 0.05),
        0 2px 8px rgba(100, 100, 100, 0.15);
    }
    50% {
      text-shadow:
        0 0 15px rgba(100, 100, 100, 0.15),
        0 0 25px rgba(100, 100, 100, 0.08),
        0 2px 10px rgba(100, 100, 100, 0.2);
    }
  }

  ${props => props.$flipping && `
    animation: flipChar 0.1s ease-in-out infinite, subtleGlow 3s ease-in-out infinite;
  `}

  @keyframes flipChar {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(90deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }
`


function Home() {
  const [displayedText, setDisplayedText] = useState(testimonials[0])
  const [flippingChars, setFlippingChars] = useState(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [targetTextRef, setTargetTextRef] = useState(testimonials[0])

  // Random characters to cycle through during flip
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ"\'!?.,- @#$%&*'

  // Split-flap animation - all characters flip simultaneously with random timing
  useEffect(() => {
    const startTransition = () => {
      const nextIndex = (currentIndex + 1) % testimonials.length
      const targetText = testimonials[nextIndex]

      // Store target text for reference
      setTargetTextRef(targetText)

      // Immediately adjust displayedText length to match target
      setDisplayedText(prev => {
        if (prev.length < targetText.length) {
          // Pad with spaces
          return prev + ' '.repeat(targetText.length - prev.length)
        } else if (prev.length > targetText.length) {
          // Trim
          return prev.substring(0, targetText.length)
        }
        return prev
      })

      const timeouts = []
      const intervals = []
      const charStates = []

      // For each character position
      for (let i = 0; i < targetText.length; i++) {
        const targetChar = targetText[i]

        // Random start delay (0-200ms)
        const startDelay = Math.random() * 200

        // Random flip duration (600-1100ms)
        const flipDuration = 600 + Math.random() * 500

        // Start flipping after random delay
        const startTimeout = setTimeout(() => {
          setFlippingChars(prev => new Set(prev).add(i))

          // Cycle through random characters
          const flipInterval = setInterval(() => {
            const randomChar = randomChars[Math.floor(Math.random() * randomChars.length)]
            setDisplayedText(prev => {
              const chars = prev.split('')
              if (i < chars.length) {
                chars[i] = randomChar
              }
              return chars.join('')
            })
          }, 60)

          intervals.push(flipInterval)

          // Stop flipping after duration and set final character
          const stopTimeout = setTimeout(() => {
            clearInterval(flipInterval)
            setFlippingChars(prev => {
              const newSet = new Set(prev)
              newSet.delete(i)
              return newSet
            })
            setDisplayedText(prev => {
              const chars = prev.split('')
              if (i < chars.length) {
                chars[i] = targetChar
              }
              return chars.join('')
            })
          }, flipDuration)

          timeouts.push(stopTimeout)
        }, startDelay)

        timeouts.push(startTimeout)
      }

      // Update index after animation completes
      setTimeout(() => {
        setCurrentIndex(nextIndex)
        setDisplayedText(targetText) // Ensure final text is exact
      }, 1400) // Wait for longest possible animation

      // Cleanup function
      return () => {
        timeouts.forEach(t => clearTimeout(t))
        intervals.forEach(i => clearInterval(i))
      }
    }

    // Initial delay
    const initialTimeout = setTimeout(startTransition, 2500)

    // Repeat every 6 seconds
    const repeatInterval = setInterval(startTransition, 6000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(repeatInterval)
    }
  }, [currentIndex])

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroText>
            <HeroTitle>
              <span>Navigate</span>
              <span className="indented">Educate</span>
              <span>Deploy</span>
            </HeroTitle>
          </HeroText>
          <HeroVisual>
            <DataVisualization>
              <TestimonialsContainer>
                <Testimonial>
                  {(() => {
                    let charIndex = 0
                    const words = displayedText.split(' ')

                    return words.map((word, wordIdx) => (
                      <Word key={`word-${wordIdx}`}>
                        {word.split('').map((char) => {
                          const idx = charIndex++
                          return (
                            <Character
                              key={`char-${idx}`}
                              $flipping={flippingChars.has(idx)}
                              $isSpace={false}
                            >
                              {char}
                            </Character>
                          )
                        })}
                        {wordIdx < words.length - 1 && (
                          <Character
                            key={`space-${charIndex}`}
                            $flipping={flippingChars.has(charIndex++)}
                            $isSpace={true}
                          >
                            {'\u00A0'}
                          </Character>
                        )}
                      </Word>
                    ))
                  })()}
                </Testimonial>
              </TestimonialsContainer>
            </DataVisualization>
            <ButtonGroup>
              <Button to="/doc" $primary>
                README.md
              </Button>
            </ButtonGroup>
          </HeroVisual>
        </HeroContent>
      </HeroSection>
    </HomeContainer>
  )
}

export default Home