export const WORKFLOW_TEMPLATES = [
  {
    id: 'rag-application',
    name: 'RAG Application',
    description: 'Retrieval-Augmented Generation system for document Q&A',
    category: 'AI Application',
    nodes: [
      {
        id: 'llm-1',
        type: 'tool',
        position: { x: 400, y: 200 },
        data: {
          label: 'OpenAI GPT',
          toolType: 'llm',
          description: 'Language model for generating responses',
          icon: '🤖'
        }
      },
      {
        id: 'vectordb-1',
        type: 'tool',
        position: { x: 100, y: 200 },
        data: {
          label: 'Pinecone',
          toolType: 'vectordb',
          description: 'Vector database for semantic search',
          icon: '🗄️'
        }
      },
      {
        id: 'framework-1',
        type: 'tool',
        position: { x: 250, y: 80 },
        data: {
          label: 'LangChain',
          toolType: 'framework',
          description: 'Orchestration framework',
          icon: '🔗'
        }
      },
      {
        id: 'approval-1',
        type: 'approval',
        position: { x: 250, y: 320 },
        data: {
          label: 'Human Review',
          description: 'Review generated responses before sending',
          icon: '✋'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'vectordb-1', target: 'framework-1', animated: true },
      { id: 'e2-3', source: 'framework-1', target: 'llm-1', animated: true },
      { id: 'e3-4', source: 'llm-1', target: 'approval-1', animated: true }
    ],
    tools: ['openai', 'pinecone', 'langchain']
  },
  {
    id: 'chatbot-basic',
    name: 'AI Chat Bot',
    description: 'Conversational AI with persistent storage',
    category: 'AI Application',
    nodes: [
      {
        id: 'llm-1',
        type: 'tool',
        position: { x: 250, y: 100 },
        data: {
          label: 'Claude',
          toolType: 'llm',
          description: 'Conversational AI model',
          icon: '🤖'
        }
      },
      {
        id: 'db-1',
        type: 'tool',
        position: { x: 100, y: 250 },
        data: {
          label: 'PostgreSQL',
          toolType: 'database',
          description: 'Chat history storage',
          icon: '💾'
        }
      },
      {
        id: 'cache-1',
        type: 'tool',
        position: { x: 400, y: 250 },
        data: {
          label: 'Redis',
          toolType: 'cache',
          description: 'Session caching',
          icon: '⚡'
        }
      },
      {
        id: 'deploy-1',
        type: 'tool',
        position: { x: 250, y: 400 },
        data: {
          label: 'Render',
          toolType: 'deployment',
          description: 'Cloud deployment',
          icon: '🚀'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'llm-1', target: 'db-1' },
      { id: 'e1-3', source: 'llm-1', target: 'cache-1' },
      { id: 'e2-4', source: 'db-1', target: 'deploy-1' },
      { id: 'e3-4', source: 'cache-1', target: 'deploy-1' }
    ],
    tools: ['claude', 'postgresql', 'redis', 'render']
  },
  {
    id: 'doc-processing',
    name: 'Document Processing Pipeline',
    description: 'Extract, process, and analyze documents at scale',
    category: 'Data Processing',
    nodes: [
      {
        id: 'framework-1',
        type: 'tool',
        position: { x: 100, y: 100 },
        data: {
          label: 'LlamaIndex',
          toolType: 'framework',
          description: 'Document ingestion framework',
          icon: '📄'
        }
      },
      {
        id: 'llm-1',
        type: 'tool',
        position: { x: 300, y: 100 },
        data: {
          label: 'OpenAI GPT',
          toolType: 'llm',
          description: 'Extract structured data',
          icon: '🤖'
        }
      },
      {
        id: 'storage-1',
        type: 'tool',
        position: { x: 500, y: 100 },
        data: {
          label: 'MongoDB',
          toolType: 'database',
          description: 'Document storage',
          icon: '🗃️'
        }
      },
      {
        id: 'approval-1',
        type: 'approval',
        position: { x: 300, y: 250 },
        data: {
          label: 'Quality Check',
          description: 'Verify extracted data accuracy',
          icon: '✅'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'framework-1', target: 'llm-1', animated: true },
      { id: 'e2-3', source: 'llm-1', target: 'approval-1', animated: true },
      { id: 'e3-4', source: 'approval-1', target: 'storage-1', animated: true }
    ],
    tools: ['llamaindex', 'openai', 'mongodb']
  },
  {
    id: 'mlops-pipeline',
    name: 'MLOps Pipeline',
    description: 'End-to-end ML model training, deployment, and monitoring',
    category: 'MLOps',
    nodes: [
      {
        id: 'platform-1',
        type: 'tool',
        position: { x: 100, y: 100 },
        data: {
          label: 'Hugging Face',
          toolType: 'platform',
          description: 'Model training & hosting',
          icon: '🤗'
        }
      },
      {
        id: 'monitor-1',
        type: 'tool',
        position: { x: 300, y: 100 },
        data: {
          label: 'Weights & Biases',
          toolType: 'monitoring',
          description: 'Experiment tracking',
          icon: '📊'
        }
      },
      {
        id: 'deploy-1',
        type: 'tool',
        position: { x: 500, y: 100 },
        data: {
          label: 'AWS',
          toolType: 'deployment',
          description: 'Production deployment',
          icon: '☁️'
        }
      },
      {
        id: 'approval-1',
        type: 'approval',
        position: { x: 300, y: 250 },
        data: {
          label: 'Model Review',
          description: 'Approve model for production',
          icon: '🔍'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'platform-1', target: 'monitor-1', animated: true },
      { id: 'e2-3', source: 'monitor-1', target: 'approval-1', animated: true },
      { id: 'e3-4', source: 'approval-1', target: 'deploy-1', animated: true }
    ],
    tools: ['huggingface', 'wandb', 'aws']
  },
  {
    id: 'semantic-search',
    name: 'Semantic Search Engine',
    description: 'AI-powered search with vector embeddings',
    category: 'Search & Discovery',
    nodes: [
      {
        id: 'vectordb-1',
        type: 'tool',
        position: { x: 100, y: 150 },
        data: {
          label: 'Weaviate',
          toolType: 'vectordb',
          description: 'Vector search engine',
          icon: '🔍'
        }
      },
      {
        id: 'llm-1',
        type: 'tool',
        position: { x: 100, y: 50 },
        data: {
          label: 'OpenAI GPT',
          toolType: 'llm',
          description: 'Generate embeddings',
          icon: '🤖'
        }
      },
      {
        id: 'framework-1',
        type: 'tool',
        position: { x: 350, y: 100 },
        data: {
          label: 'LangChain',
          toolType: 'framework',
          description: 'Search orchestration',
          icon: '🔗'
        }
      },
      {
        id: 'deploy-1',
        type: 'tool',
        position: { x: 600, y: 100 },
        data: {
          label: 'Vercel',
          toolType: 'deployment',
          description: 'Edge deployment',
          icon: '▲'
        }
      }
    ],
    edges: [
      { id: 'e1-3', source: 'llm-1', target: 'framework-1', animated: true },
      { id: 'e2-3', source: 'vectordb-1', target: 'framework-1', animated: true },
      { id: 'e3-4', source: 'framework-1', target: 'deploy-1' }
    ],
    tools: ['weaviate', 'openai', 'langchain', 'vercel']
  },
  {
    id: 'data-analytics',
    name: 'AI Data Analytics',
    description: 'Automated data analysis and insights generation',
    category: 'Data Analytics',
    nodes: [
      {
        id: 'db-1',
        type: 'tool',
        position: { x: 100, y: 150 },
        data: {
          label: 'PostgreSQL',
          toolType: 'database',
          description: 'Data warehouse',
          icon: '📊'
        }
      },
      {
        id: 'llm-1',
        type: 'tool',
        position: { x: 350, y: 150 },
        data: {
          label: 'Claude',
          toolType: 'llm',
          description: 'Generate insights',
          icon: '🤖'
        }
      },
      {
        id: 'monitor-1',
        type: 'tool',
        position: { x: 600, y: 150 },
        data: {
          label: 'Langfuse',
          toolType: 'monitoring',
          description: 'Track AI performance',
          icon: '📈'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'db-1', target: 'llm-1', animated: true },
      { id: 'e2-3', source: 'llm-1', target: 'monitor-1' }
    ],
    tools: ['postgresql', 'claude', 'langfuse']
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'AI Application',
  'Data Processing',
  'MLOps',
  'Search & Discovery',
  'Data Analytics'
];
