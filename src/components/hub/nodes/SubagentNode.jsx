import React, { memo } from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { carbonColors, carbonSpacing } from '../../../styles/carbonTheme';

const NodeContainer = styled.div`
  background: ${carbonColors.layer01};
  border: 2px solid ${props => props.$selected ? carbonColors.interactive01 : '#ff7eb6'};
  border-radius: 8px;
  padding: ${carbonSpacing.spacing04};
  min-width: 220px;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  margin-bottom: ${carbonSpacing.spacing03};
`;

const NodeIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #ff7eb6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const NodeTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: 2px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${carbonColors.supportError};
  }
`;

const NodeContent = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text02};
  line-height: 1.4;
`;

const NodeMeta = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing02};
  margin-top: ${carbonSpacing.spacing02};
`;

const MetaBadge = styled.span`
  padding: 2px 6px;
  background: #ffe4f0;
  color: #9d174d;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
`;

const handleStyle = {
  background: '#ff7eb6',
  width: 10,
  height: 10,
  border: '2px solid white',
};

function SubagentNode({ data, selected }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  return (
    <NodeContainer $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />

      <NodeHeader>
        <NodeIcon>A</NodeIcon>
        <NodeTitle title={data.label || data.name}>
          {data.label || data.name || 'Subagent'}
        </NodeTitle>
        <DeleteButton onClick={handleDelete} title="Delete node">
          X
        </DeleteButton>
      </NodeHeader>

      <NodeContent>
        {data.description || data.category || 'Subagent node'}
      </NodeContent>

      <NodeMeta>
        {data.category && <MetaBadge>{data.category}</MetaBadge>}
        <MetaBadge>Subagent</MetaBadge>
      </NodeMeta>

      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </NodeContainer>
  );
}

export default memo(SubagentNode);
