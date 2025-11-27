import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { carbonColors, carbonSpacing } from '../../../styles/carbonTheme';

const NodeContainer = styled.div`
  background: ${carbonColors.layer01};
  border: 2px solid ${props => props.$selected ? carbonColors.interactive01 : '#00539B'};
  border-radius: 8px;
  padding: ${carbonSpacing.spacing03};
  width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 24px;
  height: 24px;
  background: #00539B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid ${carbonColors.layer01};
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${carbonSpacing.spacing02};
`;

const NodeTitle = styled.div`
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${carbonColors.text01};
  line-height: 1.3;
  flex: 1;
  padding-right: ${carbonSpacing.spacing02};
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

const ExpandButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.625rem;
  margin-top: ${carbonSpacing.spacing02};
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s ease;

  &:hover {
    color: ${carbonColors.text01};
  }
`;

const InstructionText = styled.div`
  font-size: 0.6875rem;
  color: ${carbonColors.text02};
  line-height: 1.4;
  margin-top: ${carbonSpacing.spacing02};
  max-height: ${props => props.$expanded ? 'none' : '2.8em'};
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${props => props.$expanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.$expanded ? 'unset' : 2};
  -webkit-box-orient: vertical;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: ${carbonSpacing.spacing02};
`;

const Tag = styled.span`
  padding: 2px 6px;
  background: ${props => props.$type === 'skill' ? '#d0e2ff' : '#e8daff'};
  color: ${props => props.$type === 'skill' ? '#0043ce' : '#6929c4'};
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
`;

const DeliverableText = styled.div`
  font-size: 0.625rem;
  color: ${carbonColors.text03};
  font-style: italic;
  margin-top: ${carbonSpacing.spacing02};
  padding-top: ${carbonSpacing.spacing02};
  border-top: 1px solid ${carbonColors.ui04};
`;

const HandleLabel = styled.div`
  position: absolute;
  font-size: 0.5rem;
  color: ${carbonColors.text03};
  white-space: nowrap;
  pointer-events: none;

  ${props => props.$position === 'left' ? `
    right: calc(100% + 8px);
    text-align: right;
  ` : `
    left: calc(100% + 8px);
    text-align: left;
  `}
`;

const handleStyle = {
  background: '#00539B',
  width: 8,
  height: 8,
  border: '2px solid white',
};

function StepNode({ data, selected }) {
  const [expanded, setExpanded] = useState(false);

  // Handle node delete
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  // Calculate handle positions
  const inputCount = data.inputs?.length || 1;
  const outputCount = data.outputs?.length || 1;

  const getHandlePosition = (index, total) => {
    return `${((index + 1) / (total + 1)) * 100}%`;
  };

  return (
    <NodeContainer $selected={selected}>
      <StepNumber>{data.step_number || 1}</StepNumber>

      {/* Input Handles */}
      {(data.inputs || ['input']).map((input, idx) => (
        <React.Fragment key={`input-${idx}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${idx}`}
            style={{
              ...handleStyle,
              top: getHandlePosition(idx, inputCount),
            }}
          />
          {data.showHandleLabels && (
            <HandleLabel
              $position="left"
              style={{ top: getHandlePosition(idx, inputCount), transform: 'translateY(-50%)' }}
            >
              {input}
            </HandleLabel>
          )}
        </React.Fragment>
      ))}

      {/* Output Handles */}
      {(data.outputs || ['output']).map((output, idx) => (
        <React.Fragment key={`output-${idx}`}>
          <Handle
            type="source"
            position={Position.Right}
            id={`output-${idx}`}
            style={{
              ...handleStyle,
              top: getHandlePosition(idx, outputCount),
            }}
          />
          {data.showHandleLabels && (
            <HandleLabel
              $position="right"
              style={{ top: getHandlePosition(idx, outputCount), transform: 'translateY(-50%)' }}
            >
              {output}
            </HandleLabel>
          )}
        </React.Fragment>
      ))}

      <NodeHeader>
        <NodeTitle title={data.title}>
          {data.title || `Step ${data.step_number || 1}`}
        </NodeTitle>
        <DeleteButton onClick={handleDelete} title="Delete node">
          ×
        </DeleteButton>
      </NodeHeader>

      {data.instruction && (
        <>
          <InstructionText $expanded={expanded}>
            {data.instruction}
          </InstructionText>
          {data.instruction.length > 100 && (
            <ExpandButton onClick={() => setExpanded(!expanded)}>
              {expanded ? '▲ Less' : '▼ More'}
            </ExpandButton>
          )}
        </>
      )}

      {/* Skills and Tools Tags */}
      {((data.skills && data.skills.length > 0) || (data.tools && data.tools.length > 0)) && (
        <TagsContainer>
          {data.skills?.slice(0, 2).map((skill, idx) => (
            <Tag key={`skill-${idx}`} $type="skill" title={skill}>
              {skill.length > 12 ? skill.substring(0, 12) + '...' : skill}
            </Tag>
          ))}
          {data.tools?.slice(0, 2).map((tool, idx) => (
            <Tag key={`tool-${idx}`} $type="tool" title={tool}>
              {tool.length > 12 ? tool.substring(0, 12) + '...' : tool}
            </Tag>
          ))}
        </TagsContainer>
      )}

      {/* Deliverable */}
      {data.deliverable && (
        <DeliverableText title={data.deliverable}>
          {data.deliverable.length > 50
            ? data.deliverable.substring(0, 50) + '...'
            : data.deliverable}
        </DeliverableText>
      )}
    </NodeContainer>
  );
}

export default memo(StepNode);
