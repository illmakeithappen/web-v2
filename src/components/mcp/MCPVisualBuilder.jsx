import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import axios from 'axios';
import dagre from 'dagre';

import ToolNode from './nodes/ToolNode';
import ResourceNode from './nodes/ResourceNode';
import PromptNode from './nodes/PromptNode';
import BuildingBlockLibrary from './BuildingBlockLibrary';

const API_URL = import.meta.env.VITE_API_URL || '';

const BuilderContainer = styled.div`
  display: flex;
  flex: 1;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background: #FAFAFA;
`;

const ConfigPanel = styled.div`
  width: 320px;
  background: white;
  border-left: 2px solid var(--gitthub-black);
  overflow-y: auto;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const PanelHeader = styled.div`
  background: var(--gitthub-light-beige);
  border-bottom: 2px solid var(--gitthub-black);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.25rem 0;
`;

const PanelSubtitle = styled.p`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const PanelContent = styled.div`
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #FFA500;
  }
`;

const ToolbarPanel = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ToolbarButton = styled.button`
  padding: 0.75rem;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--gitthub-black);
    color: white;
    transform: translateY(-1px);
  }
`;

const StatsPanel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 5;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.$color || '#FFA500'};
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: var(--gitthub-gray);
  font-weight: 600;
`;


const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #FFA500;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gitthub-black);
`;

const nodeTypes = {
  tool: ToolNode,
  resource: ResourceNode,
  prompt: PromptNode,
};

let nodeId = 0;

function MCPVisualBuilderInner({ serverConfig, onConfigUpdate, onGenerateCode, onBack }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Initialize nodes from serverConfig
  React.useEffect(() => {
    const initialNodes = [];
    let yOffset = 50;

    // Add tool nodes
    serverConfig.tools.forEach((tool, index) => {
      initialNodes.push({
        id: `tool-${nodeId++}`,
        type: 'tool',
        position: { x: 50, y: yOffset },
        data: {
          ...tool,
          onDelete: handleDeleteNode,
        },
      });
      yOffset += 180;
    });

    yOffset = 50;
    // Add resource nodes
    serverConfig.resources.forEach((resource, index) => {
      initialNodes.push({
        id: `resource-${nodeId++}`,
        type: 'resource',
        position: { x: 350, y: yOffset },
        data: {
          ...resource,
          onDelete: handleDeleteNode,
        },
      });
      yOffset += 180;
    });

    yOffset = 50;
    // Add prompt nodes
    serverConfig.prompts.forEach((prompt, index) => {
      initialNodes.push({
        id: `prompt-${nodeId++}`,
        type: 'prompt',
        position: { x: 650, y: yOffset },
        data: {
          ...prompt,
          onDelete: handleDeleteNode,
        },
      });
      yOffset += 180;
    });

    setNodes(initialNodes);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (!data) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${data.type}-${nodeId++}`,
        type: data.type,
        position,
        data: {
          ...data.block,
          onDelete: handleDeleteNode,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = (field, value) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );

    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  const autoLayout = useCallback(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 150 });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 250, height: 150 });
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
          x: nodeWithPosition.x - 125,
          y: nodeWithPosition.y - 75,
        },
      };
    });

    setNodes(layoutedNodes);
  }, [nodes, edges, setNodes]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Extract config from nodes
    const tools = nodes
      .filter((n) => n.type === 'tool')
      .map((n) => ({
        name: n.data.name || 'tool',
        operation_type: n.data.operation_type || 'read',
        description: n.data.description || '',
        parameters: n.data.parameters || {},
        api_endpoint: n.data.api_endpoint,
        requires_auth: n.data.requires_auth || false,
      }));

    const resources = nodes
      .filter((n) => n.type === 'resource')
      .map((n) => ({
        uri_pattern: n.data.uri_pattern || n.data.uri || 'protocol://resource',
        resource_type: n.data.resource_type || 'static',
        mime_type: n.data.mime_type || 'application/json',
        description: n.data.description || '',
        data_source: n.data.data_source || 'API',
        data_source_config: n.data.data_source_config || {},
      }));

    const prompts = nodes
      .filter((n) => n.type === 'prompt')
      .map((n) => ({
        name: n.data.name || '/prompt',
        workflow_type: n.data.workflow_type || 'single_step',
        description: n.data.description || '',
        parameters: n.data.parameters || [],
        message_template: n.data.message_template || '',
      }));

    const updatedConfig = {
      ...serverConfig,
      tools,
      resources,
      prompts,
    };

    onConfigUpdate(updatedConfig);

    try {
      const response = await axios.post(`${API_URL}/api/v1/mcp/generate`, {
        config: updatedConfig,
        include_tests: true,
        include_docker: false,
      });

      onGenerateCode(response.data);
    } catch (error) {
      console.error('Code generation error:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toolCount = nodes.filter((n) => n.type === 'tool').length;
  const resourceCount = nodes.filter((n) => n.type === 'resource').length;
  const promptCount = nodes.filter((n) => n.type === 'prompt').length;

  return (
    <>
      <BuilderContainer>
        <BuildingBlockLibrary />

        <CanvasContainer ref={reactFlowWrapper}>
          {isGenerating && (
            <LoadingOverlay>
              <LoadingSpinner />
              <LoadingText>Generating MCP server code...</LoadingText>
            </LoadingOverlay>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'tool') return '#FFA500';
                if (node.type === 'resource') return '#10B981';
                return '#8B5CF6';
              }}
            />

            <ToolbarPanel>
              <ToolbarButton onClick={autoLayout} title="Auto-arrange nodes">
                🎯 Auto Layout
              </ToolbarButton>
              <ToolbarButton onClick={() => setNodes([])} title="Clear canvas">
                🗑️ Clear All
              </ToolbarButton>
            </ToolbarPanel>

            <StatsPanel>
              <StatItem>
                <StatNumber $color="#FFA500">{toolCount}</StatNumber>
                <StatLabel>Tools</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber $color="#10B981">{resourceCount}</StatNumber>
                <StatLabel>Resources</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber $color="#8B5CF6">{promptCount}</StatNumber>
                <StatLabel>Prompts</StatLabel>
              </StatItem>
            </StatsPanel>
          </ReactFlow>
        </CanvasContainer>

        <ConfigPanel $show={selectedNode !== null}>
          <PanelHeader>
            <PanelTitle>
              {selectedNode?.type === 'tool' && '🔧 Tool Configuration'}
              {selectedNode?.type === 'resource' && '📁 Resource Configuration'}
              {selectedNode?.type === 'prompt' && '💬 Prompt Configuration'}
            </PanelTitle>
            <PanelSubtitle>
              {selectedNode ? 'Click outside to deselect' : 'Select a node to edit'}
            </PanelSubtitle>
          </PanelHeader>

          {selectedNode && (
            <PanelContent>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={selectedNode.data.name || ''}
                  onChange={(e) => handleNodeUpdate('name', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={selectedNode.data.description || ''}
                  onChange={(e) => handleNodeUpdate('description', e.target.value)}
                />
              </FormGroup>

              {selectedNode.type === 'tool' && (
                <FormGroup>
                  <Label>Operation Type</Label>
                  <Select
                    value={selectedNode.data.operation_type || 'read'}
                    onChange={(e) => handleNodeUpdate('operation_type', e.target.value)}
                  >
                    <option value="create">Create</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="search">Search</option>
                    <option value="calculate">Calculate</option>
                    <option value="transform">Transform</option>
                    <option value="api_call">API Call</option>
                    <option value="file_operation">File Operation</option>
                  </Select>
                </FormGroup>
              )}

              {selectedNode.type === 'resource' && (
                <>
                  <FormGroup>
                    <Label>URI Pattern</Label>
                    <Input
                      type="text"
                      value={selectedNode.data.uri_pattern || selectedNode.data.uri || ''}
                      onChange={(e) => handleNodeUpdate('uri_pattern', e.target.value)}
                      placeholder="protocol://path/{param}"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Resource Type</Label>
                    <Select
                      value={selectedNode.data.resource_type || 'static'}
                      onChange={(e) => handleNodeUpdate('resource_type', e.target.value)}
                    >
                      <option value="static">Static</option>
                      <option value="templated">Templated</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>MIME Type</Label>
                    <Select
                      value={selectedNode.data.mime_type || 'application/json'}
                      onChange={(e) => handleNodeUpdate('mime_type', e.target.value)}
                    >
                      <option value="application/json">application/json</option>
                      <option value="text/plain">text/plain</option>
                      <option value="text/markdown">text/markdown</option>
                      <option value="text/html">text/html</option>
                    </Select>
                  </FormGroup>
                </>
              )}

              {selectedNode.type === 'prompt' && (
                <>
                  <FormGroup>
                    <Label>Workflow Type</Label>
                    <Select
                      value={selectedNode.data.workflow_type || 'single_step'}
                      onChange={(e) => handleNodeUpdate('workflow_type', e.target.value)}
                    >
                      <option value="single_step">Single Step</option>
                      <option value="multi_step">Multi Step</option>
                      <option value="interactive">Interactive</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Message Template</Label>
                    <TextArea
                      value={selectedNode.data.message_template || ''}
                      onChange={(e) => handleNodeUpdate('message_template', e.target.value)}
                      placeholder="Use {{variable}} for parameters..."
                    />
                  </FormGroup>
                </>
              )}
            </PanelContent>
          )}
        </ConfigPanel>
      </BuilderContainer>
    </>
  );
}

function MCPVisualBuilder(props) {
  return (
    <ReactFlowProvider>
      <MCPVisualBuilderInner {...props} />
    </ReactFlowProvider>
  );
}

export default MCPVisualBuilder;
