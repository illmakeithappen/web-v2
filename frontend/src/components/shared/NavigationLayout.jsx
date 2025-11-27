import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import FileTreeNav from '../hub/FileTreeNav';

const LayoutContainer = styled.div`
  height: 100%;
  background: #faf9f7;
  overflow: hidden;
`;

const LayoutContent = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: ${props => props.$isMinimized ? '0' : '1.5rem'};
  align-items: flex-start;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LeftPane = styled.div`
  background: linear-gradient(to bottom,
    rgba(248, 248, 248, 0.95),
    rgba(242, 242, 242, 0.95)
  );
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  min-width: ${props => props.$isMinimized ? 'auto' : '350px'};
  max-width: ${props => props.$isMinimized ? 'auto' : '350px'};
  height: ${props => props.$isMinimized ? 'auto' : '100%'};
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: ${props => props.$isMinimized ? 'absolute' : 'relative'};
  top: ${props => props.$isMinimized ? '0' : 'auto'};
  left: ${props => props.$isMinimized ? '0' : 'auto'};
  z-index: ${props => props.$isMinimized ? '100' : 'auto'};

  @media (max-width: 968px) {
    max-width: 100%;
    width: 100%;
    max-height: 600px;
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const RightPaneWrapper = styled.div`
  flex: 1;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TitleBar = styled.div`
  background: linear-gradient(to bottom,
    rgba(230, 230, 230, 0.98) 0%,
    rgba(210, 210, 210, 0.98) 50%,
    rgba(200, 200, 200, 0.98) 100%
  );
  padding: ${props => props.$isMinimized ? '6px 8px' : '8px 10px'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isMinimized ? 'flex-start' : 'center'};
  border-bottom: ${props => props.$isMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.15)'};
  height: ${props => props.$isMinimized ? 'auto' : '22px'};
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-radius: ${props => props.$isMinimized ? '8px' : '8px 8px 0 0'};
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  position: ${props => props.$isMinimized ? 'static' : 'absolute'};
  left: ${props => props.$isMinimized ? 'auto' : '10px'};
  align-items: center;
`;

const CollapseArrow = styled.button`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: linear-gradient(145deg, #FC615D 0%, #FB4943 100%);
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.15s ease;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 13px;
  font-family: monospace;

  &::before {
    content: '${props => props.$isMinimized ? '>' : '<'}';
    display: block;
    margin-top: -1px;
  }

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

const WindowButton = styled.button`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: ${props =>
    props.$minimize ? 'linear-gradient(145deg, #FDBC40 0%, #FCA310 100%)' :
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
  display: flex;
  align-items: center;
  justify-content: center;

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

export default function NavigationLayout({
  selectedSection,
  selectedItem,
  activeTab,
  bottomContent,
  rightPane,
  onSectionChange,
  onItemSelect,
  folderLabel = 'DASHBOARD'
}) {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleCloseWindow = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMinimize = () => {
    navigate('/doc');
  };

  const handleMaximize = () => {
    navigate('/hub');
  };

  const handleDashboardClick = () => {
    navigate('/hub');
  };

  return (
    <LayoutContainer>
      <LayoutContent $isMinimized={isMinimized}>
        <LeftPane $isMinimized={isMinimized}>
          <TitleBar $isMinimized={isMinimized}>
            <WindowControls $isMinimized={isMinimized}>
              <CollapseArrow $isMinimized={isMinimized} onClick={handleCloseWindow} />
              <WindowButton $minimize onClick={handleMinimize} />
              <WindowButton onClick={handleMaximize} />
            </WindowControls>
          </TitleBar>
          {!isMinimized && (
            <>
              <FileTreeNav
                selectedSection={selectedSection}
                selectedItem={selectedItem}
                activeTab={activeTab}
                onSectionChange={onSectionChange}
                onItemSelect={onItemSelect}
                folderLabel={folderLabel}
              />
              <PreviewContainer>
                {bottomContent}
              </PreviewContainer>
            </>
          )}
        </LeftPane>
        <RightPaneWrapper key={selectedSection}>
          {rightPane}
        </RightPaneWrapper>
      </LayoutContent>
    </LayoutContainer>
  );
}
