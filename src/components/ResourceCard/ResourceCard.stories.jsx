import ResourceCard from './ResourceCard';

export default {
  title: 'Components/ResourceCard',
  component: ResourceCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onAction: { action: 'clicked' },
    resourceType: {
      control: 'select',
      options: ['link', 'document'],
    },
  },
};

// Default card with all features
export const Default = {
  args: {
    title: 'ChatGPT by OpenAI',
    description: 'Conversational AI that helps with writing, learning, brainstorming and more. A powerful tool for natural language processing.',
    format: 'URL',
    category: 'ai_tools',
    tags: ['AI', 'NLP', 'Chatbot', 'OpenAI', 'GPT-4'],
    resourceType: 'link',
    screenshotUrl: 'chat_openai_com_e4c706adbc.png',
    apiUrl: 'http://localhost:8000',
  },
};

// Card without screenshot
export const WithoutScreenshot = {
  args: {
    title: 'Machine Learning Basics PDF',
    description: 'A comprehensive guide to understanding machine learning fundamentals, including supervised and unsupervised learning techniques.',
    format: 'PDF',
    category: 'learning_materials',
    tags: ['Machine Learning', 'Tutorial', 'Beginner'],
    resourceType: 'document',
  },
};

// Document type card
export const DocumentCard = {
  args: {
    title: 'Deep Learning Research Paper',
    description: 'Latest research on transformer architectures and their applications in natural language understanding.',
    format: 'PDF',
    category: 'research_papers',
    tags: ['Deep Learning', 'Transformers', 'Research'],
    resourceType: 'document',
    screenshotUrl: 'arxiv_org_9c02c848ef.png',
    apiUrl: 'http://localhost:8000',
  },
};

// Link type card
export const LinkCard = {
  args: {
    title: 'Hugging Face',
    description: 'The AI community building the future. Access thousands of pre-trained models and datasets.',
    format: 'URL',
    category: 'ai_platforms',
    tags: ['Models', 'Datasets', 'Community'],
    resourceType: 'link',
    screenshotUrl: 'huggingface_co_78c9f4b04c.png',
    apiUrl: 'http://localhost:8000',
  },
};

// Card with few tags
export const WithFewTags = {
  args: {
    title: 'GitHub Repository',
    description: 'Open source code repository for AI projects.',
    format: 'URL',
    category: 'developer_tools',
    tags: ['GitHub', 'Open Source'],
    resourceType: 'link',
  },
};

// Card with many tags (showing overflow)
export const WithManyTags = {
  args: {
    title: 'Comprehensive AI Toolkit',
    description: 'Everything you need for AI development including frameworks, libraries, datasets, tutorials, and deployment tools.',
    format: 'URL',
    category: 'ai_tools',
    tags: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'NumPy', 'Pandas', 'Docker', 'Kubernetes'],
    resourceType: 'link',
  },
};

// Card with long text
export const WithLongText = {
  args: {
    title: 'Advanced Neural Networks and Deep Learning Architectures for Complex Problem Solving',
    description: 'An extensive exploration of cutting-edge neural network architectures including convolutional networks, recurrent networks, transformers, and attention mechanisms. This resource covers everything from basic concepts to advanced implementations with real-world applications.',
    format: 'PDF',
    category: 'advanced_learning',
    tags: ['Deep Learning', 'Neural Networks', 'Advanced'],
    resourceType: 'document',
  },
};

// Different categories
export const DatasetCard = {
  args: {
    title: 'ImageNet Dataset',
    description: 'Large-scale image database for visual object recognition research.',
    format: 'ZIP',
    category: 'datasets',
    tags: ['Images', 'Classification', 'Training Data'],
    resourceType: 'document',
  },
};

export const ToolCard = {
  args: {
    title: 'TensorFlow Playground',
    description: 'Interactive visualization tool for neural networks. Experiment with different architectures in your browser.',
    format: 'URL',
    category: 'interactive_tools',
    tags: ['Visualization', 'Learning', 'Interactive'],
    resourceType: 'link',
    screenshotUrl: 'github_com_dba769c840.png',
    apiUrl: 'http://localhost:8000',
  },
};

// Minimal card
export const Minimal = {
  args: {
    title: 'Quick Link',
    description: 'A simple resource card.',
    resourceType: 'link',
  },
};

// With custom action
export const CustomAction = {
  args: {
    title: 'Claude AI',
    description: 'Anthropic\'s helpful, harmless, and honest AI assistant.',
    format: 'URL',
    category: 'ai_tools',
    tags: ['AI', 'Anthropic', 'Assistant'],
    resourceType: 'link',
    screenshotUrl: 'claude_ai_075219c588.png',
    apiUrl: 'http://localhost:8000',
  },
};

// Grid layout demo
export const GridDemo = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '1.5rem',
    }}>
      <ResourceCard
        title="ChatGPT"
        description="OpenAI's conversational AI assistant"
        format="URL"
        category="ai_tools"
        tags={['AI', 'Chat', 'NLP']}
        resourceType="link"
      />
      <ResourceCard
        title="GitHub"
        description="Code hosting platform"
        format="URL"
        category="developer_tools"
        tags={['Git', 'Code', 'Open Source']}
        resourceType="link"
      />
      <ResourceCard
        title="Research Paper"
        description="Latest AI research findings"
        format="PDF"
        category="research"
        tags={['Research', 'Academic']}
        resourceType="document"
      />
    </div>
  ),
};
