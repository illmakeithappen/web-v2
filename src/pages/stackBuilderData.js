// Enhanced Tool Definitions with Capability Mappings
export const TOOLS_WITH_CAPABILITIES = [
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
export const APPLICATION_REQUIREMENTS = {
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