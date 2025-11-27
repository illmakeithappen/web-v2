import React from 'react';
import styled from 'styled-components';

const PaneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom,
    rgba(236, 236, 236, 0.95) 0%,
    rgba(220, 220, 220, 0.95) 3%,
    rgba(232, 232, 232, 0.95) 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 968px) {
    min-height: 600px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.$padding || '0'};
  margin: 0;
  position: relative;
  height: 100%;
  overflow-y: ${props => props.$overflow || 'auto'};
  background: ${props => props.$background || 'transparent'};
`;

/**
 * WorkspacePane - A reusable workspace pane component for the right side
 *
 * @param {string} padding - Custom padding for content area (default: '0')
 * @param {string} overflow - CSS overflow property (default: 'auto')
 * @param {string} background - Background color for content area (default: 'transparent')
 * @param {React.ReactNode} children - Content to display in the workspace
 */
export default function WorkspacePane({
  padding,
  overflow,
  background,
  children
}) {
  return (
    <PaneContainer>
      <ContentArea
        $padding={padding}
        $overflow={overflow}
        $background={background}
      >
        {children}
      </ContentArea>
    </PaneContainer>
  );
}
