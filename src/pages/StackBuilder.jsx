import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

// Styled Components
const ApplicationBuilderContainer = styled.div`
  min-height: 100vh;
  background: var(--gitthub-light-beige);
`;

const Header = styled.div`
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
  max-width: 800px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  height: calc(100vh - 200px);

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 0 0 320px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    flex: 1;
    min-height: 400px;
  }
`;

const CenterPanel = styled.div`
  flex: 1;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled.div`
  flex: 0 0 300px;
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    flex: 1;
    min-height: 400px;
  }
`;

const PanelHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 1rem;
  border-bottom: 2px solid var(--gitthub-black);
`;

const PanelTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0;
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

// Tool Library Components
const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

const ToolCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: all 0.2s;

  &:hover {
    border-color: var(--gitthub-black);
    transform: translateX(5px);
  }

  ${props => props.$isDragging && `
    opacity: 0.5;
    cursor: grabbing;
  `}
`;

const ToolIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ToolName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.25rem;
`;

const ToolDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ToolTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const ToolTag = styled.span`
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Canvas Components
const CanvasContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StackLayer = styled.div`
  flex: 1;
  background: ${props => props.$isDraggedOver ? 'var(--gitthub-light-beige)' : '#fafafa'};
  border: 2px dashed ${props => props.$isDraggedOver ? 'var(--gitthub-black)' : 'var(--gitthub-gray)'};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
  min-height: 120px;
`;

const LayerLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gitthub-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const LayerTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DroppedTool = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: grab;

  ${props => props.$isDragging && `
    opacity: 0.5;
    cursor: grabbing;
  `}
`;

// Template Components
const TemplateCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid var(--gitthub-gray);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--gitthub-black);
    background: var(--gitthub-beige);
  }
`;

const TemplateTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const TemplateDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  margin-bottom: 0.75rem;
`;

const TemplateStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const TemplateToolBadge = styled.span`
  background: white;
  color: var(--gitthub-black);
  border: 1px solid var(--gitthub-gray);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Requirements Panel Components
const RequirementsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RequirementCategory = styled.div`
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gitthub-gray);
`;

const RequirementItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--gitthub-light-beige);
    border-radius: 4px;
  }
`;

const RequirementCheckbox = styled.input`
  margin-top: 2px;
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const RequirementLabel = styled.div`
  flex: 1;
`;

const RequirementTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--gitthub-black);
  margin-bottom: 0.2rem;
`;

const RequirementDescription = styled.div`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  line-height: 1.3;
`;

// Summary Panel Components
const SummarySection = styled.div`
  margin-bottom: 1.5rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.$type === 'capabilities' ? '#2e7d32' : props.$type === 'missing' ? '#c62828' : '#1565c0'};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SummaryItem = styled.li`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${props => props.$type === 'success' ? '#e8f5e9' : props.$type === 'warning' ? '#fff3e0' : props.$type === 'error' ? '#ffebee' : '#e3f2fd'};
  border-left: 3px solid ${props => props.$type === 'success' ? '#4caf50' : props.$type === 'warning' ? '#ff9800' : props.$type === 'error' ? '#f44336' : '#2196f3'};
  border-radius: 0 4px 4px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CompatibilityWarning = styled.div`
  background: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const WarningTitle = styled.h4`
  color: #e65100;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const WarningText = styled.p`
  color: #bf360c;
  font-size: 0.9rem;
  margin: 0;
`;

// Export/Action Buttons
const ActionBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--gitthub-beige);
  border-top: 2px solid var(--gitthub-black);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${props => props.$primary ? 'var(--gitthub-black)' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? 'var(--gitthub-gray)' : 'var(--gitthub-light-beige)'};
  }
`;

// Enhanced Tool Definitions with Capability Mappings
const TOOLS_WITH_CAPABILITIES = [
  // LLMs
  {
    id: 'openai',
    name: 'OpenAI GPT',
    category: 'llm',
    description: 'GPT-4, GPT-3.5 language models',
    tags: ['API', 'Text Generation'],
    capabilities: ['chat', 'nlp', 'code_generation', 'api_integration'],
    pricing: 'Pay-per-token',
    compatibility: ['langchain', 'llamaindex', 'haystack', 'semantic-kernel']
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'llm',
    description: 'Anthropic\'s Claude AI assistant',
    tags: ['API', 'Conversational'],
    capabilities: ['chat', 'nlp', 'code_generation', 'document_processing', 'api_integration'],
    pricing: 'Pay-per-token',
    compatibility: ['langchain', 'llamaindex']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'llm',
    description: 'Google\'s multimodal AI model',
    tags: ['API', 'Multimodal'],
    capabilities: ['chat', 'nlp', 'image_analysis', 'document_processing', 'api_integration'],
    pricing: 'Pay-per-request',
    compatibility: ['langchain', 'semantic-kernel']
  },
  {
    id: 'llama',
    name: 'Llama 3',
    category: 'llm',
    description: 'Meta\'s open-source LLM',
    tags: ['Open Source', 'Self-hosted'],
    capabilities: ['chat', 'nlp', 'code_generation'],
    pricing: 'Free (self-hosted)',
    compatibility: ['langchain', 'llamaindex', 'haystack']
  },

  // Vector Databases
  {
    id: 'pinecone',
    name: 'Pinecone',
    category: 'vectordb',
    description: 'Managed vector database',
    tags: ['Cloud', 'Serverless'],
    capabilities: ['vector_storage', 'semantic_search', 'real_time_sync', 'auto_scaling'],
    pricing: 'Tiered (Free tier available)',
    compatibility: ['langchain', 'llamaindex', 'haystack']
  },
  {
    id: 'weaviate',
    name: 'Weaviate',
    category: 'vectordb',
    description: 'Open-source vector search engine',
    tags: ['Open Source', 'GraphQL'],
    capabilities: ['vector_storage', 'semantic_search', 'document_storage'],
    pricing: 'Free (self-hosted) / Cloud options',
    compatibility: ['langchain', 'llamaindex', 'haystack']
  },
  {
    id: 'chroma',
    name: 'Chroma',
    category: 'vectordb',
    description: 'Open-source embedding database',
    tags: ['Open Source', 'Local'],
    capabilities: ['vector_storage', 'semantic_search'],
    pricing: 'Free (open-source)',
    compatibility: ['langchain', 'llamaindex']
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    category: 'vectordb',
    description: 'Vector similarity search engine',
    tags: ['Open Source', 'Cloud'],
    capabilities: ['vector_storage', 'semantic_search', 'recommendation_system'],
    pricing: 'Free (self-hosted) / Cloud options',
    compatibility: ['langchain', 'haystack']
  },

  // Frameworks
  {
    id: 'langchain',
    name: 'LangChain',
    category: 'framework',
    description: 'Framework for LLM applications',
    tags: ['Python', 'JavaScript'],
    capabilities: ['chat', 'document_processing', 'api_integration', 'web_scraping'],
    pricing: 'Free (open-source)',
    compatibility: ['openai', 'claude', 'gemini', 'llama', 'pinecone', 'weaviate', 'chroma', 'qdrant']
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    category: 'framework',
    description: 'Data framework for LLMs',
    tags: ['Python', 'RAG'],
    capabilities: ['document_processing', 'semantic_search', 'batch_processing'],
    pricing: 'Free (open-source)',
    compatibility: ['openai', 'claude', 'llama', 'pinecone', 'weaviate', 'chroma']
  },
  {
    id: 'haystack',
    name: 'Haystack',
    category: 'framework',
    description: 'NLP framework for production',
    tags: ['Python', 'Pipeline'],
    capabilities: ['nlp', 'semantic_search', 'document_processing', 'ner'],
    pricing: 'Free (open-source)',
    compatibility: ['openai', 'llama', 'pinecone', 'weaviate', 'qdrant']
  },
  {
    id: 'semantic-kernel',
    name: 'Semantic Kernel',
    category: 'framework',
    description: 'Microsoft AI orchestration',
    tags: ['C#', 'Python'],
    capabilities: ['chat', 'api_integration', 'code_generation'],
    pricing: 'Free (open-source)',
    compatibility: ['openai', 'gemini']
  },

  // Deployment
  {
    id: 'render',
    name: 'Render',
    category: 'deployment',
    description: 'Cloud application platform',
    tags: ['PaaS', 'Auto-scaling'],
    capabilities: ['auto_scaling', 'ci_cd', 'monitoring_logging', 'container_orchestration'],
    pricing: 'Tiered (Free tier available)',
    compatibility: ['all']
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'deployment',
    description: 'Frontend cloud platform',
    tags: ['Serverless', 'Edge'],
    capabilities: ['serverless', 'edge_computing', 'ci_cd'],
    pricing: 'Tiered (Free tier available)',
    compatibility: ['all']
  },
  {
    id: 'railway',
    name: 'Railway',
    category: 'deployment',
    description: 'Instant deployments',
    tags: ['PaaS', 'Databases'],
    capabilities: ['auto_scaling', 'ci_cd', 'relational_database'],
    pricing: 'Usage-based',
    compatibility: ['all']
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'deployment',
    description: 'Amazon Web Services',
    tags: ['IaaS', 'Full-stack'],
    capabilities: ['auto_scaling', 'multi_region', 'serverless', 'container_orchestration', 'edge_computing', 'ci_cd', 'monitoring_logging', 'cost_optimization'],
    pricing: 'Pay-as-you-go',
    compatibility: ['all']
  },

  // Monitoring
  {
    id: 'langfuse',
    name: 'Langfuse',
    category: 'monitoring',
    description: 'LLM observability',
    tags: ['Tracing', 'Analytics'],
    capabilities: ['monitoring_logging', 'cost_optimization'],
    pricing: 'Tiered (Free tier available)',
    compatibility: ['openai', 'claude', 'gemini', 'langchain']
  },
  {
    id: 'helicone',
    name: 'Helicone',
    category: 'monitoring',
    description: 'LLM monitoring & caching',
    tags: ['Proxy', 'Analytics'],
    capabilities: ['monitoring_logging', 'caching', 'cost_optimization'],
    pricing: 'Usage-based',
    compatibility: ['openai', 'claude']
  },
  {
    id: 'wandb',
    name: 'Weights & Biases',
    category: 'monitoring',
    description: 'ML experiment tracking',
    tags: ['MLOps', 'Visualization'],
    capabilities: ['monitoring_logging', 'data_versioning'],
    pricing: 'Tiered (Free tier available)',
    compatibility: ['all']
  },

  // Additional Tools
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    description: 'In-memory data store',
    tags: ['Cache', 'NoSQL'],
    capabilities: ['caching', 'real_time_sync', 'real_time_processing'],
    pricing: 'Free (self-hosted) / Cloud options',
    compatibility: ['all']
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Relational database',
    tags: ['SQL', 'ACID'],
    capabilities: ['relational_database', 'document_storage'],
    pricing: 'Free (self-hosted) / Cloud options',
    compatibility: ['all']
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    description: 'Document database',
    tags: ['NoSQL', 'Document'],
    capabilities: ['document_storage', 'real_time_sync'],
    pricing: 'Free tier / Cloud options',
    compatibility: ['all']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    category: 'platform',
    description: 'AI model hub',
    tags: ['Models', 'Inference'],
    capabilities: ['nlp', 'image_generation', 'sentiment_analysis', 'ner', 'voice_processing'],
    pricing: 'Free tier / Paid inference',
    compatibility: ['langchain', 'haystack']
  },
  {
    id: 'replicate',
    name: 'Replicate',
    category: 'platform',
    description: 'Run AI models in the cloud',
    tags: ['API', 'Models'],
    capabilities: ['image_generation', 'image_analysis', 'voice_processing'],
    pricing: 'Pay-per-second',
    compatibility: ['langchain']
  }
];

// Application Requirements Categories
const APPLICATION_REQUIREMENTS = {
  core_capabilities: {
    title: 'Core Capabilities',
    items: [
      { id: 'chat', label: 'Chat/Conversational Interface', description: 'Interactive dialogue with users' },
      { id: 'document_processing', label: 'Document Processing', description: 'Handle PDFs, Word, text files' },
      { id: 'real_time_processing', label: 'Real-time Data Processing', description: 'Stream processing and instant responses' },
      { id: 'batch_processing', label: 'Batch Processing', description: 'Process large datasets in batches' },
      { id: 'api_integration', label: 'API Integration', description: 'Connect with external services' },
      { id: 'web_scraping', label: 'Web Scraping', description: 'Extract data from websites' }
    ]
  },
  ai_features: {
    title: 'AI Features',
    items: [
      { id: 'nlp', label: 'Natural Language Understanding', description: 'Parse and understand text' },
      { id: 'code_generation', label: 'Code Generation', description: 'Generate programming code' },
      { id: 'image_generation', label: 'Image Generation', description: 'Create images from text' },
      { id: 'image_analysis', label: 'Image Analysis', description: 'Extract information from images' },
      { id: 'voice_processing', label: 'Voice/Speech Processing', description: 'Speech-to-text and text-to-speech' },
      { id: 'semantic_search', label: 'Semantic Search', description: 'Context-aware search' },
      { id: 'recommendation_system', label: 'Recommendation System', description: 'Personalized suggestions' },
      { id: 'sentiment_analysis', label: 'Sentiment Analysis', description: 'Analyze emotional tone' },
      { id: 'ner', label: 'Named Entity Recognition', description: 'Extract entities from text' }
    ]
  },
  data_management: {
    title: 'Data Management',
    items: [
      { id: 'vector_storage', label: 'Vector Storage', description: 'Store embeddings and vectors' },
      { id: 'relational_database', label: 'Relational Database', description: 'Structured data with SQL' },
      { id: 'document_storage', label: 'Document Storage', description: 'NoSQL document database' },
      { id: 'caching', label: 'Caching Layer', description: 'Fast data access' },
      { id: 'data_versioning', label: 'Data Versioning', description: 'Track data changes over time' },
      { id: 'real_time_sync', label: 'Real-time Sync', description: 'Keep data synchronized' }
    ]
  },
  infrastructure_needs: {
    title: 'Infrastructure Needs',
    items: [
      { id: 'auto_scaling', label: 'Auto-scaling', description: 'Scale based on demand' },
      { id: 'multi_region', label: 'Multi-region Deployment', description: 'Global distribution' },
      { id: 'edge_computing', label: 'Edge Computing', description: 'Process at network edge' },
      { id: 'serverless', label: 'Serverless Functions', description: 'Event-driven compute' },
      { id: 'container_orchestration', label: 'Container Orchestration', description: 'Manage containers at scale' },
      { id: 'ci_cd', label: 'CI/CD Pipeline', description: 'Automated deployment' },
      { id: 'monitoring_logging', label: 'Monitoring & Logging', description: 'Track system health' },
      { id: 'cost_optimization', label: 'Cost Optimization', description: 'Control cloud expenses' }
    ]
  }
};

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'llm', name: 'LLMs' },
  { id: 'vectordb', name: 'Vector DBs' },
  { id: 'framework', name: 'Frameworks' },
  { id: 'database', name: 'Databases' },
  { id: 'deployment', name: 'Deploy' },
  { id: 'monitoring', name: 'Monitor' },
  { id: 'platform', name: 'Platforms' }
];

function StackBuilder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState({});

  // Initialize requirements from localStorage
  useEffect(() => {
    const savedTools = localStorage.getItem('selectedTools');
    const savedRequirements = localStorage.getItem('selectedRequirements');

    if (savedTools) {
      try {
        const tools = JSON.parse(savedTools);
        setSelectedTools(tools);
      } catch (e) {
        console.error('Failed to load saved tools:', e);
      }
    }

    if (savedRequirements) {
      try {
        setSelectedRequirements(JSON.parse(savedRequirements));
      } catch (e) {
        console.error('Failed to load saved requirements:', e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('selectedTools', JSON.stringify(selectedTools));
  }, [selectedTools]);

  useEffect(() => {
    localStorage.setItem('selectedRequirements', JSON.stringify(selectedRequirements));
  }, [selectedRequirements]);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return TOOLS_WITH_CAPABILITIES.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  // Toggle requirement selection
  const toggleRequirement = (requirementId) => {
    setSelectedRequirements(prev => ({
      ...prev,
      [requirementId]: !prev[requirementId]
    }));
  };

  // Analyze capabilities based on selected tools and requirements
  const analysisResult = useMemo(() => {
    const requiredCapabilities = new Set();
    const providedCapabilities = new Set();
    const toolsByCapability = {};
    const compatibilityIssues = [];

    // Collect required capabilities from selected requirements
    Object.entries(selectedRequirements).forEach(([reqId, isSelected]) => {
      if (isSelected) {
        requiredCapabilities.add(reqId);
      }
    });

    // Collect provided capabilities from selected tools
    selectedTools.forEach(tool => {
      tool.capabilities?.forEach(cap => {
        providedCapabilities.add(cap);
        if (!toolsByCapability[cap]) {
          toolsByCapability[cap] = [];
        }
        toolsByCapability[cap].push(tool.name);
      });
    });

    // Check compatibility between tools
    selectedTools.forEach(tool1 => {
      selectedTools.forEach(tool2 => {
        if (tool1.id !== tool2.id && tool1.compatibility && !tool1.compatibility.includes('all')) {
          if (!tool1.compatibility.includes(tool2.id)) {
            const issueKey = `${tool1.id}-${tool2.id}`;
            const reverseKey = `${tool2.id}-${tool1.id}`;
            if (!compatibilityIssues.find(issue => issue.key === reverseKey)) {
              compatibilityIssues.push({
                key: issueKey,
                message: `${tool1.name} may have limited compatibility with ${tool2.name}`
              });
            }
          }
        }
      });
    });

    // Determine what's covered and what's missing
    const coveredCapabilities = [];
    const missingCapabilities = [];

    requiredCapabilities.forEach(cap => {
      if (providedCapabilities.has(cap)) {
        const reqInfo = Object.values(APPLICATION_REQUIREMENTS)
          .flatMap(cat => cat.items)
          .find(item => item.id === cap);
        coveredCapabilities.push({
          id: cap,
          label: reqInfo?.label || cap,
          tools: toolsByCapability[cap] || []
        });
      } else {
        const reqInfo = Object.values(APPLICATION_REQUIREMENTS)
          .flatMap(cat => cat.items)
          .find(item => item.id === cap);
        missingCapabilities.push({
          id: cap,
          label: reqInfo?.label || cap
        });
      }
    });

    // Generate recommendations
    const recommendations = [];
    missingCapabilities.forEach(missing => {
      const suggestedTools = TOOLS_WITH_CAPABILITIES.filter(tool =>
        tool.capabilities?.includes(missing.id) &&
        !selectedTools.some(t => t.id === tool.id)
      ).slice(0, 2);

      if (suggestedTools.length > 0) {
        recommendations.push({
          capability: missing.label,
          tools: suggestedTools.map(t => t.name)
        });
      }
    });

    return {
      coveredCapabilities,
      missingCapabilities,
      compatibilityIssues,
      recommendations,
      providedCapabilities: Array.from(providedCapabilities)
    };
  }, [selectedTools, selectedRequirements]);

  // Export configuration
  const exportConfiguration = () => {
    const config = {
      tools: selectedTools.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        capabilities: t.capabilities
      })),
      requirements: selectedRequirements,
      analysis: {
        covered: analysisResult.coveredCapabilities,
        missing: analysisResult.missingCapabilities,
        recommendations: analysisResult.recommendations
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedTools([]);
    setSelectedRequirements({});
  };

  return (
    <ApplicationBuilderContainer>
      <Header>
        <PageTitle>AI Application Builder</PageTitle>
        <PageSubtitle>
          Select AI tools and define your application requirements to analyze what's possible.
          Discover gaps in your tech stack and get recommendations for missing capabilities.
        </PageSubtitle>
      </Header>
      <MainContent>
        {/* Left Panel - Tool Library */}
        <LeftPanel>
          <PanelHeader>
            <PanelTitle>Tool Library</PanelTitle>
          </PanelHeader>
          <PanelContent>
            <SearchInput
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <CategoryFilter>
              {CATEGORIES.map(category => (
                <CategoryButton
                  key={category.id}
                  $active={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </CategoryFilter>

            <div>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  onClick={() => toggleToolSelection(tool)}
                  style={{
                    background: selectedTools.some(t => t.id === tool.id)
                      ? 'var(--gitthub-beige)'
                      : 'var(--gitthub-light-beige)',
                    borderColor: selectedTools.some(t => t.id === tool.id)
                      ? 'var(--gitthub-black)'
                      : 'var(--gitthub-gray)',
                    cursor: 'pointer'
                  }}
                >
                  <ToolName>{tool.name}</ToolName>
                  <ToolDescription>{tool.description}</ToolDescription>
                  <ToolTags>
                    {tool.tags.map(tag => (
                      <ToolTag key={tag}>{tag}</ToolTag>
                    ))}
                  </ToolTags>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    <strong>Price:</strong> {tool.pricing}
                  </div>
                </ToolCard>
              ))}
            </div>
          </PanelContent>
        </LeftPanel>

        {/* Center Panel - Requirements */}
        <CenterPanel>
          <PanelHeader>
            <PanelTitle>Application Requirements</PanelTitle>
          </PanelHeader>
          <PanelContent>
            {Object.entries(APPLICATION_REQUIREMENTS).map(([categoryKey, category]) => (
              <RequirementCategory key={categoryKey}>
                <CategoryTitle>{category.title}</CategoryTitle>
                <RequirementsSection>
                  {category.items.map(item => (
                    <RequirementItem key={item.id}>
                      <RequirementCheckbox
                        type="checkbox"
                        checked={!!selectedRequirements[item.id]}
                        onChange={() => toggleRequirement(item.id)}
                      />
                      <RequirementLabel>
                        <RequirementTitle>{item.label}</RequirementTitle>
                        <RequirementDescription>{item.description}</RequirementDescription>
                      </RequirementLabel>
                    </RequirementItem>
                  ))}
                </RequirementsSection>
              </RequirementCategory>
            ))}
          </PanelContent>
          <ActionBar>
            <ActionButton onClick={clearAll}>Clear All</ActionButton>
            <ActionButton $primary onClick={exportConfiguration}>Export Config</ActionButton>
          </ActionBar>
        </CenterPanel>

        {/* Right Panel - Analysis Summary */}
        <RightPanel>
          <PanelHeader>
            <PanelTitle>Application Analysis</PanelTitle>
          </PanelHeader>
          <PanelContent>
            {/* Compatibility Warnings */}
            {analysisResult.compatibilityIssues.length > 0 && (
              <CompatibilityWarning>
                <WarningTitle>Compatibility Warnings</WarningTitle>
                {analysisResult.compatibilityIssues.map(issue => (
                  <WarningText key={issue.key}>{issue.message}</WarningText>
                ))}
              </CompatibilityWarning>
            )}

            {/* Covered Capabilities */}
            {analysisResult.coveredCapabilities.length > 0 && (
              <SummarySection>
                <SummaryTitle $type="capabilities">
                  ✓ Capabilities Your App Will Have
                </SummaryTitle>
                <SummaryList>
                  {analysisResult.coveredCapabilities.map(cap => (
                    <SummaryItem key={cap.id} $type="success">
                      <strong>{cap.label}</strong>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#666' }}>
                        Provided by: {cap.tools.join(', ')}
                      </div>
                    </SummaryItem>
                  ))}
                </SummaryList>
              </SummarySection>
            )}

            {/* Missing Capabilities */}
            {analysisResult.missingCapabilities.length > 0 && (
              <SummarySection>
                <SummaryTitle $type="missing">
                  ✗ Missing Capabilities
                </SummaryTitle>
                <SummaryList>
                  {analysisResult.missingCapabilities.map(cap => (
                    <SummaryItem key={cap.id} $type="error">
                      <strong>{cap.label}</strong>
                    </SummaryItem>
                  ))}
                </SummaryList>
              </SummarySection>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <SummarySection>
                <SummaryTitle $type="recommendations">
                  💡 Recommendations
                </SummaryTitle>
                <SummaryList>
                  {analysisResult.recommendations.map((rec, idx) => (
                    <SummaryItem key={idx} $type="info">
                      <strong>For {rec.capability}:</strong>
                      <div style={{ marginTop: '0.25rem' }}>
                        Consider adding: {rec.tools.join(' or ')}
                      </div>
                    </SummaryItem>
                  ))}
                </SummaryList>
              </SummarySection>
            )}

            {/* Summary Message */}
            {selectedTools.length > 0 && Object.values(selectedRequirements).some(v => v) && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Summary</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#555' }}>
                  With {selectedTools.length} selected tools, your application can handle{' '}
                  {analysisResult.coveredCapabilities.length} of{' '}
                  {Object.values(selectedRequirements).filter(v => v).length} requested capabilities.
                  {analysisResult.missingCapabilities.length > 0 && (
                    <> You'll need additional tools to cover {analysisResult.missingCapabilities.length} missing capabilities.</>
                  )}
                </p>
              </div>
            )}

            {/* Instructions if nothing selected */}
            {(selectedTools.length === 0 || !Object.values(selectedRequirements).some(v => v)) && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Select tools from the library and check your application requirements to see the analysis.
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  The system will automatically analyze what your tech stack can do and what might be missing.
                </p>
              </div>
            )}
          </PanelContent>
        </RightPanel>
      </MainContent>
    </ApplicationBuilderContainer>
  );
}

export default StackBuilder;