import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationLayout from '../components/shared/NavigationLayout';
import SkillPreview from '../components/skillgen/SkillPreview';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Container = styled.div`
  flex: 1;
  padding: 0;
  margin: 0;
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  padding: 1.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--gitthub-black);
`;

const Description = styled.p`
  color: var(--gitthub-gray);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--gitthub-black);
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  grid-column: 1 / -1;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.$secondary ? 'white' : 'var(--gitthub-black)'};
  color: ${props => props.$secondary ? 'var(--gitthub-black)' : 'white'};
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  grid-column: 1 / -1;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: 4px;
  background: ${props => props.$type === 'error' ? '#fee' : props.$type === 'success' ? '#efe' : '#fff3cd'};
  border: 2px solid ${props => props.$type === 'error' ? '#fcc' : props.$type === 'success' ? '#cfc' : '#ffc107'};
  color: ${props => props.$type === 'error' ? '#c00' : props.$type === 'success' ? '#0a0' : '#856404'};
  margin-bottom: 1rem;
`;

const ProgressContainer = styled.div`
  padding: 2rem;
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  text-align: center;
`;

const OutlinePreview = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const OutlineTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const OutlineDescription = styled.p`
  color: var(--gitthub-gray);
  margin-bottom: 1rem;
`;

const OutlineMetadata = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--gitthub-gray);
`;

const ToolsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ToolItem = styled.div`
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--gitthub-gray);
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: var(--gitthub-gray);
  margin-top: 0.25rem;
`;

const SkillContentPreview = styled.pre`
  background: #f6f8fa;
  border: 1px solid var(--gitthub-gray);
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
`;

function SkillGenerator() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    skill_name: '',
    skill_type: 'python',
    difficulty: 'beginner',
    description: '',
    allowed_tools: '',
    context: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('idle'); // idle, outline, content, complete
  const [statusMessage, setStatusMessage] = useState(null);
  const [outline, setOutline] = useState(null);
  const [generatedSkill, setGeneratedSkill] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateOutline = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage(null);
      setCurrentStep('outline');
      setOutline(null);
      setGeneratedSkill(null);
      setProgressMessage('Analyzing requirements and generating skill outline...');

      const response = await axios.post(`${API_URL}/api/v1/skill-generator/generate-outline`, formData);

      if (response.data.success) {
        setOutline(response.data.outline);
        setStatusMessage({
          type: 'success',
          text: 'Outline generated! Review and click "Generate Full Skill" to continue.'
        });
        setCurrentStep('outline-ready');
        setProgressMessage('');
      }
    } catch (error) {
      console.error('Outline generation error:', error);
      setStatusMessage({
        type: 'error',
        text: error.response?.data?.detail || error.message || 'Failed to generate outline'
      });
      setCurrentStep('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage(null);
      setCurrentStep('content');
      setProgressMessage('Creating detailed skill implementation...');

      const response = await axios.post(`${API_URL}/api/v1/skill-generator/generate-content`, {
        outline_data: outline,
        request_data: formData
      });

      if (response.data.success) {
        setGeneratedSkill(response.data.skill_content);
        setStatusMessage({
          type: 'success',
          text: 'Skill generated successfully!'
        });
        setCurrentStep('complete');
        setProgressMessage('');
      }
    } catch (error) {
      console.error('Content generation error:', error);
      setStatusMessage({
        type: 'error',
        text: error.response?.data?.detail || error.message || 'Failed to generate content'
      });
      setCurrentStep('outline-ready');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      skill_name: '',
      skill_type: 'python',
      difficulty: 'beginner',
      description: '',
      allowed_tools: '',
      context: ''
    });
    setOutline(null);
    setGeneratedSkill(null);
    setStatusMessage(null);
    setCurrentStep('idle');
  };

  const handleSaveSkill = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/skills`, {
        skill_name: formData.skill_name,
        description: formData.description,
        skill_type: formData.skill_type,
        difficulty: formData.difficulty,
        content: generatedSkill,
        tags: formData.allowed_tools ? formData.allowed_tools.split(',').map(t => t.trim()) : [],
        created_by: 'skill-generator'
      });

      if (response.data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Skill saved successfully!'
        });

        // Ask user if they want to view the skill
        if (window.confirm('Skill saved! Would you like to view it in the Hub?')) {
          navigate('/hub');
        }
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to save skill: ${error.response?.data?.detail || error.message}`
      });
    }
  };

  const parseOutlineTools = (outline) => {
    if (!outline?.allowed_tools) return [];
    return Array.isArray(outline.allowed_tools) ? outline.allowed_tools : [outline.allowed_tools];
  };

  return (
    <NavigationLayout
      selectedSection="skill"
      bottomContent={
        <SkillPreview
          skillContent={generatedSkill}
          onRefine={() => {
            const feedback = prompt('💬 What would you like to change?');
            if (feedback) {
              setFormData(prev => ({ ...prev, context: feedback }));
              setCurrentStep('idle');
            }
          }}
          onDownload={handleSaveSkill}
        />
      }
      rightPane={
        <Container>
          <ContentWrapper>
            {!generatedSkill ? (
              <>
                <Card>
                  <Title>Skill Generator</Title>
                  <Description>
                    Create custom Claude Code skills with AI-powered generation. Define your skill's purpose,
                    choose the appropriate tools, and let AI generate the implementation.
                  </Description>

                  {statusMessage && (
                    <StatusMessage $type={statusMessage.type}>
                      {statusMessage.text}
                    </StatusMessage>
                  )}

                  <Form>
                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <Label htmlFor="skill_name">Skill Name *</Label>
                      <Input
                        id="skill_name"
                        name="skill_name"
                        type="text"
                        value={formData.skill_name}
                        onChange={handleInputChange}
                        placeholder="e.g., Git Commit Message Generator"
                        disabled={isGenerating || currentStep === 'outline-ready'}
                      />
                    </FormField>

                    <FormField>
                      <Label htmlFor="skill_type">Skill Type</Label>
                      <Select
                        id="skill_type"
                        name="skill_type"
                        value={formData.skill_type}
                        onChange={handleInputChange}
                        disabled={isGenerating || currentStep === 'outline-ready'}
                      >
                        <option value="python">Python</option>
                        <option value="typescript">TypeScript</option>
                        <option value="bash">Bash</option>
                        <option value="general">General</option>
                      </Select>
                    </FormField>

                    <FormField>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        disabled={isGenerating || currentStep === 'outline-ready'}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Select>
                    </FormField>

                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        name="description"
                        type="text"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of what this skill does"
                        disabled={isGenerating || currentStep === 'outline-ready'}
                      />
                    </FormField>

                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <Label htmlFor="allowed_tools">Allowed Tools (optional)</Label>
                      <Input
                        id="allowed_tools"
                        name="allowed_tools"
                        type="text"
                        value={formData.allowed_tools}
                        onChange={handleInputChange}
                        placeholder="e.g., Read, Write, Bash, Grep (comma-separated)"
                        disabled={isGenerating || currentStep === 'outline-ready'}
                      />
                      <HelpText>
                        Leave empty to allow all tools, or specify which Claude Code tools this skill can use
                      </HelpText>
                    </FormField>

                    <TextArea
                      name="context"
                      placeholder="Additional context or requirements for the skill..."
                      value={formData.context}
                      onChange={handleInputChange}
                      disabled={isGenerating || currentStep === 'outline-ready'}
                    />

                    <ButtonGroup>
                      {currentStep === 'idle' && (
                        <Button
                          onClick={handleGenerateOutline}
                          disabled={!formData.skill_name.trim() || !formData.description.trim() || isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <LoadingSpinner />
                              Generating Outline...
                            </>
                          ) : (
                            'Step 1: Generate Outline'
                          )}
                        </Button>
                      )}

                      {currentStep === 'outline-ready' && (
                        <>
                          <Button onClick={handleGenerateContent} disabled={isGenerating}>
                            {isGenerating ? (
                              <>
                                <LoadingSpinner />
                                Generating Skill...
                              </>
                            ) : (
                              'Step 2: Generate Full Skill'
                            )}
                          </Button>
                          <Button $secondary onClick={handleReset}>
                            Start Over
                          </Button>
                        </>
                      )}
                    </ButtonGroup>
                  </Form>

                  {isGenerating && (
                    <ProgressContainer>
                      <ProgressText>{progressMessage}</ProgressText>
                    </ProgressContainer>
                  )}
                </Card>

                {outline && currentStep === 'outline-ready' && (
                  <Card>
                    <OutlinePreview>
                      <OutlineTitle>{outline.name}</OutlineTitle>
                      <OutlineDescription>{outline.description}</OutlineDescription>
                      <OutlineMetadata>
                        <span><strong>Type:</strong> {outline.skill_type}</span>
                        <span><strong>Difficulty:</strong> {outline.difficulty}</span>
                      </OutlineMetadata>

                      {outline.allowed_tools && parseOutlineTools(outline).length > 0 && (
                        <div>
                          <strong>Allowed Tools:</strong>
                          <ToolsList>
                            {parseOutlineTools(outline).map((tool, index) => (
                              <ToolItem key={index}>{tool}</ToolItem>
                            ))}
                          </ToolsList>
                        </div>
                      )}

                      {outline.implementation_notes && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Implementation Notes:</strong>
                          <p style={{ marginTop: '0.5rem', color: 'var(--gitthub-gray)' }}>
                            {outline.implementation_notes}
                          </p>
                        </div>
                      )}
                    </OutlinePreview>
                  </Card>
                )}
              </>
            ) : (
              <>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Title>Your Skill</Title>
                    <ButtonGroup>
                      <Button onClick={handleSaveSkill}>
                        Save to Library
                      </Button>
                      <Button $secondary onClick={handleReset}>
                        Generate Another
                      </Button>
                    </ButtonGroup>
                  </div>
                  <SkillContentPreview>{generatedSkill}</SkillContentPreview>
                </Card>
              </>
            )}
          </ContentWrapper>
        </Container>
      }
    />
  );
}

export default SkillGenerator;
