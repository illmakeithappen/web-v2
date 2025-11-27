import React, { useState } from 'react';
import styled from 'styled-components';

const SuggesterContainer = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const AnalysisSection = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AnalysisTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
`;

const AnalysisText = styled.p`
  font-size: 0.9rem;
  color: var(--gitthub-black);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ConfidenceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ConfidenceLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gitthub-gray);
`;

const ConfidenceTrack = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => props.$score >= 0.8 ? '#10B981' : props.$score >= 0.6 ? '#FFA500' : '#FF6B6B'};
  width: ${props => props.$score * 100}%;
  transition: width 0.3s ease;
`;

const ConfidenceScore = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gitthub-black);
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ComponentColumn = styled.div``;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const ColumnIcon = styled.div`
  font-size: 1.5rem;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
`;

const ColumnCount = styled.span`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin-left: auto;
`;

const ComponentCard = styled.div`
  background: ${props => props.$accepted ? 'white' : 'var(--gitthub-light-beige)'};
  border: 2px solid ${props => props.$accepted ? '#10B981' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;

  ${props => !props.$accepted && `
    opacity: 0.7;
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const CardName = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--gitthub-black);
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const CardDescription = styled.div`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  line-height: 1.4;
  margin-bottom: 0.75rem;
`;

const CardReason = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  font-style: italic;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gitthub-gray);
  font-size: 0.9rem;
`;


function ComponentSuggester({ analysis, serverConfig, onConfigUpdate, onNext, onBack }) {
  const [acceptedTools, setAcceptedTools] = useState(
    new Set(serverConfig.tools.map((_, i) => i))
  );
  const [acceptedResources, setAcceptedResources] = useState(
    new Set(serverConfig.resources.map((_, i) => i))
  );
  const [acceptedPrompts, setAcceptedPrompts] = useState(
    new Set(serverConfig.prompts.map((_, i) => i))
  );

  const toggleTool = (index) => {
    const newAccepted = new Set(acceptedTools);
    if (newAccepted.has(index)) {
      newAccepted.delete(index);
    } else {
      newAccepted.add(index);
    }
    setAcceptedTools(newAccepted);
  };

  const toggleResource = (index) => {
    const newAccepted = new Set(acceptedResources);
    if (newAccepted.has(index)) {
      newAccepted.delete(index);
    } else {
      newAccepted.add(index);
    }
    setAcceptedResources(newAccepted);
  };

  const togglePrompt = (index) => {
    const newAccepted = new Set(acceptedPrompts);
    if (newAccepted.has(index)) {
      newAccepted.delete(index);
    } else {
      newAccepted.add(index);
    }
    setAcceptedPrompts(newAccepted);
  };

  const handleNext = () => {
    // Filter config to only include accepted items
    const updatedConfig = {
      ...serverConfig,
      tools: serverConfig.tools.filter((_, i) => acceptedTools.has(i)),
      resources: serverConfig.resources.filter((_, i) => acceptedResources.has(i)),
      prompts: serverConfig.prompts.filter((_, i) => acceptedPrompts.has(i))
    };

    onConfigUpdate(updatedConfig);
    onNext();
  };

  return (
    <SuggesterContainer>
      <SectionTitle>Step 2: Review AI Suggestions</SectionTitle>
      <SectionDescription>
        Based on your workflow description, we've suggested MCP building blocks.
        Accept, reject, or modify each suggestion before moving forward.
      </SectionDescription>

      <AnalysisSection>
        <AnalysisTitle>AI Analysis</AnalysisTitle>
        <AnalysisText>{analysis?.reasoning || 'No analysis available'}</AnalysisText>
        <ConfidenceBar>
          <ConfidenceLabel>Confidence:</ConfidenceLabel>
          <ConfidenceTrack>
            <ConfidenceFill $score={analysis?.confidence_score || 0} />
          </ConfidenceTrack>
          <ConfidenceScore>
            {Math.round((analysis?.confidence_score || 0) * 100)}%
          </ConfidenceScore>
        </ConfidenceBar>
      </AnalysisSection>

      <ComponentsGrid>
        {/* Tools Column */}
        <ComponentColumn>
          <ColumnHeader>
            <ColumnIcon>🔧</ColumnIcon>
            <ColumnTitle>Tools</ColumnTitle>
            <ColumnCount>
              {acceptedTools.size} of {serverConfig.tools.length}
            </ColumnCount>
          </ColumnHeader>

          {serverConfig.tools.length === 0 ? (
            <EmptyState>No tools suggested</EmptyState>
          ) : (
            serverConfig.tools.map((tool, index) => (
              <ComponentCard key={index} $accepted={acceptedTools.has(index)}>
                <CardHeader>
                  <CardName>{tool.name}</CardName>
                  <CardActions>
                    <IconButton
                      onClick={() => toggleTool(index)}
                      title={acceptedTools.has(index) ? 'Reject' : 'Accept'}
                    >
                      {acceptedTools.has(index) ? '✓' : '○'}
                    </IconButton>
                  </CardActions>
                </CardHeader>
                <CardDescription>{tool.description}</CardDescription>
                {tool.reason && <CardReason>💡 {tool.reason}</CardReason>}
              </ComponentCard>
            ))
          )}
        </ComponentColumn>

        {/* Resources Column */}
        <ComponentColumn>
          <ColumnHeader>
            <ColumnIcon>📁</ColumnIcon>
            <ColumnTitle>Resources</ColumnTitle>
            <ColumnCount>
              {acceptedResources.size} of {serverConfig.resources.length}
            </ColumnCount>
          </ColumnHeader>

          {serverConfig.resources.length === 0 ? (
            <EmptyState>No resources suggested</EmptyState>
          ) : (
            serverConfig.resources.map((resource, index) => (
              <ComponentCard key={index} $accepted={acceptedResources.has(index)}>
                <CardHeader>
                  <CardName>{resource.uri_pattern}</CardName>
                  <CardActions>
                    <IconButton
                      onClick={() => toggleResource(index)}
                      title={acceptedResources.has(index) ? 'Reject' : 'Accept'}
                    >
                      {acceptedResources.has(index) ? '✓' : '○'}
                    </IconButton>
                  </CardActions>
                </CardHeader>
                <CardDescription>{resource.description}</CardDescription>
                {resource.reason && <CardReason>💡 {resource.reason}</CardReason>}
              </ComponentCard>
            ))
          )}
        </ComponentColumn>

        {/* Prompts Column */}
        <ComponentColumn>
          <ColumnHeader>
            <ColumnIcon>💬</ColumnIcon>
            <ColumnTitle>Prompts</ColumnTitle>
            <ColumnCount>
              {acceptedPrompts.size} of {serverConfig.prompts.length}
            </ColumnCount>
          </ColumnHeader>

          {serverConfig.prompts.length === 0 ? (
            <EmptyState>No prompts suggested</EmptyState>
          ) : (
            serverConfig.prompts.map((prompt, index) => (
              <ComponentCard key={index} $accepted={acceptedPrompts.has(index)}>
                <CardHeader>
                  <CardName>{prompt.name}</CardName>
                  <CardActions>
                    <IconButton
                      onClick={() => togglePrompt(index)}
                      title={acceptedPrompts.has(index) ? 'Reject' : 'Accept'}
                    >
                      {acceptedPrompts.has(index) ? '✓' : '○'}
                    </IconButton>
                  </CardActions>
                </CardHeader>
                <CardDescription>{prompt.description}</CardDescription>
                {prompt.reason && <CardReason>💡 {prompt.reason}</CardReason>}
              </ComponentCard>
            ))
          )}
        </ComponentColumn>
      </ComponentsGrid>
    </SuggesterContainer>
  );
}

export default ComponentSuggester;
