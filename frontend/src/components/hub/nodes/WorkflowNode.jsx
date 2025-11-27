import React, { memo } from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { carbonColors, carbonSpacing } from '../../../styles/carbonTheme';

const NodeContainer = styled.div`
  background: ${props => props.$hasSteps ? 'rgba(240, 246, 254, 0.95)' : carbonColors.layer01};
  border: ${props => props.$hasSteps ? '3px solid #0f62fe' : `2px solid ${props.$selected ? carbonColors.interactive01 : '#0f62fe'}`};
  border-radius: ${props => props.$hasSteps ? '12px' : '8px'};
  padding: ${carbonSpacing.spacing04};
  min-width: ${props => props.$hasSteps ? '260px' : '220px'};
  max-width: ${props => props.$hasSteps ? '320px' : '280px'};
  box-shadow: ${props => props.$hasSteps ? '0 4px 16px rgba(15, 98, 254, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.15)'};
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    box-shadow: ${props => props.$hasSteps ? '0 6px 20px rgba(15, 98, 254, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)'};
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
  background: #0f62fe;
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
  background: #dbeafe;
  color: #1e40af;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
`;

const StepCountBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #0f62fe;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid ${carbonColors.layer01};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ExpandedIndicator = styled.div`
  font-size: 0.625rem;
  color: #0f62fe;
  font-weight: 600;
  margin-top: ${carbonSpacing.spacing02};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '▼';
    font-size: 0.5rem;
  }
`;

const handleStyle = {
  background: '#0f62fe',
  width: 10,
  height: 10,
  border: '2px solid white',
};

function WorkflowNode({ data, selected }) {
  const hasSteps = data.steps && data.steps.length > 0;
  const stepCount = data.steps?.length || 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  return (
    <NodeContainer $selected={selected} $hasSteps={hasSteps}>
      {hasSteps && <StepCountBadge title={`${stepCount} steps`}>{stepCount}</StepCountBadge>}

      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />

      <NodeHeader>
        <NodeIcon>📋</NodeIcon>
        <NodeTitle title={data.label || data.title}>
          {data.label || data.title || 'Workflow'}
        </NodeTitle>
        <DeleteButton onClick={handleDelete} title="Delete node">
          ×
        </DeleteButton>
      </NodeHeader>

      <NodeContent>
        {data.description || data.type || 'Workflow node'}
      </NodeContent>

      <NodeMeta>
        {data.type && <MetaBadge>{data.type}</MetaBadge>}
        {data.difficulty && <MetaBadge>{data.difficulty}</MetaBadge>}
        {data.estimated_time && <MetaBadge>{data.estimated_time}</MetaBadge>}
      </NodeMeta>

      {hasSteps && data.expanded && <ExpandedIndicator>Expanded</ExpandedIndicator>}

      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </NodeContainer>
  );
}

export default memo(WorkflowNode);
