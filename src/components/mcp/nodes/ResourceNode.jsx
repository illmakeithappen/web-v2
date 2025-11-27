import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  background: white;
  border: 3px solid #10B981;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.selected {
    border-color: #059669;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
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
  background: #10B981;
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

const NodeUri = styled.div`
  background: #D1FAE5;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 4px;
  padding: 6px 8px;
  margin-top: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  color: #065F46;
  word-break: break-all;
`;

const NodeMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.7rem;
  color: var(--gitthub-gray);
`;

const MetaItem = styled.div`
  background: #F0FDF4;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
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

function ResourceNode({ data, selected }) {
  return (
    <NodeContainer className={selected ? 'selected' : ''}>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#10B981',
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
        <NodeIcon>📁</NodeIcon>
        <NodeTitle>Resource</NodeTitle>
        <NodeBadge>{data.resource_type || 'static'}</NodeBadge>
      </NodeHeader>

      <NodeDescription>
        {data.description || 'No description'}
      </NodeDescription>

      <NodeUri>{data.uri_pattern || 'protocol://resource'}</NodeUri>

      <NodeMeta>
        <MetaItem>{data.mime_type || 'application/json'}</MetaItem>
        <MetaItem>{data.data_source || 'API'}</MetaItem>
      </NodeMeta>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#10B981',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
    </NodeContainer>
  );
}

export default ResourceNode;
