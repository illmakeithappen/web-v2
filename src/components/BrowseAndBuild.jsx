import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TOOL_CATEGORIES } from '../data/tools';

// Two-Column Layout
const TwoColumnLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 400px);
  min-height: 600px;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

// Left Column: Tool List
const LeftColumn = styled.div`
  flex: 0 0 320px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    flex: 1;
    min-height: 400px;
  }
`;

// Right Column: Workflow Canvas
const RightColumn = styled.div`
  flex: 1;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ToolListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

// Tool Card (compact, list-style)
const ToolCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid ${props => props.$selected ? 'var(--gitthub-black)' : '#ccc'};
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateX(3px);
  }
`;

const DragHandle = styled.div`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const ToolInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToolName = styled.div`
  font-weight: 700;
  color: var(--gitthub-black);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ToolMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  background: var(--gitthub-beige);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gitthub-black);
`;

const AddButton = styled.button`
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-gray);
  }
`;

// Canvas Container
const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background: #fafafa;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--gitthub-gray);
  pointer-events: none;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyHint = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

// Bottom Status Bar
const StatusBar = styled.div`
  background: var(--gitthub-light-beige);
  border-top: 2px solid var(--gitthub-black);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const StatusIcon = styled.span`
  font-size: 1.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Custom Node Component
const CustomToolNode = ({ data }) => {
  const categoryColor = {
    llm: '#3B82F6',
    vectordb: '#10B981',
    framework: '#8B5CF6',
    mcp: '#F59E0B',
    deployment: '#EF4444',
    monitoring: '#6366F1',
    database: '#EC4899',
    platform: '#14B8A6'
  };

  return (
    <div
      style={{
        padding: '12px',
        border: `2px solid ${categoryColor[data.category] || '#000'}`,
        borderRadius: '8px',
        background: 'white',
        minWidth: '150px',
        maxWidth: '200px',
        position: 'relative'
      }}
    >
      {/* Connection Handles - Top, Right, Bottom, Left */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: '10px', height: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '10px', height: '10px' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: '#555', width: '10px', height: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#555', width: '10px', height: '10px' }}
      />

      <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>
        {data.label}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          padding: '2px 6px',
          background: categoryColor[data.category] || '#000',
          color: 'white',
          borderRadius: '8px',
          display: 'inline-block'
        }}
      >
        {data.category}
      </div>
    </div>
  );
};

const nodeTypes = {
  customTool: CustomToolNode
};

function BrowseAndBuild({ tools, searchQuery }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedToolId, setSelectedToolId] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleAddTool = (tool) => {
    const newNode = {
      id: `${tool.id}-${Date.now()}`,
      type: 'customTool',
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50
      },
      data: {
        label: tool.name,
        category: tool.category,
        tool: tool
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedToolId(tool.id);
  };

  const handleClearWorkflow = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleExportPRD = () => {
    // Generate PRD markdown
    const prd = `# Project Requirements Document\n\n## Tech Stack\n\n${nodes.map(node => `- ${node.data.label} (${node.data.category})`).join('\n')}\n\n## Connections\n\n${edges.length} connections defined\n\n## Generated on ${new Date().toLocaleDateString()}`;

    const blob = new Blob([prd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-requirements.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        tool: node.data.tool,
        position: node.position
      })),
      edges: edges,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get category for a tool
  const getCategoryName = (categoryId) => {
    const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <TwoColumnLayout>
      {/* LEFT: Tool List */}
      <LeftColumn>
        <SectionHeader>
          <SectionTitle>Tools ({tools.length})</SectionTitle>
        </SectionHeader>

        <ToolListContainer>
          {tools.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gitthub-gray)' }}>
              No tools found for "{searchQuery}"
            </div>
          ) : (
            tools.map(tool => (
              <ToolCard
                key={tool.id}
                $selected={selectedToolId === tool.id}
                onClick={() => setSelectedToolId(tool.id)}
              >
                <DragHandle>☰</DragHandle>
                <ToolInfo>
                  <ToolName>{tool.name}</ToolName>
                  <ToolMeta>
                    <CategoryBadge>{getCategoryName(tool.category)}</CategoryBadge>
                  </ToolMeta>
                </ToolInfo>
                <AddButton onClick={(e) => {
                  e.stopPropagation();
                  handleAddTool(tool);
                }}>
                  Add
                </AddButton>
              </ToolCard>
            ))
          )}
        </ToolListContainer>
      </LeftColumn>

      {/* RIGHT: Workflow Canvas */}
      <RightColumn>
        <SectionHeader>
          <SectionTitle>Workflow Canvas ({nodes.length} tools)</SectionTitle>
        </SectionHeader>

        <CanvasContainer>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>

          {nodes.length === 0 && (
            <EmptyState>
              <EmptyIcon>🎨</EmptyIcon>
              <EmptyText>Your workflow canvas is empty</EmptyText>
              <EmptyHint>Click "Add" on any tool to get started</EmptyHint>
            </EmptyState>
          )}
        </CanvasContainer>

        <StatusBar>
          <StatusInfo>
            <StatusIcon>{nodes.length > 0 ? '✅' : '⭕'}</StatusIcon>
            <span>
              {nodes.length === 0
                ? 'No tools added yet'
                : `${nodes.length} tools, ${edges.length} connections`}
            </span>
          </StatusInfo>

          <ActionButtons>
            <Button onClick={handleClearWorkflow} disabled={nodes.length === 0}>
              Clear
            </Button>
            <Button onClick={handleExportPRD} disabled={nodes.length === 0}>
              Export PRD
            </Button>
            <Button onClick={handleExportJSON} disabled={nodes.length === 0}>
              Export JSON
            </Button>
          </ActionButtons>
        </StatusBar>
      </RightColumn>
    </TwoColumnLayout>
  );
}

export default BrowseAndBuild;
