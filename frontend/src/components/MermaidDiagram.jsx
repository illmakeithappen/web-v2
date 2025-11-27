import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import styled from 'styled-components'

const DiagramContainer = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f6f8fa;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow-x: auto;

  svg {
    max-width: 100%;
    height: auto;
  }
`

const ErrorMessage = styled.div`
  color: #d73a49;
  padding: 1rem;
  background: #ffeef0;
  border: 1px solid #f97583;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
`

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'system-ui, -apple-system, sans-serif'
})

const MermaidDiagram = ({ chart }) => {
  const elementRef = useRef(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !elementRef.current) return

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err.message || 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <ErrorMessage>
        <strong>Mermaid Error:</strong> {error}
      </ErrorMessage>
    )
  }

  return (
    <DiagramContainer
      ref={elementRef}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default MermaidDiagram
