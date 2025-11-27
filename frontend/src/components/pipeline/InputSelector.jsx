import React, { useState } from 'react';
import styled from 'styled-components';
import { usePipeline } from '../../contexts/PipelineContext';
import { INPUT_CATEGORIES, getInputSourcesByCategory } from '../../data/inputSources';

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

const SourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const SourceCard = styled.div`
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

const SourceIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const SourceName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin: 0 0 0.5rem 0;
`;

const SourceDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const SourceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SourceTag = styled.span`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  color: var(--gitthub-gray);
  font-weight: 500;
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

const SelectedInputsBar = styled.div`
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

export default function InputSelector() {
  const { inputs, addInput, removeInput } = usePipeline();
  const [selectedCategory, setSelectedCategory] = useState(INPUT_CATEGORIES[0].id);

  const currentSources = getInputSourcesByCategory(selectedCategory);

  const isInputAdded = (sourceId) => {
    return inputs.some(input => input.sourceId === sourceId);
  };

  const handleAddInput = (source) => {
    if (!isInputAdded(source.id)) {
      addInput({
        sourceId: source.id,
        type: source.id,
        name: source.name,
        icon: source.icon,
        category: source.category,
        config: {}
      });
    } else {
      // Remove if already added
      const inputToRemove = inputs.find(input => input.sourceId === source.id);
      if (inputToRemove) {
        removeInput(inputToRemove.id);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Select Input Sources</Title>
        <Description>
          Choose where Claude will get data from. You can select multiple input sources.
        </Description>
      </Header>

      <Content>
        <Sidebar>
          <SidebarTitle>Categories</SidebarTitle>
          <CategoryList>
            {INPUT_CATEGORIES.map(category => (
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
          {inputs.length > 0 && (
            <SelectedInputsBar>
              <SelectedHeader>
                <SelectedTitle>Selected Inputs ({inputs.length})</SelectedTitle>
                <ClearButton onClick={() => inputs.forEach(input => removeInput(input.id))}>
                  Clear All
                </ClearButton>
              </SelectedHeader>
              <SelectedList>
                {inputs.map(input => (
                  <SelectedItem key={input.id}>
                    <SelectedItemIcon>{input.icon}</SelectedItemIcon>
                    <SelectedItemName>{input.name}</SelectedItemName>
                    <RemoveButton onClick={() => removeInput(input.id)}>×</RemoveButton>
                  </SelectedItem>
                ))}
              </SelectedList>
            </SelectedInputsBar>
          )}

          {currentSources.length > 0 ? (
            <SourceGrid>
              {currentSources.map(source => {
                const added = isInputAdded(source.id);
                return (
                  <SourceCard
                    key={source.id}
                    $selected={added}
                    onClick={() => handleAddInput(source)}
                  >
                    <AddButton $added={added}>
                      {added ? '✓' : '+'}
                    </AddButton>
                    <SourceIcon>{source.icon}</SourceIcon>
                    <SourceName>{source.name}</SourceName>
                    <SourceDescription>{source.description}</SourceDescription>
                    {source.tags && (
                      <SourceTags>
                        {source.tags.map((tag, idx) => (
                          <SourceTag key={idx}>{tag}</SourceTag>
                        ))}
                      </SourceTags>
                    )}
                  </SourceCard>
                );
              })}
            </SourceGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyText>No input sources available</EmptyText>
              <EmptyHint>Select a category from the sidebar</EmptyHint>
            </EmptyState>
          )}
        </MainArea>
      </Content>
    </Container>
  );
}
