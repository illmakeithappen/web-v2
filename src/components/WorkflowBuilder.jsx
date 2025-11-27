import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';

const WorkflowContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #fafafa;
  position: relative;
`;

const StyledReactFlow = styled(ReactFlow)`
  .react-flow__node {
    border-radius: 8px;
    font-family: inherit;
  }

  .react-flow__node-tool {
    background: white;
    border: 2px solid var(--gitthub-black);
    padding: 12px;
    border-radius: 8px;
    min-width: 150px;
  }

  .react-flow__node-approval {
    background: #FFF3E0;
    border: 2px solid #FF9800;
    padding: 12px;
    border-radius: 8px;
    min-width: 150px;
  }

  .react-flow__handle {
    background: var(--gitthub-black);
    width: 10px;
    height: 10px;
  }

  .react-flow__edge-path {
    stroke: var(--gitthub-black);
    stroke-width: 2;
  }

  .react-flow__edge.animated .react-flow__edge-path {
    stroke: #FFA500;
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }

  @keyframes dashdraw {
    to {
      stroke-dashoffset: -10;
    }
  }

  .react-flow__controls {
    button {
      background: white;
      border: 2px solid var(--gitthub-black);
      border-radius: 4px;

      &:hover {
        background: var(--gitthub-light-beige);
      }
    }
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 5;
  min-width: 200px;
`;

const ControlButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  background: ${props => props.$primary ? '#FFA500' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid black;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#FF9400' : 'var(--gitthub-light-beige)'};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const NodeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NodeIcon = styled.div`
  font-size: 1.5rem;
  text-align: center;
`;

const NodeLabel = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gitthub-black);
  text-align: center;
`;

const NodeDescription = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  text-align: center;
  margin-top: 4px;
`;

const EmptyCanvas = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--gitthub-gray);
  pointer-events: none;
  z-index: 1;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
  }
`;

const ToolNode = ({ data }) => {
  return (
    <>
      <NodeContent>
        <NodeIcon>{data.icon}</NodeIcon>
        <NodeLabel>{data.label}</NodeLabel>
        {data.description && <NodeDescription>{data.description}</NodeDescription>}
      </NodeContent>
    </>
  );
};

const ApprovalNode = ({ data }) => {
  return (
    <>
      <NodeContent>
        <NodeIcon>{data.icon}</NodeIcon>
        <NodeLabel>{data.label}</NodeLabel>
        {data.description && <NodeDescription>{data.description}</NodeDescription>}
      </NodeContent>
    </>
  );
};

const nodeTypes = {
  tool: ToolNode,
  approval: ApprovalNode,
};

function WorkflowBuilder({ initialNodes = [], initialEdges = [], onWorkflowChange, onExport }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showControls, setShowControls] = useState(true);

  // Update nodes and edges when initial props change (template applied)
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({ ...params, animated: true }, edges);
      setEdges(newEdges);
      if (onWorkflowChange) {
        onWorkflowChange({ nodes, edges: newEdges });
      }
    },
    [edges, nodes, onWorkflowChange, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (onWorkflowChange) {
        const updatedNodes = nodes.map(node => {
          const change = changes.find(c => c.id === node.id && c.type === 'position');
          if (change && change.position) {
            return { ...node, position: change.position };
          }
          return node;
        });
        onWorkflowChange({ nodes: updatedNodes, edges });
      }
    },
    [onNodesChange, nodes, edges, onWorkflowChange]
  );

  const addApprovalGate = () => {
    const newNode = {
      id: `approval-${Date.now()}`,
      type: 'approval',
      position: { x: 250, y: 150 },
      data: {
        label: 'Approval Gate',
        description: 'Human review required',
        icon: '✋'
      }
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    if (onWorkflowChange) {
      onWorkflowChange({ nodes: newNodes, edges });
    }
  };

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    if (onWorkflowChange) {
      onWorkflowChange({ nodes: [], edges: [] });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport({ nodes, edges });
    }
  };

  const proOptions = { hideAttribution: true };

  return (
    <WorkflowContainer>
      {nodes.length === 0 && (
        <EmptyCanvas>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
          <h3>Empty Workflow Canvas</h3>
          <p>Apply a template or drag tools here to start building</p>
        </EmptyCanvas>
      )}

      <StyledReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'approval') return '#FF9800';
            return '#000000';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            background: 'white',
            border: '2px solid var(--gitthub-black)',
            borderRadius: '4px'
          }}
        />

        {showControls && (
          <Panel position="top-left">
            <ControlPanel>
              <ControlButton onClick={addApprovalGate}>
                ✋ Add Approval Gate
              </ControlButton>
              <ControlButton onClick={handleExport}>
                📤 Export Workflow
              </ControlButton>
              <ControlButton onClick={clearWorkflow}>
                🗑️ Clear Canvas
              </ControlButton>
              <ControlButton onClick={() => setShowControls(false)}>
                ✕ Hide Controls
              </ControlButton>
            </ControlPanel>
          </Panel>
        )}

        {!showControls && (
          <Panel position="top-left">
            <ControlButton
              $primary
              onClick={() => setShowControls(true)}
              style={{ width: 'auto', minWidth: '120px' }}
            >
              ☰ Show Controls
            </ControlButton>
          </Panel>
        )}
      </StyledReactFlow>
    </WorkflowContainer>
  );
}

export default WorkflowBuilder;
