import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const CardContainer = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;
  transition: all 0.3s ease;
  cursor: ${props => props.$editable ? 'pointer' : 'default'};
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: ${props => props.$editable ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.$editable ? 'var(--shadow-md)' : 'var(--shadow-sm)'};
    border-color: ${props => props.$editable ? 'var(--gitthub-black)' : 'var(--gitthub-black)'};
  }

  ${props => props.$verified && `
    border-color: #24a148;
    &::after {
      content: '✓';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 24px;
      height: 24px;
      background: #24a148;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: bold;
    }
  `}

  ${props => props.$severity === 'high' && `
    border-color: #da1e28;
    background: rgba(218, 30, 40, 0.02);
  `}

  ${props => props.$severity === 'medium' && `
    border-color: #f1c21b;
    background: rgba(241, 194, 27, 0.02);
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  line-height: 1;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  flex: 1;
`;

const CardContent = styled.div`
  font-size: 0.95rem;
  color: var(--gitthub-black);
  line-height: 1.5;
  word-wrap: break-word;
`;

const EditIcon = styled.span`
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${CardContainer}:hover & {
    opacity: ${props => props.$visible ? 1 : 0};
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: ${props => {
    switch (props.$variant) {
      case 'high': return '#da1e28';
      case 'medium': return '#f1c21b';
      case 'low': return '#24a148';
      case 'info': return '#0f62fe';
      default: return 'var(--gitthub-gray)';
    }
  }};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: 0.5rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  list-style: ${props => props.$bullet || 'disc'};

  li {
    margin-bottom: 0.375rem;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-black);
  color: var(--gitthub-black);
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
`;

export default function ContextCard({
  icon,
  title,
  content,
  children,
  editable = false,
  verified = false,
  severity = null,
  badge = null,
  items = null,
  tags = null,
  onClick = null
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    if (editable && onClick) {
      onClick();
    }
  };

  return (
    <CardContainer
      $editable={editable}
      $verified={verified}
      $severity={severity}
      onClick={handleClick}
    >
      <CardHeader>
        {icon && <CardIcon>{icon}</CardIcon>}
        <CardTitle>{title}</CardTitle>
        {badge && <Badge $variant={badge.variant}>{badge.text}</Badge>}
        {editable && <EditIcon $visible={editable}>✎</EditIcon>}
      </CardHeader>

      <CardContent>
        {children || (
          <>
            {content && <div>{content}</div>}
            {items && items.length > 0 && (
              <List $bullet="disc">
                {items.map((item, index) => (
                  <li key={index}>{typeof item === 'string' ? item : item.text}</li>
                ))}
              </List>
            )}
            {tags && tags.length > 0 && (
              <TagCloud>
                {tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagCloud>
            )}
          </>
        )}
      </CardContent>
    </CardContainer>
  );
}
