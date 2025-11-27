import React, { useState } from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from 'reactflow';

const PanelContainer = styled.div`
  padding: 1.5rem;
  background: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: var(--gitthub-gray);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ExportOptions = styled.div`
  display: grid;
  gap: 1rem;
`;

const ExportCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: var(--gitthub-black);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FormatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormatIcon = styled.div`
  font-size: 2rem;
`;

const FormatInfo = styled.div`
  flex: 1;
`;

const FormatName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
`;

const FormatDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const ExportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #FFA500;
  color: white;
  border: 1px solid black;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  width: 100%;

  &:hover {
    background: #FF9400;
  }

  &:active {
    background: #FF8300;
    box-shadow: none;
    transform: translate(1px, 1px);
  }

  &:disabled {
    background: var(--gitthub-gray);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SuccessMessage = styled.div`
  background: #E8F5E9;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: #2E7D32;
  font-weight: 600;
  text-align: center;
`;

function ExportPanel({ workflow, reactFlowInstance }) {
  const [exportStatus, setExportStatus] = useState(null);

  const exportToJSON = () => {
    const config = {
      workflow: {
        nodes: workflow.nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        })),
        edges: workflow.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: edge.animated
        }))
      },
      metadata: {
        created: new Date().toISOString(),
        nodeCount: workflow.nodes.length,
        edgeCount: workflow.edges.length
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportStatus('JSON workflow exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const exportToMermaid = () => {
    let mermaid = 'graph TD\n';

    workflow.nodes.forEach(node => {
      const nodeId = node.id.replace(/-/g, '_');
      const label = node.data.label;
      if (node.type === 'approval') {
        mermaid += `  ${nodeId}{{${label}}}\n`;
      } else {
        mermaid += `  ${nodeId}[${label}]\n`;
      }
    });

    workflow.edges.forEach(edge => {
      const sourceId = edge.source.replace(/-/g, '_');
      const targetId = edge.target.replace(/-/g, '_');
      const arrow = edge.animated ? '==>' : '-->';
      mermaid += `  ${sourceId} ${arrow} ${targetId}\n`;
    });

    const blob = new Blob([mermaid], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-diagram-${Date.now()}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportStatus('Mermaid diagram exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const exportToPNG = async () => {
    if (!reactFlowInstance) {
      setExportStatus('Unable to export: Workflow instance not available');
      setTimeout(() => setExportStatus(null), 3000);
      return;
    }

    try {
      const nodesBounds = getNodesBounds(workflow.nodes);
      const viewport = getViewportForBounds(
        nodesBounds,
        nodesBounds.width,
        nodesBounds.height,
        0.5,
        2,
        0.2
      );

      const dataUrl = await toPng(
        document.querySelector('.react-flow__viewport'),
        {
          backgroundColor: '#ffffff',
          width: nodesBounds.width * 2,
          height: nodesBounds.height * 2,
          style: {
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
          }
        }
      );

      const a = document.createElement('a');
      a.setAttribute('download', `workflow-${Date.now()}.png`);
      a.setAttribute('href', dataUrl);
      a.click();

      setExportStatus('PNG image exported successfully!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export to PNG failed:', error);
      setExportStatus('PNG export failed. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const exportToYAML = () => {
    const yamlContent = `# Workflow Configuration
# Generated on: ${new Date().toISOString()}

workflow:
  name: "Custom Workflow"
  description: "Auto-generated workflow configuration"

  nodes:
${workflow.nodes.map(node => `    - id: ${node.id}
      type: ${node.type}
      label: "${node.data.label}"
      position:
        x: ${node.position.x}
        y: ${node.position.y}
      ${node.data.description ? `description: "${node.data.description}"` : ''}`).join('\n')}

  connections:
${workflow.edges.map(edge => `    - from: ${edge.source}
      to: ${edge.target}
      ${edge.animated ? 'animated: true' : ''}`).join('\n')}

metadata:
  node_count: ${workflow.nodes.length}
  edge_count: ${workflow.edges.length}
`;

    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-config-${Date.now()}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportStatus('YAML configuration exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const hasWorkflow = workflow && workflow.nodes && workflow.nodes.length > 0;

  return (
    <PanelContainer>
      <Title>Export Workflow</Title>
      <Description>
        Export your workflow in multiple formats for documentation, version control, or integration with other tools.
      </Description>

      <ExportOptions>
        <ExportCard>
          <FormatHeader>
            <FormatIcon>📄</FormatIcon>
            <FormatInfo>
              <FormatName>JSON Configuration</FormatName>
              <FormatDescription>
                Machine-readable format for version control and API integration
              </FormatDescription>
            </FormatInfo>
          </FormatHeader>
          <ExportButton onClick={exportToJSON} disabled={!hasWorkflow}>
            Export as JSON
          </ExportButton>
        </ExportCard>

        <ExportCard>
          <FormatHeader>
            <FormatIcon>📊</FormatIcon>
            <FormatInfo>
              <FormatName>Mermaid Diagram</FormatName>
              <FormatDescription>
                Markdown-compatible flowchart for documentation (GitHub, Notion, etc.)
              </FormatDescription>
            </FormatInfo>
          </FormatHeader>
          <ExportButton onClick={exportToMermaid} disabled={!hasWorkflow}>
            Export as Mermaid
          </ExportButton>
        </ExportCard>

        <ExportCard>
          <FormatHeader>
            <FormatIcon>🖼️</FormatIcon>
            <FormatInfo>
              <FormatName>PNG Image</FormatName>
              <FormatDescription>
                Visual diagram for presentations and documentation
              </FormatDescription>
            </FormatInfo>
          </FormatHeader>
          <ExportButton onClick={exportToPNG} disabled={!hasWorkflow}>
            Export as PNG
          </ExportButton>
        </ExportCard>

        <ExportCard>
          <FormatHeader>
            <FormatIcon>⚙️</FormatIcon>
            <FormatInfo>
              <FormatName>YAML Configuration</FormatName>
              <FormatDescription>
                Infrastructure-as-code format for deployment pipelines
              </FormatDescription>
            </FormatInfo>
          </FormatHeader>
          <ExportButton onClick={exportToYAML} disabled={!hasWorkflow}>
            Export as YAML
          </ExportButton>
        </ExportCard>
      </ExportOptions>

      {exportStatus && <SuccessMessage>{exportStatus}</SuccessMessage>}

      {!hasWorkflow && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#FFF3E0',
          border: '2px solid #FF9800',
          borderRadius: '8px',
          color: '#E65100',
          textAlign: 'center'
        }}>
          Create a workflow first to enable export functionality
        </div>
      )}
    </PanelContainer>
  );
}

export default ExportPanel;
