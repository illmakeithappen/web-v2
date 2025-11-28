import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { carbonColors, carbonSpacing } from '../../styles/carbonTheme';
import docsService from '../../services/docs-service';
import CarbonButton from '../carbon/CarbonButton';
import {
  saveProject,
  saveHistoryState,
  undo,
  redo,
  canUndo,
  canRedo
} from '../../services/project-service';
// fetchWorkflowById removed - using docsService.getDoc instead for slug-based IDs

// Import custom node types
import WorkflowNode from './nodes/WorkflowNode';
import SkillNode from './nodes/SkillNode';
import ToolNode from './nodes/ToolNode';
import McpNode from './nodes/McpNode';
import SubagentNode from './nodes/SubagentNode';
import TableNode from './nodes/TableNode';
import TextNode from './nodes/TextNode';
import StepNode from './nodes/StepNode';

// Import workflow parser utilities
import {
  parseWorkflowSteps,
  inferStepConnections,
  calculateStepPositions
} from '../../utils/workflow-parser';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${carbonSpacing.spacing04} ${carbonSpacing.spacing05};
  background: ${carbonColors.layer01};
  border-bottom: 1px solid ${carbonColors.ui04};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing04};
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: ${carbonSpacing.spacing02};
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  font-size: 0.875rem;

  &:hover {
    color: ${carbonColors.text01};
  }
`;

const ProjectNameInput = styled.input`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  background: transparent;
  border: none;
  padding: ${carbonSpacing.spacing02};
  border-radius: 4px;
  min-width: 200px;

  &:hover {
    background: ${carbonColors.field01};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    background: ${carbonColors.field01};
  }
`;

const SaveStatus = styled.div`
  font-size: 0.75rem;
  color: ${props => props.$saved ? carbonColors.supportSuccess : carbonColors.text02};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: ${props => props.$collapsed ? '48px' : '280px'};
  background: ${carbonColors.layer01};
  border-right: 1px solid ${carbonColors.ui04};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;
`;

const CollapsedSidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${carbonSpacing.spacing04};
  gap: ${carbonSpacing.spacing03};
`;

const CollapsedIcon = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  color: ${carbonColors.text01};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 1rem;

  &:hover {
    background: ${carbonColors.hoverUI};
    border-color: ${carbonColors.interactive01};
  }
`;

const SidebarHeader = styled.div`
  padding: ${carbonSpacing.spacing04};
  border-bottom: 1px solid ${carbonColors.ui04};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin: 0;
`;

const CollapseButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: ${carbonSpacing.spacing02};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;

  &:hover {
    color: ${carbonColors.text01};
  }
`;

const SidebarTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${carbonColors.ui04};
`;

const SidebarTab = styled.button`
  flex: 1;
  padding: ${carbonSpacing.spacing03};
  background: ${props => props.$active ? carbonColors.layer02 : 'transparent'};
  border: none;
  border-bottom: ${props => props.$active ? `2px solid ${carbonColors.interactive01}` : '2px solid transparent'};
  color: ${props => props.$active ? carbonColors.text01 : carbonColors.text02};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: ${props => props.$active ? 600 : 400};
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${carbonSpacing.spacing03};
`;

const DraggableItem = styled.div`
  padding: ${carbonSpacing.spacing03};
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  margin-bottom: ${carbonSpacing.spacing02};
  cursor: grab;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
    border-color: ${carbonColors.interactive01};
  }

  &:active {
    cursor: grabbing;
  }
`;

const ItemName = styled.div`
  font-weight: 500;
  font-size: 0.8125rem;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing01};
`;

const ItemDescription = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text02};
  line-height: 1.3;
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
`;

const CanvasToolbar = styled.div`
  position: absolute;
  top: ${carbonSpacing.spacing03};
  left: ${carbonSpacing.spacing03};
  display: flex;
  gap: ${carbonSpacing.spacing02};
  z-index: 10;
`;

const ToolbarButton = styled.button`
  padding: ${carbonSpacing.spacing02} ${carbonSpacing.spacing03};
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  color: ${carbonColors.text01};
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${carbonColors.hoverUI};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

// ============================================================================
// NODE TYPES REGISTRATION
// ============================================================================

const nodeTypes = {
  workflow: WorkflowNode,
  skill: SkillNode,
  tool: ToolNode,
  mcp: McpNode,
  subagent: SubagentNode,
  table: TableNode,
  text: TextNode,
  step: StepNode,
};

// ============================================================================
// DAGRE LAYOUT
// ============================================================================

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const nodeWidth = 250;
  const nodeHeight = 120;

  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// ============================================================================
// PROJECT CONTENT COMPONENT
// ============================================================================

function ProjectContentInner({ project, onBack, onDelete }) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Project state
  const [projectName, setProjectName] = useState(project?.name || 'Untitled Project');
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(project?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(project?.edges || []);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeLibraryTab, setActiveLibraryTab] = useState('resources');
  const [workflows, setWorkflows] = useState([]);
  const [skills, setSkills] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [subagents, setSubagents] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  // History state
  const [canUndoState, setCanUndoState] = useState(false);
  const [canRedoState, setCanRedoState] = useState(false);

  // Fetch available resources from docsService
  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);

      try {
        const [workflowsRes, skillsRes, mcpRes, subagentsRes] = await Promise.all([
          docsService.listSection('workflows').catch(() => ({ items: [] })),
          docsService.listSection('skills').catch(() => ({ items: [] })),
          docsService.listSection('mcp').catch(() => ({ items: [] })),
          docsService.listSection('subagents').catch(() => ({ items: [] }))
        ]);

        // Transform items to expected format
        setWorkflows((workflowsRes.items || []).map(item => ({
          workflow_id: item.id,
          title: item.name,
          type: item.category || 'workflow',
          description: item.description
        })));

        setSkills((skillsRes.items || []).map(item => ({
          skill_id: item.id,
          skill_name: item.name,
          skill_type: item.category || 'skill',
          description: item.description
        })));

        setMcpServers((mcpRes.items || []).map(item => ({
          mcp_id: item.id,
          name: item.name,
          category: item.category || 'mcp',
          description: item.description
        })));

        setSubagents((subagentsRes.items || []).map(item => ({
          subagent_id: item.id,
          name: item.name,
          category: item.category || 'subagent',
          description: item.description
        })));
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // Mark as unsaved when nodes or edges change
  useEffect(() => {
    setIsSaved(false);
    updateHistoryState();
  }, [nodes, edges]);

  // Update history state
  const updateHistoryState = useCallback(() => {
    if (project?.id) {
      setCanUndoState(canUndo(project.id));
      setCanRedoState(canRedo(project.id));
    }
  }, [project?.id]);

  // Auto-save with debounce
  useEffect(() => {
    if (!project?.id || isSaved) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [nodes, edges, projectName]);

  // Save project
  const handleSave = useCallback(async () => {
    if (!project?.id) return;

    setIsSaving(true);

    // Save history state before saving
    saveHistoryState(project.id, { nodes, edges });

    const updatedProject = {
      ...project,
      name: projectName,
      nodes,
      edges,
      viewport: reactFlowInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
    };

    await saveProject(updatedProject);
    setIsSaved(true);
    setIsSaving(false);
    updateHistoryState();
  }, [project, projectName, nodes, edges, reactFlowInstance, updateHistoryState]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (!project?.id) return;
    const previousState = undo(project.id, { nodes, edges });
    if (previousState) {
      setNodes(previousState.nodes || []);
      setEdges(previousState.edges || []);
      updateHistoryState();
    }
  }, [project?.id, nodes, edges, setNodes, setEdges, updateHistoryState]);

  const handleRedo = useCallback(() => {
    if (!project?.id) return;
    const nextState = redo(project.id, { nodes, edges });
    if (nextState) {
      setNodes(nextState.nodes || []);
      setEdges(nextState.edges || []);
      updateHistoryState();
    }
  }, [project?.id, nodes, edges, setNodes, setEdges, updateHistoryState]);

  // Connection handler
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: carbonColors.interactive01,
            },
            style: { stroke: carbonColors.interactive01, strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Drag and drop handlers
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Cascading delete handler for parent-child relationships
      const handleCascadingDelete = (nodeId) => {
        setNodes((nds) => {
          // Find the node being deleted
          const deletedNode = nds.find(n => n.id === nodeId);

          if (deletedNode?.type === 'workflow') {
            // If deleting a workflow, also delete all its child steps
            return nds.filter(n => n.id !== nodeId && n.data?.parentId !== nodeId);
          } else if (deletedNode?.type === 'step') {
            // If deleting a step, just remove it
            return nds.filter(n => n.id !== nodeId);
          } else {
            // For other types, simple deletion
            return nds.filter(n => n.id !== nodeId);
          }
        });

        // Also remove associated edges
        setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      };

      // Special handling for workflow drops - auto-create step nodes
      if (data.type === 'workflow' && (data.item?.id || data.item?.workflow_id)) {
        // IMPORTANT: Use manifest ID first (data.item.id matches folder name)
        // Frontmatter's workflow_id may not match the folder structure
        const workflowId = data.item.id || data.item.workflow_id;
        const workflowNodeId = `workflow-${Date.now()}`;

        console.log('[Workflow Drop] Starting with workflowId:', workflowId);
        console.log('[Workflow Drop] data.item:', JSON.stringify(data.item, null, 2));

        // Start with sidebar data as base (always available)
        let fullWorkflow = {
          ...data.item,
          title: data.item.title || data.item.name || 'Workflow',
          description: data.item.description || '',
          content: '',
          frontmatter: {},
          steps: []
        };

        // Try to fetch full content for better step parsing
        try {
          console.log('[Workflow Drop] Fetching doc for workflowId:', workflowId);
          const docResult = await docsService.getDoc('workflows', workflowId);
          console.log('[Workflow Drop] docResult:', docResult ? 'Found' : 'Not found');
          console.log('[Workflow Drop] frontmatter.steps:', docResult?.frontmatter?.steps);
          if (docResult) {
            fullWorkflow = {
              ...fullWorkflow,
              ...docResult.metadata,
              content: docResult.content || '',
              raw_content: docResult.raw || '',
              frontmatter: docResult.frontmatter || {},
              title: docResult.metadata?.name || docResult.frontmatter?.name || fullWorkflow.title,
              description: docResult.metadata?.description || docResult.frontmatter?.description || fullWorkflow.description,
              steps: docResult.frontmatter?.steps || []
            };
            console.log('[Workflow Drop] fullWorkflow.steps after fetch:', fullWorkflow.steps);
          }
        } catch (err) {
          console.warn('[Workflow Drop] Could not fetch full workflow content:', err.message);
          // Continue with sidebar data - don't bail out
        }

        // Create parent workflow node (always created)
        const workflowNode = {
          id: workflowNodeId,
          type: 'workflow',
          position,
          data: {
            ...fullWorkflow,
            id: workflowNodeId,
            label: fullWorkflow.title,
            expanded: true,
            onDelete: handleCascadingDelete,
            onDataChange: (nodeId, newData) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
              );
            },
          },
        };

        // Parse steps from content OR use frontmatter steps array
        console.log('[Workflow Drop] Parsing steps with content length:', fullWorkflow.content?.length, 'and stepTitles:', fullWorkflow.steps);
        const steps = parseWorkflowSteps(fullWorkflow.content, fullWorkflow.steps);
        console.log('[Workflow Drop] Parsed steps:', steps.length, steps.map(s => s.title));

        if (steps.length > 0) {
          console.log('[Workflow Drop] Creating', steps.length, 'step nodes');

          // Calculate positions for step nodes
          const stepPositions = calculateStepPositions(position, steps.length);

          // Create step nodes
          const stepNodes = steps.map((step, index) => {
            const stepNodeId = `step-${workflowNodeId}-${index}`;
            return {
              id: stepNodeId,
              type: 'step',
              position: stepPositions[index],
              data: {
                ...step,
                id: stepNodeId,
                parentId: workflowNodeId,
                onDelete: handleCascadingDelete,
                onDataChange: (nodeId, newData) => {
                  setNodes((nds) =>
                    nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
                  );
                },
              },
            };
          });

          // Infer connections between steps
          const connections = inferStepConnections(steps);

          // Create edges from workflow header to each step node
          const headerToStepEdges = steps.map((step, index) => ({
            id: `edge-header-${workflowNodeId}-${index}`,
            source: workflowNodeId,
            target: `step-${workflowNodeId}-${index}`,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: carbonColors.interactive01 || '#0053b6',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: carbonColors.interactive01 || '#0053b6',
            },
          }));

          // Create edges for inter-step connections (sequential flow)
          const interStepEdges = connections.map(conn => ({
            id: `edge-${workflowNodeId}-${conn.sourceStep}-${conn.targetStep}`,
            source: `step-${workflowNodeId}-${conn.sourceStep}`,
            target: `step-${workflowNodeId}-${conn.targetStep}`,
            sourceHandle: `output-${conn.sourceHandle}`,
            targetHandle: `input-${conn.targetHandle}`,
            type: conn.type === 'sequential' ? 'default' : 'smoothstep',
            animated: conn.type !== 'sequential',
            style: {
              stroke: conn.type === 'sequential' ? carbonColors.ui04 : '#00539B',
              strokeWidth: conn.type === 'sequential' ? 1 : 2,
              strokeDasharray: conn.type === 'sequential' ? '5,5' : 'none',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: conn.type === 'sequential' ? carbonColors.ui04 : '#00539B',
            },
            label: conn.label && conn.type !== 'sequential' ? conn.label : undefined,
          }));

          // Combine all edges: header-to-step + inter-step
          const allEdges = [...headerToStepEdges, ...interStepEdges];

          // Add all nodes (workflow + steps) and edges
          setNodes((nds) => nds.concat([workflowNode, ...stepNodes]));
          setEdges((eds) => eds.concat(allEdges));
        } else {
          // No steps found, just add workflow node
          console.log('No steps found for workflow, adding header only');
          setNodes((nds) => nds.concat(workflowNode));
        }
      } else {
        // For non-workflow items, create simple node
        createSimpleNode(data, position, handleCascadingDelete);
      }

      // Helper function to create simple nodes
      function createSimpleNode(data, position, deleteHandler) {
        const nodeId = `${data.type}-${Date.now()}`;
        const newNode = {
          id: nodeId,
          type: data.type,
          position,
          data: {
            ...data.item,
            id: nodeId, // Store ID in data as well
            label: data.item?.name || data.item?.title || data.item?.skill_name || 'New Item',
            onDelete: deleteHandler,
            onDataChange: (nodeId, newData) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
              );
            },
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes, setEdges]
  );

  // Auto-layout handler
  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'LR'
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    // Fit view after layout
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2 });
    }, 50);
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  // Export handler
  const handleExport = useCallback(() => {
    const exportData = {
      name: projectName,
      nodes,
      edges,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projectName, nodes, edges]);

  // Drag start handler for sidebar items
  const handleDragStart = (event, item, type) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ item, type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  // Primitive items for tables and text
  const primitiveItems = [
    { id: 'table', name: 'Table', type: 'table', description: 'Editable data table' },
    { id: 'text', name: 'Text', type: 'text', description: 'Rich text note' }
  ];

  return (
    <ContentContainer>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <BackButton onClick={onBack}>
            Back
          </BackButton>
          <ProjectNameInput
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
          />
          <SaveStatus $saved={isSaved}>
            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Unsaved changes'}
          </SaveStatus>
        </HeaderLeft>
        <HeaderRight>
          <CarbonButton kind="secondary" size="sm" onClick={handleExport}>
            Export
          </CarbonButton>
          <CarbonButton kind="primary" size="sm" onClick={handleSave}>
            Save
          </CarbonButton>
        </HeaderRight>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Sidebar */}
        <Sidebar $collapsed={sidebarCollapsed}>
          {sidebarCollapsed ? (
            /* Collapsed state - show icons */
            <CollapsedSidebar>
              <CollapsedIcon
                onClick={() => setSidebarCollapsed(false)}
                title="Expand Library"
              >
                &#x2261;
              </CollapsedIcon>
              <CollapsedIcon
                onClick={() => { setSidebarCollapsed(false); setActiveLibraryTab('resources'); }}
                title="Resources"
                style={{ fontSize: '0.875rem' }}
              >
                &#x1F4DA;
              </CollapsedIcon>
              <CollapsedIcon
                onClick={() => { setSidebarCollapsed(false); setActiveLibraryTab('primitives'); }}
                title="Primitives"
                style={{ fontSize: '0.875rem' }}
              >
                &#x25A6;
              </CollapsedIcon>
            </CollapsedSidebar>
          ) : (
            /* Expanded state - show full content */
            <>
              <SidebarHeader>
                <SidebarTitle>Resource Library</SidebarTitle>
                <CollapseButton
                  onClick={() => setSidebarCollapsed(true)}
                  title="Collapse Library"
                >
                  &#x276E;
                </CollapseButton>
              </SidebarHeader>

              <SidebarTabs>
                <SidebarTab
                  $active={activeLibraryTab === 'resources'}
                  onClick={() => setActiveLibraryTab('resources')}
                >
                  Resources
                </SidebarTab>
                <SidebarTab
                  $active={activeLibraryTab === 'primitives'}
                  onClick={() => setActiveLibraryTab('primitives')}
                >
                  Primitives
                </SidebarTab>
              </SidebarTabs>

              <SidebarContent>
                {loadingResources && (
                  <div style={{ textAlign: 'center', color: carbonColors.text02, padding: carbonSpacing.spacing05 }}>
                    Loading resources...
                  </div>
                )}

                {activeLibraryTab === 'resources' && !loadingResources && (
                  <>
                    {/* Workflows */}
                    {workflows.length > 0 && (
                      <>
                        <ItemName style={{ marginBottom: carbonSpacing.spacing02, color: carbonColors.text02 }}>
                          Workflows ({workflows.length})
                        </ItemName>
                        {workflows.slice(0, 5).map((workflow) => (
                          <DraggableItem
                            key={workflow.workflow_id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, workflow, 'workflow')}
                          >
                            <ItemName>{workflow.title}</ItemName>
                            <ItemDescription>{workflow.type || 'Workflow'}</ItemDescription>
                          </DraggableItem>
                        ))}
                      </>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <>
                        <ItemName style={{ marginTop: carbonSpacing.spacing04, marginBottom: carbonSpacing.spacing02, color: carbonColors.text02 }}>
                          Skills ({skills.length})
                        </ItemName>
                        {skills.slice(0, 5).map((skill) => (
                          <DraggableItem
                            key={skill.skill_id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, skill, 'skill')}
                          >
                            <ItemName>{skill.skill_name}</ItemName>
                            <ItemDescription>{skill.skill_type || 'Skill'}</ItemDescription>
                          </DraggableItem>
                        ))}
                      </>
                    )}

                    {/* MCP Servers */}
                    {mcpServers.length > 0 && (
                      <>
                        <ItemName style={{ marginTop: carbonSpacing.spacing04, marginBottom: carbonSpacing.spacing02, color: carbonColors.text02 }}>
                          MCP Servers ({mcpServers.length})
                        </ItemName>
                        {mcpServers.slice(0, 5).map((mcp) => (
                          <DraggableItem
                            key={mcp.mcp_id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, mcp, 'mcp')}
                          >
                            <ItemName>{mcp.name}</ItemName>
                            <ItemDescription>{mcp.category || 'MCP Server'}</ItemDescription>
                          </DraggableItem>
                        ))}
                      </>
                    )}

                    {/* Subagents */}
                    {subagents.length > 0 && (
                      <>
                        <ItemName style={{ marginTop: carbonSpacing.spacing04, marginBottom: carbonSpacing.spacing02, color: carbonColors.text02 }}>
                          Subagents ({subagents.length})
                        </ItemName>
                        {subagents.slice(0, 5).map((subagent) => (
                          <DraggableItem
                            key={subagent.subagent_id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, subagent, 'subagent')}
                          >
                            <ItemName>{subagent.name}</ItemName>
                            <ItemDescription>{subagent.category || 'Subagent'}</ItemDescription>
                          </DraggableItem>
                        ))}
                      </>
                    )}

                    {/* Empty state */}
                    {workflows.length === 0 && skills.length === 0 && mcpServers.length === 0 && subagents.length === 0 && (
                      <div style={{ textAlign: 'center', color: carbonColors.text02, padding: carbonSpacing.spacing05 }}>
                        No resources available
                      </div>
                    )}
                  </>
                )}

                {activeLibraryTab === 'primitives' && (
                  <>
                    {primitiveItems.map((item) => (
                      <DraggableItem
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, item.type)}
                      >
                        <ItemName>{item.name}</ItemName>
                        <ItemDescription>{item.description}</ItemDescription>
                      </DraggableItem>
                    ))}
                  </>
                )}
              </SidebarContent>
            </>
          )}
        </Sidebar>

        {/* Canvas */}
        <CanvasContainer ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultViewport={project?.viewport || { x: 0, y: 0, zoom: 1 }}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'workflow':
                    return '#0f62fe';
                  case 'skill':
                    return '#24a148';
                  case 'mcp':
                    return '#8a3ffc';
                  case 'subagent':
                    return '#ff7eb6';
                  case 'table':
                    return '#fa4d56';
                  case 'text':
                    return '#f1c21b';
                  default:
                    return '#878d96';
                }
              }}
            />
            <Background variant="dots" gap={15} size={1} />

            {/* Canvas Toolbar */}
            <Panel position="top-left">
              <CanvasToolbar>
                <ToolbarButton onClick={handleUndo} disabled={!canUndoState}>
                  Undo
                </ToolbarButton>
                <ToolbarButton onClick={handleRedo} disabled={!canRedoState}>
                  Redo
                </ToolbarButton>
                <ToolbarButton onClick={handleAutoLayout}>
                  Auto Layout
                </ToolbarButton>
              </CanvasToolbar>
            </Panel>
          </ReactFlow>
        </CanvasContainer>
      </MainContent>
    </ContentContainer>
  );
}

// Wrap with ReactFlowProvider
export default function ProjectContent(props) {
  return (
    <ReactFlowProvider>
      <ProjectContentInner {...props} />
    </ReactFlowProvider>
  );
}
