import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  background: white;
  border: 3px solid #FFA500;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.selected {
    border-color: #FF8C00;
    box-shadow: 0 6px 16px rgba(255, 165, 0, 0.4);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const NodeIcon = styled.div`
  font-size: 1.5rem;
`;

const NodeTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--gitthub-black);
  flex: 1;
`;

const NodeBadge = styled.div`
  background: #FFA500;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const NodeDescription = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  line-height: 1.4;
  margin-bottom: 8px;
`;

const NodeParams = styled.div`
  background: #FFF9F0;
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 4px;
  padding: 6px 8px;
  margin-top: 8px;
`;

const ParamLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #FF8C00;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const ParamList = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FF6B6B;
  color: white;
  border: 2px solid white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  ${NodeContainer}:hover & {
    display: flex;
  }

  &:hover {
    background: #FF5252;
    transform: scale(1.1);
  }
`;

function ToolNode({ data, selected }) {
  const paramNames = data.parameters ? Object.keys(data.parameters) : [];

  return (
    <NodeContainer className={selected ? 'selected' : ''}>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#FFA500',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />

      {data.onDelete && (
        <DeleteButton onClick={() => data.onDelete(data.id)}>
          ×
        </DeleteButton>
      )}

      <NodeHeader>
        <NodeIcon>🔧</NodeIcon>
        <NodeTitle>{data.name || 'Tool'}</NodeTitle>
        <NodeBadge>{data.operation_type || 'tool'}</NodeBadge>
      </NodeHeader>

      <NodeDescription>
        {data.description || 'No description'}
      </NodeDescription>

      {paramNames.length > 0 && (
        <NodeParams>
          <ParamLabel>Parameters ({paramNames.length})</ParamLabel>
          <ParamList>
            {paramNames.slice(0, 3).join(', ')}
            {paramNames.length > 3 && ` +${paramNames.length - 3} more`}
          </ParamList>
        </NodeParams>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#FFA500',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
    </NodeContainer>
  );
}

export default ToolNode;
