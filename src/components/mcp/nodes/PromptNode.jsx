import React from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  background: white;
  border: 3px solid #8B5CF6;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.selected {
    border-color: #7C3AED;
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
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
  background: #8B5CF6;
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

const NodeTemplate = styled.div`
  background: #F5F3FF;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 4px;
  padding: 6px 8px;
  margin-top: 8px;
  font-size: 0.75rem;
  color: #5B21B6;
  font-style: italic;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NodeParams = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const ParamTag = styled.div`
  background: #EDE9FE;
  color: #6D28D9;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
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

function PromptNode({ data, selected }) {
  const params = data.parameters || [];

  return (
    <NodeContainer className={selected ? 'selected' : ''}>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#8B5CF6',
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
        <NodeIcon>💬</NodeIcon>
        <NodeTitle>{data.name || '/prompt'}</NodeTitle>
        <NodeBadge>{data.workflow_type || 'single'}</NodeBadge>
      </NodeHeader>

      <NodeDescription>
        {data.description || 'No description'}
      </NodeDescription>

      {data.message_template && (
        <NodeTemplate>
          {data.message_template.substring(0, 100)}
          {data.message_template.length > 100 && '...'}
        </NodeTemplate>
      )}

      {params.length > 0 && (
        <NodeParams>
          {params.slice(0, 4).map((param, index) => (
            <ParamTag key={index}>
              {param.name}
              {param.required && '*'}
            </ParamTag>
          ))}
          {params.length > 4 && (
            <ParamTag>+{params.length - 4}</ParamTag>
          )}
        </NodeParams>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#8B5CF6',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
    </NodeContainer>
  );
}

export default PromptNode;
