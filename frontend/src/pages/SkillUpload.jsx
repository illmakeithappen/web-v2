import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationLayout from '../components/shared/NavigationLayout';
import { carbonColors, carbonSpacing } from '../styles/carbonTheme';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Match the catalog container structure
const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
  position: relative;
  overflow: hidden;
  border: 1px solid ${carbonColors.ui04};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const WizardHeader = styled.div`
  background: ${carbonColors.ui01};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WizardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin: 0;
  font-family: 'IBM Plex Sans', sans-serif;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  font-size: 0.75rem;
  color: ${carbonColors.text02};
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$active ? carbonColors.interactive01 :
                props.$completed ? carbonColors.supportSuccess :
                carbonColors.ui04};
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const WizardContent = styled.div`
  padding: ${carbonSpacing.spacing07};
  width: 100%;
`;

const WizardStep = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing03};
  font-family: 'IBM Plex Sans', sans-serif;
`;

const StepDescription = styled.p`
  color: ${carbonColors.text02};
  line-height: 1.5;
  margin-bottom: ${carbonSpacing.spacing06};
  font-size: 0.875rem;
`;

const UploadZone = styled.div`
  border: 2px dashed ${props => props.$isDragging ? carbonColors.interactive01 : carbonColors.ui04};
  border-radius: 4px;
  padding: ${carbonSpacing.spacing08} ${carbonSpacing.spacing07};
  text-align: center;
  background: ${props => props.$isDragging ? carbonColors.hoverUI : carbonColors.field01};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${carbonSpacing.spacing05};

  &:hover {
    border-color: ${carbonColors.interactive01};
    background: ${carbonColors.hoverUI};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${carbonSpacing.spacing05};
  color: ${carbonColors.icon02};
`;

const UploadText = styled.div`
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
  font-weight: 500;
`;

const UploadHint = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text02};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileInfoCard = styled.div`
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  padding: ${carbonSpacing.spacing05};
  margin-bottom: ${carbonSpacing.spacing06};
`;

const FileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${carbonSpacing.spacing04};
`;

const FileName = styled.div`
  font-weight: 600;
  color: ${carbonColors.text01};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};

  &::before {
    content: '📄';
    font-size: 1.25rem;
  }
`;

const FileSize = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text02};
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: ${carbonSpacing.spacing02} ${carbonSpacing.spacing03};
  font-size: 0.75rem;
  transition: all 0.15s ease;
  border-radius: 4px;

  &:hover {
    color: ${carbonColors.text01};
    background: ${carbonColors.hoverUI};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${carbonSpacing.spacing05};
  margin-bottom: ${carbonSpacing.spacing06};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing03};

  ${props => props.$fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${carbonColors.text02};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequiredIndicator = styled.span`
  color: ${carbonColors.supportError};
  margin-left: 4px;
`;

const Input = styled.input`
  padding: ${carbonSpacing.spacing04};
  border: none;
  border-bottom: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  transition: all 0.15s ease;
  font-family: 'IBM Plex Sans', sans-serif;

  &:focus {
    outline: none;
    border-bottom-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }

  &::placeholder {
    color: ${carbonColors.text03};
  }
`;

const Select = styled.select`
  padding: ${carbonSpacing.spacing04};
  border: none;
  border-bottom: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'IBM Plex Sans', sans-serif;

  &:focus {
    outline: none;
    border-bottom-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }
`;

const TextArea = styled.textarea`
  padding: ${carbonSpacing.spacing04};
  border: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  min-height: 80px;
  resize: vertical;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }

  &::placeholder {
    color: ${carbonColors.text03};
  }
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text03};
  margin-top: -${carbonSpacing.spacing02};
`;

const PreviewSection = styled.div`
  margin-bottom: ${carbonSpacing.spacing06};
`;

const PreviewLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${carbonColors.text02};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${carbonSpacing.spacing03};
`;

const SkillPreview = styled.pre`
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  padding: ${carbonSpacing.spacing05};
  overflow-x: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
  color: ${carbonColors.text01};
`;

const WizardFooter = styled.div`
  background: ${carbonColors.ui01};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing03};
`;

const Button = styled.button`
  padding: ${carbonSpacing.spacing04} ${carbonSpacing.spacing06};
  background: ${props =>
    props.$ghost ? 'transparent' :
    props.$secondary ? carbonColors.ui03 :
    carbonColors.interactive01};
  color: ${props =>
    props.$ghost ? carbonColors.text01 :
    props.$secondary ? carbonColors.text01 :
    'white'};
  border: 1px solid ${props =>
    props.$ghost ? carbonColors.ui04 :
    props.$secondary ? carbonColors.ui04 :
    carbonColors.interactive01};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 0;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$ghost ? carbonColors.hoverUI :
      props.$secondary ? carbonColors.hoverUI :
      carbonColors.hoverPrimary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: ${carbonSpacing.spacing04};
  border-left: 3px solid ${props =>
    props.$type === 'error' ? carbonColors.supportError :
    props.$type === 'success' ? carbonColors.supportSuccess :
    carbonColors.supportWarning
  };
  background: ${props =>
    props.$type === 'error' ? 'rgba(218, 30, 40, 0.1)' :
    props.$type === 'success' ? 'rgba(36, 161, 72, 0.1)' :
    'rgba(247, 223, 147, 0.2)'
  };
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing05};
  font-size: 0.875rem;
`;

function SkillUpload() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1); // 1: upload, 2: metadata, 3: review
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [metadata, setMetadata] = useState({
    skill_name: '',
    description: '',
    skill_type: 'python',
    difficulty: 'beginner',
    tags: ''
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const validExtensions = ['.md', '.txt', '.py', '.js', '.ts', '.sh', '.bash'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setStatusMessage({
        type: 'error',
        text: `Invalid file type. Please upload a skill file with one of these extensions: ${validExtensions.join(', ')}`
      });
      return;
    }

    setUploadedFile(file);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      extractMetadata(file.name, content);
      setCurrentStep(2); // Move to metadata step
    };
    reader.readAsText(file);
  };

  const extractMetadata = (fileName, content) => {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const cleanName = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const ext = fileName.substring(fileName.lastIndexOf('.'));
    const typeMap = {
      '.py': 'python',
      '.js': 'typescript',
      '.ts': 'typescript',
      '.sh': 'bash',
      '.bash': 'bash'
    };

    let description = '';
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
        description = line.replace(/^[#\/\s]+/, '').trim();
        break;
      }
    }

    setMetadata(prev => ({
      ...prev,
      skill_name: cleanName,
      skill_type: typeMap[ext] || prev.skill_type,
      description: description || prev.description
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setUploadedFile(null);
    setFileContent('');
    setStatusMessage(null);
    setCurrentStep(1);
    setMetadata({
      skill_name: '',
      description: '',
      skill_type: 'python',
      difficulty: 'beginner',
      tags: ''
    });
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (!metadata.skill_name.trim() || !metadata.description.trim()) {
        setStatusMessage({
          type: 'error',
          text: 'Please fill in all required fields (skill name and description)'
        });
        return;
      }
      setStatusMessage(null);
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStatusMessage(null);
    }
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setStatusMessage(null);

      const response = await axios.post(`${BACKEND_URL}/api/v1/skills`, {
        skill_name: metadata.skill_name,
        description: metadata.description,
        skill_type: metadata.skill_type,
        difficulty: metadata.difficulty,
        content: fileContent,
        tags: metadata.tags ? metadata.tags.split(',').map(t => t.trim()) : [],
        created_by: 'upload'
      });

      if (response.data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Skill uploaded successfully!'
        });

        setTimeout(() => {
          if (window.confirm('Skill uploaded! Would you like to view it in the Hub?')) {
            navigate('/hub');
          } else {
            handleReset();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading skill:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to upload skill: ${error.response?.data?.detail || error.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <NavigationLayout
      selectedSection="upload-skill"
      rightPane={
        <UploadContainer>
          <WizardHeader>
            <WizardTitle>upload skill</WizardTitle>
            <StepIndicator>
              <Step $active={currentStep === 1} $completed={currentStep > 1}>
                upload
              </Step>
              <Step $active={currentStep === 2} $completed={currentStep > 2}>
                details
              </Step>
              <Step $active={currentStep === 3}>
                review
              </Step>
            </StepIndicator>
          </WizardHeader>

          <ContentSection>
            <WizardContent>
              {statusMessage && (
                <StatusMessage $type={statusMessage.type}>
                  {statusMessage.text}
                </StatusMessage>
              )}

              {/* Step 1: Upload File */}
              <WizardStep $active={currentStep === 1}>
                <StepTitle>select skill file</StepTitle>
                <StepDescription>
                  Upload an existing skill file. Supported formats: Markdown (.md), Python (.py),
                  TypeScript/JavaScript (.js, .ts), and Shell scripts (.sh, .bash).
                </StepDescription>

                <UploadZone
                  $isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon>📁</UploadIcon>
                  <UploadText>drag and drop your skill file here</UploadText>
                  <UploadHint>or click to browse</UploadHint>
                </UploadZone>

                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.txt,.py,.js,.ts,.sh,.bash"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
              </WizardStep>

              {/* Step 2: Metadata */}
              <WizardStep $active={currentStep === 2}>
                <StepTitle>provide skill details</StepTitle>
                <StepDescription>
                  Review and edit the skill metadata. Required fields are marked with an asterisk (*).
                </StepDescription>

                {uploadedFile && (
                  <FileInfoCard>
                    <FileHeader>
                      <div>
                        <FileName>{uploadedFile.name}</FileName>
                        <FileSize>{formatFileSize(uploadedFile.size)}</FileSize>
                      </div>
                      <RemoveButton onClick={handleReset}>change file</RemoveButton>
                    </FileHeader>
                  </FileInfoCard>
                )}

                <FormGrid>
                  <FormField $fullWidth>
                    <Label htmlFor="skill_name">
                      skill name
                      <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      id="skill_name"
                      name="skill_name"
                      type="text"
                      value={metadata.skill_name}
                      onChange={handleMetadataChange}
                      placeholder="e.g., Git Commit Message Generator"
                    />
                  </FormField>

                  <FormField>
                    <Label htmlFor="skill_type">skill type</Label>
                    <Select
                      id="skill_type"
                      name="skill_type"
                      value={metadata.skill_type}
                      onChange={handleMetadataChange}
                    >
                      <option value="python">python</option>
                      <option value="typescript">typescript</option>
                      <option value="bash">bash</option>
                      <option value="general">general</option>
                    </Select>
                  </FormField>

                  <FormField>
                    <Label htmlFor="difficulty">difficulty level</Label>
                    <Select
                      id="difficulty"
                      name="difficulty"
                      value={metadata.difficulty}
                      onChange={handleMetadataChange}
                    >
                      <option value="beginner">beginner</option>
                      <option value="intermediate">intermediate</option>
                      <option value="advanced">advanced</option>
                    </Select>
                  </FormField>

                  <FormField $fullWidth>
                    <Label htmlFor="description">
                      description
                      <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <TextArea
                      id="description"
                      name="description"
                      value={metadata.description}
                      onChange={handleMetadataChange}
                      placeholder="Brief description of what this skill does"
                    />
                  </FormField>

                  <FormField $fullWidth>
                    <Label htmlFor="tags">tags (optional)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      value={metadata.tags}
                      onChange={handleMetadataChange}
                      placeholder="e.g., git, automation, refactoring (comma-separated)"
                    />
                    <HelpText>
                      Add tags to help categorize and find this skill later
                    </HelpText>
                  </FormField>
                </FormGrid>
              </WizardStep>

              {/* Step 3: Review */}
              <WizardStep $active={currentStep === 3}>
                <StepTitle>review and confirm</StepTitle>
                <StepDescription>
                  Review your skill before uploading to the library.
                </StepDescription>

                <FormGrid>
                  <FormField>
                    <Label>skill name</Label>
                    <div style={{ padding: '12px 0', color: carbonColors.text01 }}>
                      {metadata.skill_name}
                    </div>
                  </FormField>

                  <FormField>
                    <Label>skill type</Label>
                    <div style={{ padding: '12px 0', color: carbonColors.text01 }}>
                      {metadata.skill_type}
                    </div>
                  </FormField>

                  <FormField>
                    <Label>difficulty</Label>
                    <div style={{ padding: '12px 0', color: carbonColors.text01 }}>
                      {metadata.difficulty}
                    </div>
                  </FormField>

                  <FormField>
                    <Label>tags</Label>
                    <div style={{ padding: '12px 0', color: carbonColors.text01 }}>
                      {metadata.tags || 'None'}
                    </div>
                  </FormField>

                  <FormField $fullWidth>
                    <Label>description</Label>
                    <div style={{ padding: '12px 0', color: carbonColors.text01 }}>
                      {metadata.description}
                    </div>
                  </FormField>
                </FormGrid>

                <PreviewSection>
                  <PreviewLabel>skill content preview</PreviewLabel>
                  <SkillPreview>{fileContent}</SkillPreview>
                </PreviewSection>
              </WizardStep>
            </WizardContent>
          </ContentSection>

          <WizardFooter>
            <div>
              {currentStep > 1 && (
                <Button $ghost onClick={handleReset}>
                  start over
                </Button>
              )}
            </div>
            <ButtonGroup>
              {currentStep > 1 && currentStep < 3 && (
                <Button $secondary onClick={handleBack}>
                  back
                </Button>
              )}
              {currentStep === 2 && (
                <Button onClick={handleNext}>
                  continue
                </Button>
              )}
              {currentStep === 3 && (
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'uploading...' : 'upload skill'}
                </Button>
              )}
            </ButtonGroup>
          </WizardFooter>
        </UploadContainer>
      }
    />
  );
}

export default SkillUpload;