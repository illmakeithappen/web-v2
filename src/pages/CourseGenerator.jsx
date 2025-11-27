import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AI_TOPICS, getCategorizedTopics, LEVEL_COLORS } from '../data/aiTopics';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--gitthub-white);
`;

const GeneratorSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
  text-align: center;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  text-align: center;
  margin-bottom: 3rem;
`;

const GeneratorForm = styled.form`
  background: var(--gitthub-light-beige);
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

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
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const GenerateButton = styled.button`
  background: var(--gitthub-black);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: block;
  margin: 2rem auto 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CoursePreview = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
`;

const PreviewHeader = styled.div`
  border-bottom: 3px solid var(--gitthub-beige);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
`;

const CourseTitle = styled.h2`
  font-size: 2rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const CourseDescription = styled.p`
  color: var(--gitthub-gray);
  line-height: 1.6;
`;

const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModuleCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  padding: 1.5rem;
`;

const ModuleTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const ModuleDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--gitthub-black);
  background: ${props => props.primary ? 'var(--gitthub-black)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--gitthub-black)'};
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Tab Navigation
const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  border-bottom: 3px solid var(--gitthub-beige);
  padding-bottom: 0;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.$active ? 'var(--gitthub-black)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--gitthub-black)' : 'transparent'};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  bottom: -3px;

  &:hover {
    background: ${props => props.$active ? 'var(--gitthub-black)' : 'var(--gitthub-light-beige)'};
  }
`;

// Quick Start Components
const CategorySection = styled.div`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const TopicCard = styled.div`
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const TopicIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const TopicTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  font-weight: 700;
`;

const TopicDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
`;

const TopicMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--gitthub-beige);
`;

const LevelBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.$color || '#ccc'};
  color: white;
`;

const DurationBadge = styled.span`
  color: var(--gitthub-gray);
  font-size: 0.8rem;
  font-weight: 600;
`;

const QuickGenerateButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function CourseGenerator() {
  const navigate = useNavigate();

  // Tab mode state
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'custom'

  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    duration: '4 weeks',
    learningObjectives: '',
    targetAudience: '',
    prerequisites: '',
    includeAssessments: true,
    includeProjects: true,
    enableSynthesis: false,
    language: 'english',
    aiModel: 'bedrock-claude-sonnet'
  });

  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableModels, setAvailableModels] = useState(null);
  const [bedrockAvailable, setBedrockAvailable] = useState(false);

  // Fetch available models on component mount
  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        const response = await axios.get('/api/v1/courses/bedrock/models/available');
        setAvailableModels(response.data.models);
        setBedrockAvailable(response.data.bedrock_available);
        
        if (!response.data.bedrock_available) {
          setFormData(prev => ({ ...prev, aiModel: 'template' }));
        }
      } catch (error) {
        console.error('Error fetching available models:', error);
        setFormData(prev => ({ ...prev, aiModel: 'template' }));
      }
    };

    fetchAvailableModels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedCourse(null);

    try {
      const requestData = {
        topic: formData.topic,
        level: formData.level,
        duration: formData.duration,
        learning_objectives: formData.learningObjectives.split('\n').filter(o => o.trim()),
        target_audience: formData.targetAudience,
        prerequisites: formData.prerequisites.split('\n').filter(p => p.trim()),
        include_assessments: formData.includeAssessments,
        include_projects: formData.includeProjects,
        enable_synthesis: formData.enableSynthesis,
        language: formData.language,
        ai_model: formData.aiModel
      };

      // Use Bedrock endpoint for AI models, fallback for template
      const endpoint = formData.aiModel === 'template' 
        ? '/api/v1/courses/generate' 
        : '/api/v1/courses/bedrock/generate';

      const response = await axios.post(endpoint, requestData, {
        withCredentials: true,
        timeout: 360000  // 6 minutes timeout for AI course generation
      });
      
      if (response.data.success && response.data.course) {
        setGeneratedCourse(response.data.course);
      } else {
        throw new Error(response.data.message || 'Failed to generate course');
      }
    } catch (error) {
      console.error('Error generating course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate course. Please try again.';
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format) => {
    if (!generatedCourse) return;

    try {
      const response = await axios.post(`/api/courses/${generatedCourse.course_id}/export`, {
        format: format,
        include_solutions: false
      });

      const blob = new Blob([response.data.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.data.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting course:', error);
      alert('Failed to export course. Please try again.');
    }
  };

  const handleViewCourse = () => {
    if (generatedCourse) {
      navigate(`/course/${generatedCourse.course_id}`);
    }
  };

  // Quick generate from template
  const handleQuickGenerate = async (topic) => {
    // Pre-fill form with template data
    setFormData({
      topic: topic.title,
      level: topic.level,
      duration: topic.duration,
      learningObjectives: topic.objectives.join('\n'),
      targetAudience: topic.targetAudience,
      prerequisites: topic.prerequisites.join('\n'),
      includeAssessments: true,
      includeProjects: true,
      language: 'english',
      aiModel: bedrockAvailable ? 'bedrock-claude-sonnet' : 'template'
    });

    // Switch to custom tab to show progress
    setActiveTab('custom');

    // Trigger generation
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleGenerate(fakeEvent);
    }, 100);
  };

  // Get categorized topics for Quick Start
  const categorizedTopics = getCategorizedTopics();

  return (
    <PageContainer>
      <GeneratorSection>
        <PageTitle>AI Course Generator</PageTitle>
        <PageSubtitle>
          Create comprehensive, structured courses on any topic in seconds
        </PageSubtitle>

        {/* Tab Navigation */}
        <TabsContainer>
          <Tab $active={activeTab === 'quick'} onClick={() => setActiveTab('quick')}>
            Quick Start
          </Tab>
          <Tab $active={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
            Custom Course
          </Tab>
        </TabsContainer>

        {/* Quick Start Mode */}
        {activeTab === 'quick' && (
          <>
            {categorizedTopics.map(category => (
              <CategorySection key={category.id}>
                <CategoryHeader>
                  <CategoryTitle>{category.name}</CategoryTitle>
                  <CategoryDescription>{category.description}</CategoryDescription>
                </CategoryHeader>
                <TopicsGrid>
                  {category.topics.map(topic => (
                    <TopicCard key={topic.id}>
                      <TopicIcon>{topic.icon}</TopicIcon>
                      <TopicTitle>{topic.title}</TopicTitle>
                      <TopicDescription>{topic.description}</TopicDescription>
                      <TopicMeta>
                        <LevelBadge $color={LEVEL_COLORS[topic.level]}>
                          {topic.level}
                        </LevelBadge>
                        <DurationBadge>{topic.duration}</DurationBadge>
                      </TopicMeta>
                      <QuickGenerateButton
                        onClick={() => handleQuickGenerate(topic)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Course'}
                      </QuickGenerateButton>
                    </TopicCard>
                  ))}
                </TopicsGrid>
              </CategorySection>
            ))}
          </>
        )}

        {/* Custom Course Mode */}
        {activeTab === 'custom' && (
          <>
            <GeneratorForm onSubmit={handleGenerate}>
              <FormGrid>
            <FormField>
              <Label htmlFor="topic">Course Topic *</Label>
              <Input
                id="topic"
                name="topic"
                type="text"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Machine Learning Fundamentals"
                required
              />
            </FormField>

            <FormField>
              <Label htmlFor="level">Difficulty Level</Label>
              <Select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="duration">Course Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 4 weeks, 10 hours"
              />
            </FormField>

            <FormField>
              <Label htmlFor="language">Language</Label>
              <Select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                type="text"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="e.g., Data scientists, Software engineers, Students"
              />
            </FormField>

            <FormField>
              <Label htmlFor="aiModel">
                AI Model {!bedrockAvailable && '(AWS Bedrock unavailable)'}
              </Label>
              <Select
                id="aiModel"
                name="aiModel"
                value={formData.aiModel}
                onChange={handleInputChange}
              >
                <option value="template">Template (No AI)</option>
                {availableModels?.bedrock && Object.entries(availableModels.bedrock).map(([key, description]) => (
                  <option 
                    key={key} 
                    value={`bedrock-${key}`}
                    disabled={!bedrockAvailable}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)} {!bedrockAvailable && '(Unavailable)'}
                  </option>
                ))}
              </Select>
              <small style={{ marginTop: '0.5rem', color: 'var(--gitthub-gray)', fontSize: '0.85rem' }}>
                {formData.aiModel === 'template' 
                  ? 'Uses predefined templates for course structure'
                  : bedrockAvailable 
                    ? 'AI-powered content generation using AWS Bedrock'
                    : 'AWS Bedrock is not available. Using template mode.'
                }
              </small>
            </FormField>
          </FormGrid>

          <FormField>
            <Label htmlFor="learningObjectives">Learning Objectives (one per line)</Label>
            <Textarea
              id="learningObjectives"
              name="learningObjectives"
              value={formData.learningObjectives}
              onChange={handleInputChange}
              placeholder="Understand fundamental ML concepts&#10;Build and train models&#10;Evaluate model performance"
            />
          </FormField>

          <FormField>
            <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
            <Textarea
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleInputChange}
              placeholder="Basic Python programming&#10;Understanding of statistics&#10;Linear algebra fundamentals"
            />
          </FormField>

          <CheckboxField>
            <Checkbox
              type="checkbox"
              id="includeAssessments"
              name="includeAssessments"
              checked={formData.includeAssessments}
              onChange={handleInputChange}
            />
            <Label htmlFor="includeAssessments" style={{ marginBottom: 0 }}>
              Generate quizzes and assessments
            </Label>
          </CheckboxField>

          <CheckboxField>
            <Checkbox
              type="checkbox"
              id="includeProjects"
              name="includeProjects"
              checked={formData.includeProjects}
              onChange={handleInputChange}
            />
            <Label htmlFor="includeProjects" style={{ marginBottom: 0 }}>
              Include hands-on projects
            </Label>
          </CheckboxField>

          <CheckboxField>
            <Checkbox
              type="checkbox"
              id="enableSynthesis"
              name="enableSynthesis"
              checked={formData.enableSynthesis}
              onChange={handleInputChange}
              disabled={formData.aiModel === 'template' || !bedrockAvailable}
            />
            <Label htmlFor="enableSynthesis" style={{ marginBottom: 0 }}>
              Enable AI synthesis for enhanced cross-module coherence
              {(formData.aiModel === 'template' || !bedrockAvailable) && (
                <span style={{ fontSize: '0.85rem', color: 'var(--gitthub-gray)', marginLeft: '0.5rem' }}>
                  (Requires AI model)
                </span>
              )}
            </Label>
          </CheckboxField>
          {formData.enableSynthesis && (
            <div style={{
              marginLeft: '2rem',
              padding: '0.75rem',
              background: 'var(--gitthub-light-beige)',
              borderLeft: '3px solid var(--gitthub-black)',
              fontSize: '0.9rem',
              color: 'var(--gitthub-gray)'
            }}>
              <strong>Synthesis adds:</strong> Cross-module coherence analysis, optimized learning paths,
              module transitions, cross-references, and integrated capstone project.
              <br /><em>Note: Adds 30-60 seconds to generation time.</em>
            </div>
          )}

          <GenerateButton type="submit" disabled={isGenerating || !formData.topic}>
            {isGenerating ? (
              <>
                <LoadingSpinner />
                Generating Course...
              </>
            ) : (
              'Generate Course'
            )}
          </GenerateButton>
            </GeneratorForm>

            {generatedCourse && (
              <CoursePreview>
            <PreviewHeader>
              <CourseTitle>{generatedCourse.title}</CourseTitle>
              <CourseDescription>{generatedCourse.description}</CourseDescription>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <span><strong>Level:</strong> {generatedCourse.level}</span>
                <span><strong>Duration:</strong> {generatedCourse.duration}</span>
                <span><strong>Modules:</strong> {generatedCourse.modules.length}</span>
              </div>
            </PreviewHeader>

            <h3 style={{ marginBottom: '1rem' }}>Course Modules</h3>
            <ModulesList>
              {generatedCourse.modules.map((module, index) => (
                <ModuleCard key={module.module_id}>
                  <ModuleTitle>
                    Module {index + 1}: {module.title}
                  </ModuleTitle>
                  <ModuleDescription>{module.description}</ModuleDescription>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--gitthub-gray)' }}>
                    {module.content_sections.length} sections • 
                    {module.activities.length} activities • 
                    {module.assessment ? '1 assessment' : 'No assessment'}
                  </div>
                </ModuleCard>
              ))}
            </ModulesList>

            <ActionButtons>
              <ActionButton primary onClick={handleViewCourse}>
                View Full Course
              </ActionButton>
              <ActionButton onClick={() => handleExport('html')}>
                Export as HTML
              </ActionButton>
              <ActionButton onClick={() => handleExport('markdown')}>
                Export as Markdown
              </ActionButton>
              <ActionButton onClick={() => handleExport('json')}>
                Export as JSON
              </ActionButton>
            </ActionButtons>
              </CoursePreview>
            )}
          </>
        )}

      </GeneratorSection>
    </PageContainer>
  );
}

export default CourseGenerator;
