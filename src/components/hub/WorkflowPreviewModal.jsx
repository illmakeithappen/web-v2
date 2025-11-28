import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing, carbonShadows, carbonZIndex } from '../../styles/carbonTheme';
import { DifficultyBadge } from '../carbon/CarbonTag';
import CarbonButton from '../carbon/CarbonButton';
import { parseWorkflowSteps } from '../../utils/workflow-parser';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${carbonZIndex.modal};
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: ${carbonColors.ui01};
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: ${carbonShadows.shadow}, 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  padding: ${carbonSpacing.spacing05};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  background: ${carbonColors.ui02};
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${carbonSpacing.spacing03};
`;

const WorkflowTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;
  line-height: 1;

  &:hover {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.text01};
  }
`;

const MetadataRow = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing04};
  flex-wrap: wrap;
  align-items: center;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  font-size: 0.875rem;
  color: ${carbonColors.text02};
`;

const Label = styled.span`
  font-weight: 600;
  color: ${carbonColors.text01};
`;

const Body = styled.div`
  padding: ${carbonSpacing.spacing05};
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${carbonColors.ui02};
  }

  &::-webkit-scrollbar-thumb {
    background: ${carbonColors.borderSubtle01};
    border-radius: 3px;

    &:hover {
      background: ${carbonColors.borderSubtle00};
    }
  }
`;

const Section = styled.div`
  margin-bottom: ${carbonSpacing.spacing05};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${carbonColors.text02};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${carbonSpacing.spacing03} 0;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${carbonColors.text01};
  line-height: 1.5;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing02};
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  padding: ${carbonSpacing.spacing03};
  background: ${carbonColors.ui02};
  border: 1px solid ${carbonColors.borderSubtle00};
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
    border-color: ${carbonColors.borderSubtle01};
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: ${carbonColors.interactive01};
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepName = styled.div`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${carbonColors.text01};
  line-height: 1.3;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${carbonSpacing.spacing06};
  color: ${carbonColors.text03};
  font-size: 0.875rem;
`;

const Footer = styled.div`
  padding: ${carbonSpacing.spacing04} ${carbonSpacing.spacing05};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  background: ${carbonColors.ui02};
  display: flex;
  justify-content: flex-end;
  gap: ${carbonSpacing.spacing03};
`;

// Manage dropdown styles (copied from CourseCatalog.jsx)
const ManageMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ManageDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  right: 0;
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
`;

const MenuOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: ${carbonColors.text01};
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const WorkflowPreviewModal = ({
  workflow,
  isOpen,
  onClose,
  onEdit,
  onStart
}) => {
  const [showManageMenu, setShowManageMenu] = useState(false);
  const manageMenuRef = useRef(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Close manage dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (manageMenuRef.current && !manageMenuRef.current.contains(event.target)) {
        setShowManageMenu(false);
      }
    };

    if (showManageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showManageMenu]);

  // Parse steps with multiple fallbacks
  const steps = useMemo(() => {
    if (!workflow) return [];

    // Priority 1: If steps are already populated (from template-service), use them
    if (workflow.steps?.length > 0) return workflow.steps;

    // Priority 2: Use frontmatter.steps array if available (from YAML frontmatter)
    if (workflow.frontmatter?.steps && Array.isArray(workflow.frontmatter.steps)) {
      return workflow.frontmatter.steps;
    }

    // Priority 3: Parse steps from content
    if (workflow.content) {
      try {
        const parsedSteps = parseWorkflowSteps(workflow.content);
        if (parsedSteps.length > 0) {
          return parsedSteps.map(s => s.title || `Step ${s.step_number}`);
        }
      } catch (error) {
        console.warn('Error parsing workflow steps:', error);
      }
    }

    return [];
  }, [workflow]);

  if (!isOpen || !workflow) return null;

  const handleDownloadSkills = () => {
    try {
      const downloadData = {
        workflow_id: workflow.workflow_id,
        workflow_title: workflow.title,
        skills: workflow.skills || [],
        tools: workflow.tools || [],
        exported_at: new Date().toISOString()
      };

      const jsonString = JSON.stringify(downloadData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.workflow_id}_skills_tools.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowManageMenu(false);
      console.log('Downloaded skills and tools for:', workflow.title);
    } catch (error) {
      console.error('Error downloading skills:', error);
      alert('Failed to download skills and tools');
    }
  };

  const handleUploadSkills = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const uploadedData = JSON.parse(event.target.result);

            if (!uploadedData.skills || !uploadedData.tools) {
              alert('Invalid file format. Must contain skills and tools.');
              return;
            }

            console.log('Uploading skills and tools for:', workflow.title);
            console.log('New data:', uploadedData);
            alert('Upload feature will be implemented with backend API');
          } catch (error) {
            console.error('Error parsing uploaded file:', error);
            alert('Failed to parse uploaded file. Must be valid JSON.');
          }
        };

        reader.readAsText(file);
      };

      input.click();
      setShowManageMenu(false);
    } catch (error) {
      console.error('Error uploading skills:', error);
      alert('Failed to upload skills and tools');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleRow>
            <WorkflowTitle>{workflow.title}</WorkflowTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </TitleRow>
          <MetadataRow>
            <MetadataItem>
              <Label>Agent:</Label> {workflow.agent}
            </MetadataItem>
            <MetadataItem>
              <Label>Type:</Label> {workflow.type}
            </MetadataItem>
            <MetadataItem>
              <Label>Difficulty:</Label>
              <DifficultyBadge difficulty={workflow.difficulty} />
            </MetadataItem>
            <MetadataItem>
              <Label>Duration:</Label> {workflow.duration}
            </MetadataItem>
          </MetadataRow>
        </Header>

        <Body>
          {workflow.description && (
            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{workflow.description}</Description>
            </Section>
          )}

          {steps.length > 0 ? (
            <Section>
              <SectionTitle>Steps ({steps.length})</SectionTitle>
              <StepsList>
                {steps.map((step, idx) => (
                  <StepItem key={idx}>
                    <StepNumber>{idx + 1}</StepNumber>
                    <StepName>{step}</StepName>
                  </StepItem>
                ))}
              </StepsList>
            </Section>
          ) : (
            <EmptyState>No steps defined for this workflow</EmptyState>
          )}
        </Body>

        <Footer>
          <CarbonButton
            kind="secondary"
            size="md"
            onClick={() => onEdit(workflow)}
          >
            Edit
          </CarbonButton>

          <ManageMenuContainer ref={manageMenuRef}>
            <CarbonButton
              kind="secondary"
              size="md"
              onClick={() => setShowManageMenu(!showManageMenu)}
            >
              Manage
            </CarbonButton>
            {showManageMenu && (
              <ManageDropdown>
                <MenuOption onClick={handleDownloadSkills}>
                  Download Skills & Tools
                </MenuOption>
                <MenuOption onClick={handleUploadSkills}>
                  Upload New Version
                </MenuOption>
              </ManageDropdown>
            )}
          </ManageMenuContainer>

          <CarbonButton
            kind="primary"
            size="md"
            onClick={() => onStart(workflow)}
          >
            Start
          </CarbonButton>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WorkflowPreviewModal;
