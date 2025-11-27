import React from 'react'
import styled from 'styled-components'

// Callout type configurations matching Obsidian's colors
const CALLOUT_TYPES = {
  note: {
    color: '#448aff',
    icon: '📝',
    background: '#e3f2fd'
  },
  abstract: {
    color: '#00b0ff',
    icon: '📄',
    background: '#e1f5fe'
  },
  info: {
    color: '#00b8d4',
    icon: 'ℹ️',
    background: '#e0f7fa'
  },
  tip: {
    color: '#00bfa5',
    icon: '💡',
    background: '#e0f2f1'
  },
  success: {
    color: '#00c853',
    icon: '✅',
    background: '#e8f5e9'
  },
  question: {
    color: '#64dd17',
    icon: '❓',
    background: '#f1f8e9'
  },
  warning: {
    color: '#ff9100',
    icon: '⚠️',
    background: '#fff3e0'
  },
  failure: {
    color: '#ff5252',
    icon: '❌',
    background: '#ffebee'
  },
  danger: {
    color: '#ff1744',
    icon: '🔥',
    background: '#ffebee'
  },
  bug: {
    color: '#f50057',
    icon: '🐛',
    background: '#fce4ec'
  },
  example: {
    color: '#7c4dff',
    icon: '📋',
    background: '#ede7f6'
  },
  quote: {
    color: '#9e9e9e',
    icon: '💬',
    background: '#fafafa'
  }
}

const CalloutContainer = styled.div`
  margin: 1.5rem 0;
  border-left: 4px solid ${props => props.$color};
  border-radius: 4px;
  background: ${props => props.$background};
  overflow: hidden;
`

const CalloutHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: ${props => props.$color};
  background: ${props => `${props.$background}dd`};

  span.icon {
    font-size: 1.2rem;
    line-height: 1;
  }

  span.title {
    flex: 1;
    font-size: 0.95rem;
    text-transform: capitalize;
  }
`

const CalloutContent = styled.div`
  padding: 0.75rem 1rem;
  color: #24292f;

  p:first-child {
    margin-top: 0;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  code {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
  }
`

const ObsidianCallout = ({ type = 'note', title, children }) => {
  const config = CALLOUT_TYPES[type.toLowerCase()] || CALLOUT_TYPES.note

  return (
    <CalloutContainer $color={config.color} $background={config.background}>
      <CalloutHeader $color={config.color} $background={config.background}>
        <span className="icon">{config.icon}</span>
        <span className="title">{title || type}</span>
      </CalloutHeader>
      <CalloutContent>
        {children}
      </CalloutContent>
    </CalloutContainer>
  )
}

export default ObsidianCallout
