import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { carbonColors, carbonSpacing, carbonShadows, carbonZIndex } from '../../styles/carbonTheme';
import CarbonButton from '../carbon/CarbonButton';
import { exportProject } from '../../services/project-service';

// ============================================================================
// STYLED COMPONENTS - Base Modal Structure
// ============================================================================

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
  max-width: 800px;
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

// Header Section
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

const ProjectTitle = styled.h2`
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

const ItemCountBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #e0f2fe;
  color: #0284c7;
`;

// Body Section
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${carbonSpacing.spacing06};
  color: ${carbonColors.text03};
  font-size: 0.875rem;
`;

// Node Breakdown Grid
const NodeBreakdownContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${carbonSpacing.spacing03};
`;

const NodeTypeCard = styled.div`
  padding: ${carbonSpacing.spacing03};
  background: ${carbonColors.ui02};
  border: 1px solid ${carbonColors.borderSubtle00};
  border-radius: 4px;
  text-align: center;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
    border-color: ${carbonColors.borderSubtle01};
  }
`;

const NodeTypeCount = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const NodeTypeLabel = styled.div`
  font-size: 0.75rem;
  text-transform: capitalize;
  color: ${carbonColors.text02};
`;

// Mini Canvas Container
const MiniCanvasContainer = styled.div`
  width: 100%;
  height: 300px;
  border: 1px solid ${carbonColors.borderSubtle00};
  border-radius: 4px;
  background: ${carbonColors.ui02};
  overflow: hidden;
`;

// Footer Section
const Footer = styled.div`
  padding: ${carbonSpacing.spacing04} ${carbonSpacing.spacing05};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  background: ${carbonColors.ui02};
  display: flex;
  justify-content: flex-end;
  gap: ${carbonSpacing.spacing03};
`;

// Manage Dropdown Styles
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const calculateNodeBreakdown = (nodes) => {
  const breakdown = {
    workflow: 0,
    skill: 0,
    tool: 0,
    table: 0,
    text: 0,
    step: 0
  };

  nodes?.forEach(node => {
    if (breakdown.hasOwnProperty(node.type)) {
      breakdown[node.type]++;
    }
  });

  return breakdown;
};

// ============================================================================
// PROJECT PREVIEW MODAL COMPONENT
// ============================================================================

const ProjectPreviewModal = ({
  project,
  isOpen,
  onClose,
  onOpen,
  onDuplicate,
  onDelete
}) => {
  const [showManageMenu, setShowManageMenu] = useState(false);
  const manageMenuRef = useRef(null);

  // Calculate node breakdown
  const nodeBreakdown = useMemo(
    () => calculateNodeBreakdown(project?.nodes),
    [project?.nodes]
  );

  const totalNodes = useMemo(
    () => project?.nodes?.length || 0,
    [project?.nodes]
  );

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

  if (!isOpen || !project) return null;

  // Handle Actions
  const handleDuplicate = () => {
    setShowManageMenu(false);
    onDuplicate(project.id);
    console.log('Duplicating project:', project.name);
  };

  const handleExport = () => {
    try {
      const jsonString = exportProject(project.id);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Sanitize filename
      const sanitizedName = project.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
      link.download = `${sanitizedName}_project.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowManageMenu(false);
      console.log('Exported project:', project.name);
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Failed to export project');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) {
      setShowManageMenu(false);
      onDelete(project.id);
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
        {/* HEADER */}
        <Header>
          <TitleRow>
            <ProjectTitle>{project.name}</ProjectTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </TitleRow>
          <MetadataRow>
            <MetadataItem>
              <Label>Items:</Label>
              <ItemCountBadge>{totalNodes} items</ItemCountBadge>
            </MetadataItem>
            <MetadataItem>
              <Label>Last Modified:</Label> {formatDate(project.updatedAt)}
            </MetadataItem>
          </MetadataRow>
        </Header>

        {/* BODY */}
        <Body>
          {/* Description Section */}
          {project.description && (
            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{project.description}</Description>
            </Section>
          )}

          {/* Node Breakdown Section */}
          {totalNodes > 0 ? (
            <>
              <Section>
                <SectionTitle>Content Breakdown</SectionTitle>
                <NodeBreakdownContainer>
                  {Object.entries(nodeBreakdown).map(([type, count]) => (
                    count > 0 && (
                      <NodeTypeCard key={type}>
                        <NodeTypeCount>{count}</NodeTypeCount>
                        <NodeTypeLabel>{type}s</NodeTypeLabel>
                      </NodeTypeCard>
                    )
                  ))}
                </NodeBreakdownContainer>
              </Section>

              {/* Mini Canvas Section */}
              <Section>
                <SectionTitle>Project Graph</SectionTitle>
                <MiniCanvasContainer>
                  <ReactFlow
                    nodes={project.nodes || []}
                    edges={project.edges || []}
                    defaultViewport={project.viewport || { x: 0, y: 0, zoom: 0.5 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    panOnDrag={false}
                    zoomOnDoubleClick={false}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                  >
                    <Background color={carbonColors.ui04} gap={16} />
                  </ReactFlow>
                </MiniCanvasContainer>
              </Section>
            </>
          ) : (
            <EmptyState>This project is empty</EmptyState>
          )}
        </Body>

        {/* FOOTER */}
        <Footer>
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
                <MenuOption onClick={handleDuplicate}>
                  Duplicate Project
                </MenuOption>
                <MenuOption onClick={handleExport}>
                  Export as JSON
                </MenuOption>
                <MenuOption onClick={handleDelete}>
                  Delete Project
                </MenuOption>
              </ManageDropdown>
            )}
          </ManageMenuContainer>

          <CarbonButton
            kind="primary"
            size="md"
            onClick={() => onOpen(project)}
          >
            Open
          </CarbonButton>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProjectPreviewModal;
