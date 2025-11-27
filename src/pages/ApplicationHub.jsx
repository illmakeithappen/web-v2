import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import tool definitions from consolidated tools data
import { TOOLS_WITH_CAPABILITIES, APPLICATION_REQUIREMENTS } from '../data/tools';

// Styled Components
const HubContainer = styled.div`
  min-height: 100vh;
  background: var(--gitthub-light-beige);
`;

const HubHeader = styled.div`
  background: var(--gitthub-beige);
  border-bottom: 3px solid var(--gitthub-black);
  padding: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 900;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  max-width: 900px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem 2rem;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

// Left Panel - Stack Builder
const StackBuilderPanel = styled.div`
  flex: 0 0 350px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 1200px) {
    flex: 1;
  }
`;

// Center Panel - Deployment Config
const ConfigPanel = styled.div`
  flex: 1;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
`;

// Right Panel - Manual Library
const LibraryPanel = styled.div`
  flex: 0 0 380px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 1200px) {
    flex: 1;
  }
`;

const PanelHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
`;

const PanelTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
`;

const PanelContent = styled.div`
  padding: 1rem;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
`;

// Tool Selection Components
const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.3rem 0.6rem;
  background: ${props => props.$active ? 'var(--gitthub-black)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid var(--gitthub-black);
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'var(--gitthub-gray)' : 'var(--gitthub-light-beige)'};
  }
`;

const ToolCard = styled.div`
  background: ${props => props.$selected ? 'var(--gitthub-beige)' : 'var(--gitthub-light-beige)'};
  border: 2px solid ${props => props.$selected ? 'var(--gitthub-black)' : 'var(--gitthub-gray)'};
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateX(3px);
  }
`;

const ToolName = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
`;

const ToolDescription = styled.p`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  margin: 0;
`;

// Deployment Configuration Components
const ConfigSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ConfigLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const ConfigInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const ConfigTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const ConfigSelect = styled.select`
  width: 100%;
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

const RequirementCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.25rem;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    font-size: 0.9rem;
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Manual Library Components
const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const ManualCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--gitthub-black);
    background: var(--gitthub-beige);
  }

  ${props => props.$inProgress && `
    border-left: 4px solid #ff9800;
  `}

  ${props => props.$completed && `
    border-left: 4px solid #4caf50;
  `}
`;

const ManualTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: var(--gitthub-black);
`;

const ManualMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin-bottom: 0.5rem;
`;

const ManualTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const ToolBadge = styled.span`
  background: white;
  border: 1px solid var(--gitthub-gray);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Status Badge
const StatusMessage = styled.div`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background: ${props => props.$type === 'success' ? '#e8f5e9' : props.$type === 'error' ? '#ffebee' : '#e3f2fd'};
  color: ${props => props.$type === 'success' ? '#2e7d32' : props.$type === 'error' ? '#c62828' : '#1565c0'};
  border: 1px solid ${props => props.$type === 'success' ? '#4caf50' : props.$type === 'error' ? '#f44336' : '#2196f3'};
`;

// Progress tracking components
const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--gitthub-light-beige);
  border-radius: 3px;
  margin: 0.75rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.$progress === 100 ? '#4caf50' : '#ff9800'};
  border-radius: 3px;
  width: ${props => props.$progress}%;
  transition: width 0.5s ease;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const ProgressText = styled.span`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'not-started': return 'var(--gitthub-gray)';
      default: return 'var(--gitthub-gray)';
    }
  }};
  color: white;
`;

// Deployment targets
const DEPLOYMENT_TARGETS = [
  { id: 'aws', name: 'AWS', services: ['EC2', 'Lambda', 'ECS', 'Amplify'] },
  { id: 'render', name: 'Render', services: ['Web Service', 'Static Site', 'Background Worker'] },
  { id: 'vercel', name: 'Vercel', services: ['Serverless Functions', 'Edge Functions', 'Static'] },
  { id: 'railway', name: 'Railway', services: ['Containers', 'Databases'] },
  { id: 'docker', name: 'Docker', services: ['Compose', 'Swarm', 'Kubernetes'] },
  { id: 'local', name: 'Local Development', services: ['Docker Compose', 'Virtual Environment'] }
];

// Tool categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'llm', name: 'LLMs' },
  { id: 'vectordb', name: 'Vector DBs' },
  { id: 'framework', name: 'Frameworks' },
  { id: 'database', name: 'Databases' },
  { id: 'deployment', name: 'Deploy' },
  { id: 'monitoring', name: 'Monitor' }
];

function ApplicationHub() {
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualSearch, setManualSearch] = useState('');
  const [deploymentManuals, setDeploymentManuals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [manualProgress, setManualProgress] = useState({});

  // Deployment configuration state
  const [deploymentConfig, setDeploymentConfig] = useState({
    applicationName: '',
    description: '',
    deploymentTarget: '',
    environment: 'development',
    manualType: 'detailed',
    includeMonitoring: true,
    includeSecurity: true,
    includeScaling: false
  });

  // Load saved manuals and progress on mount
  useEffect(() => {
    fetchDeploymentManuals();
    loadProgressFromStorage();
  }, []);

  // Listen for progress updates from CourseViewer via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('deployment_progress_')) {
        loadProgressFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter tools based on category
  const filteredTools = useMemo(() => {
    return TOOLS_WITH_CAPABILITIES.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Filter manuals based on search
  const filteredManuals = useMemo(() => {
    return deploymentManuals.filter(manual =>
      manual.title.toLowerCase().includes(manualSearch.toLowerCase()) ||
      manual.tools.some(tool => tool.toLowerCase().includes(manualSearch.toLowerCase()))
    );
  }, [deploymentManuals, manualSearch]);

  // Fetch existing deployment manuals
  const fetchDeploymentManuals = async () => {
    try {
      const response = await axios.get('/api/v1/courses/bedrock/list', {
        params: { limit: 50 }
      });

      // Transform courses to deployment manuals format
      const manuals = response.data.courses?.map(course => ({
        id: course.id,
        course_id: course.course_id, // Add course_id for navigation
        title: course.title,
        description: course.description,
        tools: course.metadata?.tools || [],
        deploymentTarget: course.metadata?.deploymentTarget || 'aws',
        environment: course.metadata?.environment || 'production',
        createdAt: course.created_at,
        modules: course.modules || []
      })) || [];

      setDeploymentManuals(manuals);
    } catch (error) {
      console.error('Error fetching deployment manuals:', error);
    }
  };

  // Toggle tool selection
  const toggleToolSelection = (tool) => {
    setSelectedTools(prev => {
      const isSelected = prev.some(t => t.id === tool.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  // Generate deployment manual
  const generateDeploymentManual = async () => {
    if (!deploymentConfig.applicationName || selectedTools.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Please provide an application name and select at least one tool'
      });
      return;
    }

    setIsGenerating(true);
    setStatusMessage(null);

    try {
      // Create deployment manual structure based on selected tools
      const manualModules = [
        {
          title: 'Prerequisites & Environment Setup',
          sections: [
            'System requirements',
            'Required accounts and API keys',
            'Development environment setup',
            'Tool installation guides'
          ]
        },
        {
          title: 'Infrastructure Provisioning',
          sections: [
            `Setting up ${deploymentConfig.deploymentTarget}`,
            'Resource allocation',
            'Network configuration',
            'Security groups and permissions'
          ]
        },
        {
          title: 'Service Configuration',
          sections: selectedTools.map(tool => `Configuring ${tool.name}`)
        },
        {
          title: 'Integration & Deployment',
          sections: [
            'Service integration',
            'Environment variables',
            'Build and deployment process',
            'Health checks'
          ]
        },
        {
          title: 'Testing & Monitoring',
          sections: [
            'Testing procedures',
            'Monitoring setup',
            'Logging configuration',
            'Troubleshooting guide'
          ]
        }
      ];

      const requestData = {
        topic: `${deploymentConfig.applicationName} Deployment Manual`,
        level: 'intermediate',
        duration: '2-4 hours',
        learning_objectives: [
          `Deploy ${deploymentConfig.applicationName} to ${deploymentConfig.deploymentTarget}`,
          `Configure ${selectedTools.map(t => t.name).join(', ')}`,
          `Set up monitoring and logging`,
          `Implement security best practices`
        ],
        target_audience: 'DevOps Engineers and Developers',
        prerequisites: ['Basic command line knowledge', 'Cloud platform familiarity'],
        include_assessments: false,
        include_projects: false,
        language: 'english',
        ai_model: 'template',
        metadata: {
          tools: selectedTools.map(t => t.name),
          deploymentTarget: deploymentConfig.deploymentTarget,
          environment: deploymentConfig.environment,
          manualType: deploymentConfig.manualType
        },
        modules: manualModules
      };

      const response = await axios.post('/api/v1/courses/generate', requestData);

      if (response.data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Deployment manual generated successfully!'
        });

        // Refresh the manuals list
        await fetchDeploymentManuals();

        // Navigate to the manual viewer
        if (response.data.course_id) {
          setTimeout(() => {
            navigate(`/course/${response.data.course_id}`);
          }, 1500);
        }
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to generate deployment manual'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Load progress from localStorage
  const loadProgressFromStorage = () => {
    const progress = {};
    // Get all keys that start with deployment_progress_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('deployment_progress_')) {
        const courseId = key.replace('deployment_progress_', '');
        try {
          progress[courseId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error('Error parsing progress data:', e);
        }
      }
    }
    setManualProgress(progress);
  };

  // Calculate progress percentage for a manual
  const calculateProgress = (courseId) => {
    const progress = manualProgress[courseId];
    if (!progress || !progress.totalModules) return 0;

    // Handle both array and Set types for completedModules
    const completedCount = Array.isArray(progress.completedModules)
      ? progress.completedModules.length
      : progress.completedModules.size || 0;

    return Math.round((completedCount / progress.totalModules) * 100);
  };

  // Get status for a manual
  const getManualStatus = (courseId) => {
    const progress = manualProgress[courseId];
    if (!progress) return 'not-started';

    const percentage = calculateProgress(courseId);
    if (percentage === 0) return 'not-started';
    if (percentage === 100) return 'completed';
    return 'in-progress';
  };

  // View manual
  const viewManual = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <HubContainer>
      <HubHeader>
        <PageTitle>Application Deployment Hub</PageTitle>
        <PageSubtitle>
          Build your tech stack, configure deployment settings, and generate
          step-by-step deployment manuals tailored to your application.
        </PageSubtitle>
      </HubHeader>

      <MainContent>
        {/* Left Panel - Stack Builder */}
        <StackBuilderPanel>
          <PanelHeader>
            <PanelTitle>Stack Builder</PanelTitle>
          </PanelHeader>
          <PanelContent>
            <CategoryFilter>
              {CATEGORIES.map(cat => (
                <CategoryButton
                  key={cat.id}
                  $active={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </CategoryButton>
              ))}
            </CategoryFilter>

            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid var(--gitthub-gray)',
                borderRadius: '4px'
              }}
            />

            <div>
              {filteredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  $selected={selectedTools.some(t => t.id === tool.id)}
                  onClick={() => toggleToolSelection(tool)}
                >
                  <ToolName>{tool.name}</ToolName>
                  <ToolDescription>{tool.description}</ToolDescription>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#666' }}>
                    {tool.pricing}
                  </div>
                </ToolCard>
              ))}
            </div>
          </PanelContent>
        </StackBuilderPanel>

        {/* Center Panel - Deployment Configuration */}
        <ConfigPanel>
          <PanelHeader>
            <PanelTitle>Deployment Configuration</PanelTitle>
          </PanelHeader>
          <PanelContent>
            {statusMessage && (
              <StatusMessage $type={statusMessage.type}>
                {statusMessage.text}
              </StatusMessage>
            )}

            <ConfigSection>
              <ConfigLabel>Application Name *</ConfigLabel>
              <ConfigInput
                type="text"
                placeholder="e.g., AI Customer Support Bot"
                value={deploymentConfig.applicationName}
                onChange={(e) => setDeploymentConfig({
                  ...deploymentConfig,
                  applicationName: e.target.value
                })}
              />
            </ConfigSection>

            <ConfigSection>
              <ConfigLabel>Description</ConfigLabel>
              <ConfigTextarea
                placeholder="Describe your application's purpose and functionality..."
                value={deploymentConfig.description}
                onChange={(e) => setDeploymentConfig({
                  ...deploymentConfig,
                  description: e.target.value
                })}
              />
            </ConfigSection>

            <ConfigSection>
              <ConfigLabel>Deployment Target *</ConfigLabel>
              <ConfigSelect
                value={deploymentConfig.deploymentTarget}
                onChange={(e) => setDeploymentConfig({
                  ...deploymentConfig,
                  deploymentTarget: e.target.value
                })}
              >
                <option value="">Select a platform...</option>
                {DEPLOYMENT_TARGETS.map(target => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </ConfigSelect>
            </ConfigSection>

            <ConfigSection>
              <ConfigLabel>Environment</ConfigLabel>
              <ConfigSelect
                value={deploymentConfig.environment}
                onChange={(e) => setDeploymentConfig({
                  ...deploymentConfig,
                  environment: e.target.value
                })}
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </ConfigSelect>
            </ConfigSection>

            <ConfigSection>
              <ConfigLabel>Manual Type</ConfigLabel>
              <ConfigSelect
                value={deploymentConfig.manualType}
                onChange={(e) => setDeploymentConfig({
                  ...deploymentConfig,
                  manualType: e.target.value
                })}
              >
                <option value="quick_start">Quick Start Guide</option>
                <option value="detailed">Detailed Instructions</option>
                <option value="enterprise">Enterprise Documentation</option>
              </ConfigSelect>
            </ConfigSection>

            <ConfigSection>
              <ConfigLabel>Additional Sections</ConfigLabel>
              <RequirementCheckbox>
                <input
                  type="checkbox"
                  id="monitoring"
                  checked={deploymentConfig.includeMonitoring}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    includeMonitoring: e.target.checked
                  })}
                />
                <label htmlFor="monitoring">Include Monitoring Setup</label>
              </RequirementCheckbox>
              <RequirementCheckbox>
                <input
                  type="checkbox"
                  id="security"
                  checked={deploymentConfig.includeSecurity}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    includeSecurity: e.target.checked
                  })}
                />
                <label htmlFor="security">Include Security Configuration</label>
              </RequirementCheckbox>
              <RequirementCheckbox>
                <input
                  type="checkbox"
                  id="scaling"
                  checked={deploymentConfig.includeScaling}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    includeScaling: e.target.checked
                  })}
                />
                <label htmlFor="scaling">Include Auto-Scaling Setup</label>
              </RequirementCheckbox>
            </ConfigSection>

            <ConfigSection>
              <div style={{
                padding: '1rem',
                background: 'var(--gitthub-light-beige)',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <strong>Selected Tools: </strong>
                {selectedTools.length > 0 ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    {selectedTools.map(t => t.name).join(', ')}
                  </div>
                ) : (
                  <span style={{ color: 'var(--gitthub-gray)' }}>
                    No tools selected
                  </span>
                )}
              </div>
            </ConfigSection>

            <GenerateButton
              onClick={generateDeploymentManual}
              disabled={isGenerating || selectedTools.length === 0 || !deploymentConfig.applicationName}
            >
              {isGenerating ? 'Generating Manual...' : 'Generate Deployment Manual'}
            </GenerateButton>
          </PanelContent>
        </ConfigPanel>

        {/* Right Panel - Manual Library */}
        <LibraryPanel>
          <PanelHeader>
            <PanelTitle>Deployment Manuals</PanelTitle>
          </PanelHeader>
          <PanelContent>
            <SearchBar
              type="text"
              placeholder="Search manuals..."
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
            />

            {filteredManuals.length > 0 ? (
              filteredManuals.map(manual => {
                const status = getManualStatus(manual.course_id);
                const progress = calculateProgress(manual.course_id);
                const progressData = manualProgress[manual.course_id];

                return (
                  <ManualCard
                    key={manual.id}
                    onClick={() => viewManual(manual.course_id)}
                    $inProgress={status === 'in-progress'}
                    $completed={status === 'completed'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <ManualTitle>{manual.title}</ManualTitle>
                      <StatusBadge $status={status}>
                        {status === 'completed' ? '✓ Completed' :
                         status === 'in-progress' ? 'In Progress' :
                         'Not Started'}
                      </StatusBadge>
                    </div>

                    {status !== 'not-started' && (
                      <>
                        <ProgressBar>
                          <ProgressFill $progress={progress} />
                        </ProgressBar>
                        <ProgressInfo>
                          <ProgressText>
                            {Array.isArray(progressData?.completedModules)
                              ? progressData.completedModules.length
                              : 0} of {progressData?.totalModules || 0} phases completed
                          </ProgressText>
                          <ProgressText>{progress}%</ProgressText>
                        </ProgressInfo>
                      </>
                    )}

                    <ManualMeta style={{ marginTop: '0.75rem' }}>
                      <span>{manual.deploymentTarget}</span>
                      <span>•</span>
                      <span>{manual.environment}</span>
                      <span>•</span>
                      <span>{new Date(manual.createdAt).toLocaleDateString()}</span>
                    </ManualMeta>

                    <ManualTools>
                      {manual.tools.slice(0, 4).map(tool => (
                        <ToolBadge key={tool}>{tool}</ToolBadge>
                      ))}
                      {manual.tools.length > 4 && (
                        <ToolBadge>+{manual.tools.length - 4}</ToolBadge>
                      )}
                    </ManualTools>
                  </ManualCard>
                );
              })
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--gitthub-gray)'
              }}>
                <p>No deployment manuals yet.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Build your stack and generate your first manual!
                </p>
              </div>
            )}
          </PanelContent>
        </LibraryPanel>
      </MainContent>
    </HubContainer>
  );
}

export default ApplicationHub;