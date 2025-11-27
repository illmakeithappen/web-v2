import React, { useState } from 'react';
import styled from 'styled-components';
import { WORKFLOW_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/workflowTemplates';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const FilterBar = styled.div`
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-gray);
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${props => props.$active ? 'var(--gitthub-black)' : 'var(--gitthub-light-beige)'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid var(--gitthub-black);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'var(--gitthub-gray)' : 'var(--gitthub-beige)'};
  }
`;

const TemplatesGrid = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
`;

const TemplateCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: fit-content;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: var(--gitthub-beige);
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TemplateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
  flex: 1;
`;

const CategoryBadge = styled.span`
  background: var(--gitthub-black);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 0.5rem;
`;

const TemplateDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gitthub-gray);
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const WorkflowPreview = styled.div`
  background: white;
  border: 1px solid var(--gitthub-gray);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const NodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NodeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--gitthub-light-beige);
  border-radius: 4px;
  font-size: 0.85rem;
`;

const NodeIcon = styled.span`
  font-size: 1.2rem;
`;

const NodeLabel = styled.span`
  font-weight: 600;
  color: var(--gitthub-black);
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 1rem;
`;

const ToolBadge = styled.span`
  background: white;
  color: var(--gitthub-black);
  border: 1px solid var(--gitthub-gray);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #FFA500;
  color: white;
  border: 1px solid black;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    background: #FF9400;
  }

  &:active {
    background: #FF8300;
    box-shadow: none;
    transform: translate(1px, 1px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--gitthub-gray);
`;

function TemplatesPanel({ onTemplateApply }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(template =>
    selectedCategory === 'All' || template.category === selectedCategory
  );

  const handleApplyTemplate = (template) => {
    if (onTemplateApply) {
      onTemplateApply(template);
    }
  };

  return (
    <PanelContainer>
      <FilterBar>
        <CategoryFilter>
          {TEMPLATE_CATEGORIES.map(category => (
            <CategoryButton
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryFilter>
      </FilterBar>

      <TemplatesGrid>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <TemplateCard key={template.id}>
              <TemplateHeader>
                <TemplateTitle>{template.name}</TemplateTitle>
                <CategoryBadge>{template.category}</CategoryBadge>
              </TemplateHeader>

              <TemplateDescription>{template.description}</TemplateDescription>

              <WorkflowPreview>
                <PreviewTitle>Workflow Components</PreviewTitle>
                <NodesList>
                  {template.nodes.slice(0, 4).map((node, index) => (
                    <NodeItem key={node.id}>
                      <NodeIcon>{node.data.icon}</NodeIcon>
                      <NodeLabel>{node.data.label}</NodeLabel>
                    </NodeItem>
                  ))}
                  {template.nodes.length > 4 && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--gitthub-gray)',
                      padding: '0.25rem 0.5rem',
                      fontStyle: 'italic'
                    }}>
                      +{template.nodes.length - 4} more components
                    </div>
                  )}
                </NodesList>
              </WorkflowPreview>

              <ToolsList>
                {template.tools.map(tool => (
                  <ToolBadge key={tool}>{tool}</ToolBadge>
                ))}
              </ToolsList>

              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <ApplyButton onClick={() => handleApplyTemplate(template)}>
                  Apply Template
                </ApplyButton>
              </div>
            </TemplateCard>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3>No Templates Found</h3>
            <p>Try selecting a different category</p>
          </EmptyState>
        )}
      </TemplatesGrid>
    </PanelContainer>
  );
}

export default TemplatesPanel;
