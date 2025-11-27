// Pre-defined AI Course Templates for Quick Generation

export const AI_TOPICS = [
  {
    id: 'intro-to-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'Foundational concepts of AI, machine learning, and neural networks for absolute beginners',
    level: 'beginner',
    duration: '4 weeks',
    icon: '🤖',
    category: 'foundations',
    objectives: [
      'Understand what AI is and its real-world applications',
      'Learn the difference between AI, ML, and Deep Learning',
      'Explore basic algorithms and decision-making processes',
      'Get hands-on experience with simple AI tools'
    ],
    prerequisites: ['Basic programming knowledge', 'High school mathematics'],
    targetAudience: 'Students and professionals new to AI'
  },
  {
    id: 'machine-learning-basics',
    title: 'Machine Learning Fundamentals',
    description: 'Core ML algorithms, supervised and unsupervised learning with Python',
    level: 'intermediate',
    duration: '6 weeks',
    icon: '🧠',
    category: 'foundations',
    objectives: [
      'Master supervised learning (classification, regression)',
      'Understand unsupervised learning (clustering, dimensionality reduction)',
      'Implement ML models using Python and scikit-learn',
      'Evaluate and optimize model performance'
    ],
    prerequisites: ['Python programming', 'Statistics basics', 'Linear algebra fundamentals'],
    targetAudience: 'Developers and data enthusiasts with Python experience'
  },
  {
    id: 'deep-learning-intro',
    title: 'Deep Learning & Neural Networks',
    description: 'Understanding neural networks, backpropagation, and building deep learning models',
    level: 'intermediate',
    duration: '8 weeks',
    icon: '🔮',
    category: 'deep_learning',
    objectives: [
      'Understand neural network architecture and components',
      'Learn backpropagation and gradient descent optimization',
      'Build CNNs for image recognition tasks',
      'Implement RNNs for sequence data processing'
    ],
    prerequisites: ['Machine learning basics', 'Python programming', 'Basic calculus'],
    targetAudience: 'ML practitioners ready to dive into deep learning'
  },
  {
    id: 'nlp-fundamentals',
    title: 'Natural Language Processing',
    description: 'Text processing, embeddings, transformers, and modern language models',
    level: 'intermediate',
    duration: '6 weeks',
    icon: '💬',
    category: 'deep_learning',
    objectives: [
      'Process and analyze text data effectively',
      'Understand word embeddings and attention mechanisms',
      'Work with transformer models (BERT, GPT)',
      'Build chatbots and text classifiers from scratch'
    ],
    prerequisites: ['Python', 'Basic machine learning', 'Understanding of neural networks'],
    targetAudience: 'Developers interested in language AI and chatbots'
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision Essentials',
    description: 'Image processing, CNNs, object detection, and image segmentation',
    level: 'intermediate',
    duration: '6 weeks',
    icon: '👁️',
    category: 'deep_learning',
    objectives: [
      'Master image processing and augmentation techniques',
      'Build and train CNNs from scratch',
      'Implement object detection systems (YOLO, R-CNN)',
      'Create image segmentation models for real applications'
    ],
    prerequisites: ['Deep learning basics', 'Python', 'NumPy', 'OpenCV'],
    targetAudience: 'Engineers building visual AI systems'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering for LLMs',
    description: 'Crafting effective prompts, chain-of-thought reasoning, and advanced techniques',
    level: 'beginner',
    duration: '2 weeks',
    icon: '✍️',
    category: 'applied_ai',
    objectives: [
      'Understand how large language models process prompts',
      'Learn proven prompt design patterns and templates',
      'Master chain-of-thought and few-shot prompting',
      'Build effective AI assistants and agents'
    ],
    prerequisites: ['Basic understanding of AI concepts'],
    targetAudience: 'Anyone working with ChatGPT, Claude, or other LLMs'
  },
  {
    id: 'rag-systems',
    title: 'Building RAG Systems',
    description: 'Retrieval-Augmented Generation with vector databases and semantic search',
    level: 'intermediate',
    duration: '4 weeks',
    icon: '📚',
    category: 'applied_ai',
    objectives: [
      'Understand RAG architecture and workflow',
      'Work with vector databases (Pinecone, Chroma, Qdrant)',
      'Implement semantic search with embeddings',
      'Build a production-ready question-answering system'
    ],
    prerequisites: ['Python', 'Basic NLP knowledge', 'API usage experience'],
    targetAudience: 'Developers building AI-powered search and QA systems'
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Responsible AI',
    description: 'Bias, fairness, transparency, and ethical considerations in AI development',
    level: 'beginner',
    duration: '3 weeks',
    icon: '⚖️',
    category: 'ethics',
    objectives: [
      'Identify and mitigate bias in AI systems',
      'Understand fairness metrics and evaluation',
      'Learn responsible AI development principles',
      'Implement ethical practices in real projects'
    ],
    prerequisites: ['Basic understanding of AI and machine learning'],
    targetAudience: 'AI practitioners, product managers, and ethicists'
  },
  {
    id: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    description: 'Agents, rewards, Q-learning, policy gradients, and game-playing AI',
    level: 'advanced',
    duration: '8 weeks',
    icon: '🎮',
    category: 'advanced',
    objectives: [
      'Understand RL fundamentals and Markov Decision Processes',
      'Implement Q-learning and SARSA algorithms',
      'Master policy gradient methods (REINFORCE, PPO)',
      'Build agents that learn to play games'
    ],
    prerequisites: ['Strong ML background', 'Python', 'Probability theory', 'Calculus'],
    targetAudience: 'Advanced ML engineers and researchers'
  },
  {
    id: 'generative-ai',
    title: 'Generative AI & Diffusion Models',
    description: 'GANs, VAEs, Stable Diffusion, and creative AI applications',
    level: 'advanced',
    duration: '6 weeks',
    icon: '🎨',
    category: 'advanced',
    objectives: [
      'Understand generative model architectures',
      'Build GANs and VAEs from scratch',
      'Work with diffusion models (Stable Diffusion)',
      'Create AI-powered art and content generators'
    ],
    prerequisites: ['Deep learning expertise', 'PyTorch or TensorFlow', 'Advanced mathematics'],
    targetAudience: 'ML engineers interested in creative AI applications'
  }
];

// Category definitions for organization
export const TOPIC_CATEGORIES = [
  {
    id: 'foundations',
    name: 'AI Foundations',
    description: 'Start your AI journey with fundamental concepts',
    color: '#3B82F6'
  },
  {
    id: 'deep_learning',
    name: 'Deep Learning',
    description: 'Neural networks and specialized architectures',
    color: '#8B5CF6'
  },
  {
    id: 'applied_ai',
    name: 'Applied AI',
    description: 'Practical AI applications and tools',
    color: '#10B981'
  },
  {
    id: 'advanced',
    name: 'Advanced Topics',
    description: 'Cutting-edge AI techniques',
    color: '#EF4444'
  },
  {
    id: 'ethics',
    name: 'Ethics & Society',
    description: 'Responsible and ethical AI development',
    color: '#F59E0B'
  }
];

// Helper function to get topics by category
export const getTopicsByCategory = (categoryId) => {
  return AI_TOPICS.filter(topic => topic.category === categoryId);
};

// Helper function to get all categories with their topics
export const getCategorizedTopics = () => {
  return TOPIC_CATEGORIES.map(category => ({
    ...category,
    topics: getTopicsByCategory(category.id)
  }));
};

// Helper function to get topic by ID
export const getTopicById = (topicId) => {
  return AI_TOPICS.find(topic => topic.id === topicId);
};

// Level badge colors
export const LEVEL_COLORS = {
  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#EF4444'
};
