import React, { useState } from 'react';
import styled from 'styled-components';
import { usePipeline } from '../../contexts/PipelineContext';
import { OUTPUT_CATEGORIES, getOutputFormatsByCategory } from '../../data/outputFormats';

const Container = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  min-height: 600px;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: var(--gitthub-beige);
  border-bottom: 2px solid var(--gitthub-black);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 500px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: #f9f9f9;
  border-right: 2px solid var(--gitthub-black);
  padding: 1.5rem;

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: 2px solid var(--gitthub-black);
  }
`;

const SidebarTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: ${props => props.$active ? '2px solid var(--gitthub-black)' : '2px solid transparent'};
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: var(--gitthub-black);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: white;
  }
`;

const CategoryIcon = styled.span`
  font-size: 1.25rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
`;

const MainArea = styled.div`
  padding: 1.5rem;
`;

const SelectedOutputsBar = styled.div`
  background: #FFF8E8;
  border: 2px solid #FFA500;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SelectedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SelectedTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--gitthub-black);
`;

const ClearButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 0.85rem;
`;

const SelectedItemIcon = styled.span`
  font-size: 1rem;
`;

const SelectedItemName = styled.span`
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  margin-left: 0.25rem;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #FF0000;
  }
`;

const FormatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const FormatCard = styled.div`
  background: white;
  border: 2px solid ${props => props.$selected ? '#FFA500' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.$selected ? '#FFA500' : 'var(--gitthub-black)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$selected && `
    background: #FFF8E8;
  `}
`;

const FormatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const FormatName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const FormatDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const TemplateSection = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
`;

const TemplateLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TemplateItem = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-black);
  padding-left: 0.75rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--gitthub-gray);
  }
`;

const AddButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: ${props => props.$added ? '#10B981' : '#FFA500'};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gitthub-gray);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyHint = styled.div`
  font-size: 0.9rem;
`;

export default function OutputSelector() {
  const { outputs, addOutput, removeOutput } = usePipeline();
  const [selectedCategory, setSelectedCategory] = useState(OUTPUT_CATEGORIES[0].id);

  const currentFormats = getOutputFormatsByCategory(selectedCategory);

  const isOutputAdded = (formatId) => {
    return outputs.some(output => output.formatId === formatId);
  };

  const handleAddOutput = (format) => {
    if (!isOutputAdded(format.id)) {
      addOutput({
        formatId: format.id,
        type: format.id,
        name: format.name,
        icon: format.icon,
        category: format.category,
        template: format.templates?.[0]?.id || 'default',
        config: {}
      });
    } else {
      // Remove if already added
      const outputToRemove = outputs.find(output => output.formatId === format.id);
      if (outputToRemove) {
        removeOutput(outputToRemove.id);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Select Output Formats</Title>
        <Description>
          Choose how Claude will present the results. You can select multiple output formats.
        </Description>
      </Header>

      <Content>
        <Sidebar>
          <SidebarTitle>Categories</SidebarTitle>
          <CategoryList>
            {OUTPUT_CATEGORIES.map(category => (
              <CategoryButton
                key={category.id}
                $active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CategoryIcon>{category.icon}</CategoryIcon>
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                </CategoryInfo>
              </CategoryButton>
            ))}
          </CategoryList>
        </Sidebar>

        <MainArea>
          {outputs.length > 0 && (
            <SelectedOutputsBar>
              <SelectedHeader>
                <SelectedTitle>Selected Outputs ({outputs.length})</SelectedTitle>
                <ClearButton onClick={() => outputs.forEach(output => removeOutput(output.id))}>
                  Clear All
                </ClearButton>
              </SelectedHeader>
              <SelectedList>
                {outputs.map(output => (
                  <SelectedItem key={output.id}>
                    <SelectedItemIcon>{output.icon}</SelectedItemIcon>
                    <SelectedItemName>{output.name}</SelectedItemName>
                    <RemoveButton onClick={() => removeOutput(output.id)}>×</RemoveButton>
                  </SelectedItem>
                ))}
              </SelectedList>
            </SelectedOutputsBar>
          )}

          {currentFormats.length > 0 ? (
            <FormatGrid>
              {currentFormats.map(format => {
                const added = isOutputAdded(format.id);
                return (
                  <FormatCard
                    key={format.id}
                    $selected={added}
                    onClick={() => handleAddOutput(format)}
                  >
                    <AddButton $added={added}>
                      {added ? '✓' : '+'}
                    </AddButton>
                    <FormatIcon>{format.icon}</FormatIcon>
                    <FormatName>{format.name}</FormatName>
                    <FormatDescription>{format.description}</FormatDescription>
                    {format.templates && format.templates.length > 0 && (
                      <TemplateSection>
                        <TemplateLabel>Available Templates</TemplateLabel>
                        <TemplateList>
                          {format.templates.slice(0, 3).map((template, idx) => (
                            <TemplateItem key={idx}>{template.name}</TemplateItem>
                          ))}
                          {format.templates.length > 3 && (
                            <TemplateItem>+{format.templates.length - 3} more</TemplateItem>
                          )}
                        </TemplateList>
                      </TemplateSection>
                    )}
                  </FormatCard>
                );
              })}
            </FormatGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyText>No output formats available</EmptyText>
              <EmptyHint>Select a category from the sidebar</EmptyHint>
            </EmptyState>
          )}
        </MainArea>
      </Content>
    </Container>
  );
}
