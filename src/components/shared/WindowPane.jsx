import React from 'react';
import styled from 'styled-components';

const PaneContainer = styled.div`
  flex: 0 0 ${props => props.$width || '350px'};
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(to bottom,
    rgba(236, 236, 236, 0.95) 0%,
    rgba(220, 220, 220, 0.95) 3%,
    rgba(232, 232, 232, 0.95) 100%
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);

  @media (max-width: 968px) {
    flex: none;
    height: auto;
    min-height: ${props => props.$mobileMinHeight || '500px'};
    max-height: ${props => props.$mobileMaxHeight || '600px'};
  }
`;

const TitleBar = styled.div`
  background: linear-gradient(to bottom,
    rgba(230, 230, 230, 0.98) 0%,
    rgba(210, 210, 210, 0.98) 50%,
    rgba(200, 200, 200, 0.98) 100%
  );
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  height: 22px;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  left: 10px;
`;

const WindowButton = styled.button`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: ${props =>
    props.$close ? 'linear-gradient(145deg, #FC615D 0%, #FB4943 100%)' :
    props.$maximize ? 'linear-gradient(145deg, #FDBC40 0%, #FCA310 100%)' :
    'linear-gradient(145deg, #34C948 0%, #24A936 100%)'
  };
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.15s ease;
  padding: 0;
  font-size: 0;
  line-height: 0;

  &:hover {
    filter: brightness(1.05);
    transform: scale(1.05);
  }

  &:active {
    filter: brightness(0.95);
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.2);
  }
`;

const TitleText = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  user-select: none;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: ${props => props.$overflow || 'auto'};
  position: relative;
`;

/**
 * WindowPane - A reusable macOS-style window pane component
 *
 * @param {string} title - Title to display in the title bar
 * @param {boolean} showControls - Whether to show macOS window control buttons
 * @param {string} width - Width of the pane (default: '350px')
 * @param {string} mobileMinHeight - Minimum height on mobile
 * @param {string} mobileMaxHeight - Maximum height on mobile
 * @param {string} overflow - CSS overflow property for content area
 * @param {React.ReactNode} children - Content to display in the pane
 */
export default function WindowPane({
  title = '',
  showControls = true,
  width,
  mobileMinHeight,
  mobileMaxHeight,
  overflow,
  children
}) {
  return (
    <PaneContainer
      $width={width}
      $mobileMinHeight={mobileMinHeight}
      $mobileMaxHeight={mobileMaxHeight}
    >
      <TitleBar>
        {showControls && (
          <WindowControls>
            <WindowButton />
            <WindowButton $maximize />
            <WindowButton $close />
          </WindowControls>
        )}
        {title && <TitleText>{title}</TitleText>}
      </TitleBar>
      <ContentArea $overflow={overflow}>
        {children}
      </ContentArea>
    </PaneContainer>
  );
}
