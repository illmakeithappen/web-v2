import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ViewerContainer = styled.div`
  position: relative;
`;

const ViewerButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-beige);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PromptModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 3px solid var(--gitthub-beige);
  background: var(--gitthub-light-beige);
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin: 0.25rem 0 0 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gitthub-gray);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: all 0.2s;

  &:hover {
    color: var(--gitthub-black);
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fef5e7;
  border: 2px solid #f39c12;
  border-radius: 4px;
  color: #d68910;
  margin-bottom: 1rem;
`;

const PromptSection = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionIcon = styled.span`
  font-size: 1.2rem;
`;

const PromptText = styled.pre`
  background: var(--gitthub-light-beige);
  padding: 1.25rem;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-gray);
  margin: 0;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gitthub-beige);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gitthub-gray);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--gitthub-black);
  }
`;

const InfoBanner = styled.div`
  background: #e8f4f8;
  border: 2px solid #3498db;
  border-radius: 6px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #2c3e50;

  strong {
    color: #2980b9;
  }
`;

const SourceInfo = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-beige);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--gitthub-gray);

  code {
    background: white;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'SF Mono', monospace;
    color: var(--gitthub-black);
  }
`;

// Icon mapping for different prompt sections
const getSectionIcon = (title) => {
  if (title.includes('Outline')) return '📋';
  if (title.includes('Module') || title.includes('Content')) return '📚';
  if (title.includes('Assessment')) return '✅';
  if (title.includes('Project') || title.includes('Exercise')) return '🎯';
  if (title.includes('Style') || title.includes('Tone')) return '✍️';
  if (title.includes('Best Practices')) return '💡';
  return '📝';
};

export default function SystemPromptViewer() {
  const [showModal, setShowModal] = useState(false);
  const [prompts, setPrompts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const loadPrompts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/v1/courses/bedrock/prompts');

      if (response.data.success) {
        setPrompts(response.data.prompts);
        setSource(response.data.source);
      } else {
        setError(response.data.error || 'Failed to load prompts');
      }
    } catch (err) {
      console.error('Error loading prompts:', err);
      console.error('Response data:', err.response?.data);

      // Extract detailed error message
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || err.message;
      setError(`Server Error: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal && !prompts) {
      loadPrompts();
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <ViewerContainer>
        <ViewerButton onClick={() => setShowModal(true)}>
          📜 View System Prompts
        </ViewerButton>
      </ViewerContainer>

      {showModal && (
        <>
          <Overlay onClick={handleClose} />
          <PromptModal>
            <ModalHeader>
              <div>
                <HeaderTitle>Course Generation System Prompts</HeaderTitle>
                <HeaderSubtitle>
                  These prompts guide Claude in generating course content
                </HeaderSubtitle>
              </div>
              <CloseButton onClick={handleClose}>✕</CloseButton>
            </ModalHeader>

            <ModalContent>
              {loading && (
                <LoadingMessage>Loading system prompts...</LoadingMessage>
              )}

              {error && (
                <ErrorMessage>
                  <strong>Error:</strong> {error}
                </ErrorMessage>
              )}

              {!loading && !error && prompts && (
                <>
                  <InfoBanner>
                    <strong>How it works:</strong> These prompts are sent to
                    Claude (AWS Bedrock) when generating courses. You can edit
                    them by modifying the configuration file shown below.
                  </InfoBanner>

                  {Object.entries(prompts).map(([title, content]) => (
                    <PromptSection key={title}>
                      <SectionTitle>
                        <SectionIcon>{getSectionIcon(title)}</SectionIcon>
                        {title}
                      </SectionTitle>
                      <PromptText>{content}</PromptText>
                    </PromptSection>
                  ))}

                  {source && (
                    <SourceInfo>
                      <strong>Source:</strong> <code>{source}</code>
                      <br />
                      Edit this file to customize how courses are generated.
                    </SourceInfo>
                  )}
                </>
              )}
            </ModalContent>
          </PromptModal>
        </>
      )}
    </>
  );
}
