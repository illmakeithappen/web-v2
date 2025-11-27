// Course templates for Pipeline and MCP Server tutorials

export const COURSE_TEMPLATES = [
  // ===== PIPELINE COURSES =====
  {
    course_id: 'pipeline-github-analyzer',
    type: 'pipeline',
    title: 'GitHub Issues Analyzer Pipeline',
    description: 'Build a multi-step pipeline that analyzes GitHub issues, categorizes them, and generates summaries using Claude.',
    difficulty: 'beginner',
    duration: '2 hours',
    modulesCount: 4,
    agent: 'Claude Code',
    whatYouWillBuild: 'An automated pipeline that fetches GitHub issues, analyzes sentiment, categorizes by topic, and generates weekly reports',
    tags: ['GitHub', 'API', 'Text Analysis', 'Reporting'],
    status: 'published',
    prerequisites: ['Basic understanding of APIs', 'Familiarity with JSON'],
    // Generation Parameters (Questionnaire Data)
    topic: 'Building automated GitHub issue analysis pipelines',
    target_audience: 'Developers managing open-source projects or technical teams',
    learning_objectives: [
      'Master multi-step pipeline architecture patterns',
      'Integrate GitHub API with Claude AI for analysis',
      'Build automated reporting and categorization systems',
      'Implement sentiment analysis workflows'
    ],
    ai_model_used: 'Claude 3.5 Sonnet',
    include_assessments: true,
    include_projects: true,
    language: 'English',
    databank_resources_used: [
      { id: 1, name: 'GitHub REST API Documentation', type: 'documentation' },
      { id: 2, name: 'Claude API Integration Guide', type: 'tutorial' },
      { id: 3, name: 'Pipeline Design Patterns', type: 'article' }
    ],
    created_at: '2024-10-01T12:00:00Z',
    created_by: 'gitthub-admin',
    last_modified: '2024-10-08T14:30:00Z',
    modules: [
      {
        module_id: 'module-1',
        title: 'Understanding the Workflow',
        description: 'Learn what we\'re building and why each step matters',
        objectives: [
          'Understand the pipeline architecture',
          'Identify key components needed',
          'Map out the data flow'
        ]
      },
      {
        module_id: 'module-2',
        title: 'Selecting Input Sources',
        description: 'Choose and configure your data inputs',
        objectives: [
          'Configure GitHub API access',
          'Set up issue filtering',
          'Define data structure'
        ]
      },
      {
        module_id: 'module-3',
        title: 'Building Processing Steps',
        description: 'Add tools for analysis and transformation',
        objectives: [
          'Add sentiment analysis tool',
          'Configure categorization logic',
          'Set up summarization'
        ]
      },
      {
        module_id: 'module-4',
        title: 'Configuring Outputs',
        description: 'Generate reports and export results',
        objectives: [
          'Create report templates',
          'Configure export formats',
          'Test the complete pipeline'
        ]
      }
    ]
  },
  {
    course_id: 'pipeline-document-processor',
    type: 'pipeline',
    title: 'Document Processing Pipeline',
    description: 'Create a pipeline that ingests documents, extracts key information, and structures data for analysis.',
    difficulty: 'intermediate',
    duration: '3 hours',
    modulesCount: 5,
    agent: 'Claude Code',
    whatYouWillBuild: 'A document processing system that handles PDFs, extracts entities, and creates structured databases',
    tags: ['PDF', 'OCR', 'NLP', 'Data Extraction'],
    status: 'published',
    prerequisites: ['Understanding of document formats', 'Basic data structures'],
    // Generation Parameters
    topic: 'Automated document processing and data extraction',
    target_audience: 'Data engineers and automation specialists',
    learning_objectives: [
      'Build robust document ingestion pipelines',
      'Extract structured data from unstructured documents',
      'Implement entity recognition and classification',
      'Create searchable document databases'
    ],
    ai_model_used: 'Claude 3.5 Sonnet',
    include_assessments: true,
    include_projects: true,
    language: 'English',
    databank_resources_used: [
      { id: 4, name: 'PDF Processing Libraries', type: 'documentation' },
      { id: 5, name: 'OCR Best Practices', type: 'article' }
    ],
    created_at: '2024-10-02T10:00:00Z',
    created_by: 'gitthub-admin',
    last_modified: '2024-10-07T16:20:00Z',
    modules: []
  },
  {
    course_id: 'pipeline-data-validation',
    type: 'pipeline',
    title: 'Data Validation & Transformation Pipeline',
    description: 'Build a robust pipeline for validating, cleaning, and transforming data before analysis.',
    difficulty: 'beginner',
    duration: '1.5 hours',
    modulesCount: 3,
    agent: 'Claude Desktop',
    whatYouWillBuild: 'An automated data quality pipeline with validation rules, cleaning steps, and transformation logic',
    tags: ['Data Quality', 'Validation', 'ETL', 'Transformation'],
    status: 'published',
    prerequisites: ['Basic data concepts'],
    modules: []
  },
  {
    course_id: 'pipeline-research-assistant',
    type: 'pipeline',
    title: 'Multi-Step Research Assistant Pipeline',
    description: 'Design a pipeline that researches topics, synthesizes information, and generates comprehensive reports.',
    difficulty: 'advanced',
    duration: '4 hours',
    modulesCount: 6,
    agent: 'Claude Desktop',
    whatYouWillBuild: 'An intelligent research assistant that searches multiple sources, fact-checks, and produces structured research reports',
    tags: ['Research', 'Web Scraping', 'Synthesis', 'AI'],
    status: 'published',
    prerequisites: ['API integration experience', 'Understanding of web scraping'],
    modules: []
  },

  // ===== MCP SERVER COURSES =====
  {
    course_id: 'mcp-github-manager',
    type: 'mcp',
    title: 'GitHub Issues Manager MCP Server',
    description: 'Build an MCP server that lets Claude create, update, search, and manage GitHub issues directly.',
    difficulty: 'beginner',
    duration: '2.5 hours',
    modulesCount: 4,
    agent: 'Claude Desktop',
    whatYouWillBuild: 'A complete MCP server with tools for issue CRUD operations, labels, assignees, and search functionality',
    tags: ['GitHub', 'MCP', 'Tools', 'API Integration'],
    status: 'published',
    prerequisites: ['GitHub account', 'Basic Python knowledge'],
    // Generation Parameters
    topic: 'Creating MCP servers for GitHub integration',
    target_audience: 'Python developers working with Claude Desktop',
    learning_objectives: [
      'Understand MCP protocol architecture',
      'Build custom tools for Claude',
      'Integrate external APIs with MCP',
      'Deploy and test MCP servers'
    ],
    ai_model_used: 'Claude 3.7 Sonnet',
    include_assessments: true,
    include_projects: true,
    language: 'English',
    databank_resources_used: [
      { id: 6, name: 'MCP Protocol Specification', type: 'documentation' },
      { id: 7, name: 'GitHub API v3 Reference', type: 'documentation' },
      { id: 8, name: 'Python MCP SDK Guide', type: 'tutorial' }
    ],
    created_at: '2024-09-28T09:00:00Z',
    created_by: 'gitthub-admin',
    last_modified: '2024-10-05T11:45:00Z',
    modules: [
      {
        module_id: 'module-1',
        title: 'Understanding MCP Architecture',
        description: 'Learn how MCP servers work and what we\'ll build',
        objectives: [
          'Understand MCP protocol basics',
          'Identify tools vs resources vs prompts',
          'Plan server architecture'
        ]
      },
      {
        module_id: 'module-2',
        title: 'Defining Tools',
        description: 'Create tools for GitHub operations',
        objectives: [
          'Build create_issue tool',
          'Add update_issue tool',
          'Implement search_issues tool'
        ]
      },
      {
        module_id: 'module-3',
        title: 'Adding Resources',
        description: 'Expose GitHub data as resources',
        objectives: [
          'Create issue list resource',
          'Add repository info resource',
          'Configure access controls'
        ]
      },
      {
        module_id: 'module-4',
        title: 'Deploying Your Server',
        description: 'Test and deploy the MCP server',
        objectives: [
          'Test with Claude Desktop',
          'Handle errors gracefully',
          'Deploy for production use'
        ]
      }
    ]
  },
  {
    course_id: 'mcp-document-search',
    type: 'mcp',
    title: 'Document Search MCP Server',
    description: 'Create an MCP server that enables Claude to search, read, and analyze documents in your local filesystem.',
    difficulty: 'intermediate',
    duration: '3 hours',
    modulesCount: 5,
    agent: 'Claude Desktop',
    whatYouWillBuild: 'An MCP server with semantic search, document reading, and content extraction capabilities',
    tags: ['Search', 'Files', 'Embeddings', 'Vector DB'],
    status: 'published',
    prerequisites: ['File system basics', 'Understanding of embeddings'],
    modules: []
  },
  {
    course_id: 'mcp-file-navigator',
    type: 'mcp',
    title: 'File System Navigator MCP Server',
    description: 'Build an MCP server that gives Claude safe access to browse, read, and search files on your computer.',
    difficulty: 'beginner',
    duration: '2 hours',
    modulesCount: 3,
    agent: 'Claude Code',
    whatYouWillBuild: 'A secure file system MCP server with browsing, reading, and search tools plus safety restrictions',
    tags: ['Files', 'Security', 'MCP', 'System Access'],
    status: 'published',
    prerequisites: ['Basic file system knowledge'],
    modules: []
  },
  {
    course_id: 'mcp-notion-workspace',
    type: 'mcp',
    title: 'Notion Workspace MCP Server',
    description: 'Create an MCP server that connects Claude to your Notion workspace for reading, creating, and updating pages.',
    difficulty: 'advanced',
    duration: '4 hours',
    modulesCount: 6,
    agent: 'Claude Desktop',
    whatYouWillBuild: 'A full-featured Notion MCP server with database queries, page creation, and rich content formatting',
    tags: ['Notion', 'Productivity', 'API', 'Databases'],
    status: 'published',
    prerequisites: ['Notion API knowledge', 'Database concepts'],
    modules: []
  },

  // ===== DATA SCIENCE WITH NOTEBOOKS =====
  {
    course_id: 'ds-python-basics',
    type: 'notebook',
    title: 'Data Science with Python - Interactive Notebooks',
    description: 'Learn data science fundamentals through interactive Jupyter notebooks with real-time code execution and visualizations.',
    difficulty: 'beginner',
    duration: '3 hours',
    modulesCount: 3,
    agent: 'Claude Code',
    whatYouWillBuild: 'Interactive data analysis pipelines with pandas, numpy, and matplotlib',
    tags: ['Python', 'Data Science', 'Jupyter', 'Visualization'],
    status: 'published',
    prerequisites: ['Basic Python knowledge'],
    modules: [
      {
        module_id: 'module-1',
        title: 'Introduction to Data Analysis with Python',
        description: 'Get started with Python for data analysis using Jupyter notebooks',
        objectives: [
          'Set up your Python data science environment',
          'Understand Jupyter notebook basics',
          'Load and explore your first dataset'
        ],
        content_sections: [
          {
            title: 'Welcome to Interactive Learning',
            content_type: 'markdown',
            content: `# Welcome to Data Science with Python! 🐍

This course uses **interactive Jupyter notebooks** to teach you data science concepts. You'll be able to:

- Write and execute Python code directly
- See results and visualizations instantly
- Experiment with real datasets
- Track your learning progress

## What Makes This Special?

Unlike traditional courses, you'll learn by doing. Each concept is presented with:

1. **Clear explanations** using rich markdown formatting
2. **Executable code cells** you can modify and run
3. **Immediate visual feedback** through charts and tables
4. **Hands-on exercises** with real data

Let's start with your first interactive lesson!`,
            duration_minutes: 5
          },
          {
            title: 'Your First Data Analysis',
            content_type: 'notebook-markdown',
            content: `## Loading Your First Dataset

Let's start by importing the essential libraries and loading a sample dataset:

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Set up visualization style
plt.style.use('seaborn-v0_8-darkgrid')

# Load sample data
data = pd.DataFrame({
    'Month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'Sales': [45000, 52000, 48000, 61000, 58000, 67000],
    'Costs': [38000, 41000, 39000, 47000, 44000, 49000]
})

print("Dataset loaded successfully!")
print(f"Shape: {data.shape}")
print("\\nFirst few rows:")
data.head()
\`\`\`
# Output:
\`\`\`
Dataset loaded successfully!
Shape: (6, 3)

First few rows:
  Month  Sales  Costs
0   Jan  45000  38000
1   Feb  52000  41000
2   Mar  48000  39000
3   Apr  61000  47000
4   May  58000  44000
\`\`\`

## Calculating Profit

Now let's calculate profit and add it to our dataset:

\`\`\`python
# Calculate profit
data['Profit'] = data['Sales'] - data['Costs']

# Calculate profit margin
data['Profit_Margin'] = (data['Profit'] / data['Sales'] * 100).round(2)

print("Enhanced dataset with calculations:")
data
\`\`\`
# Output:
\`\`\`
Enhanced dataset with calculations:
  Month  Sales  Costs  Profit  Profit_Margin
0   Jan  45000  38000    7000          15.56
1   Feb  52000  41000   11000          21.15
2   Mar  48000  39000    9000          18.75
3   Apr  61000  47000   14000          22.95
4   May  58000  44000   14000          24.14
5   Jun  67000  49000   18000          26.87
\`\`\`

## Visualizing the Results

Let's create a beautiful visualization of our analysis:

\`\`\`python
# Create figure with subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Sales vs Costs comparison
ax1.bar(data['Month'], data['Sales'], label='Sales', alpha=0.7, color='#4CAF50')
ax1.bar(data['Month'], data['Costs'], label='Costs', alpha=0.7, color='#FF9800')
ax1.set_title('Monthly Sales vs Costs', fontsize=14, fontweight='bold')
ax1.set_ylabel('Amount ($)', fontsize=11)
ax1.legend()
ax1.grid(True, alpha=0.3)

# Profit trend
ax2.plot(data['Month'], data['Profit'], marker='o', linewidth=2,
         markersize=8, color='#2196F3', label='Profit')
ax2.fill_between(range(len(data)), data['Profit'], alpha=0.3, color='#2196F3')
ax2.set_title('Monthly Profit Trend', fontsize=14, fontweight='bold')
ax2.set_ylabel('Profit ($)', fontsize=11)
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("📊 Visualization complete!")
\`\`\`
# Output:
\`\`\`
📊 Visualization complete!
\`\`\`

## Key Insights

From our analysis, we can see:
- **Profit is growing**: There's a clear upward trend in monthly profits
- **Best performing month**: June had the highest profit margin at 26.87%
- **Average profit margin**: 21.57% (calculated from the data)

Try modifying the code above to explore different aspects of the data!`,
            duration_minutes: 15
          },
          {
            title: 'Practice Exercises',
            content_type: 'checklist',
            content: `Import pandas and numpy libraries
Create a DataFrame with at least 5 rows
Calculate a new column based on existing data
Create a visualization using matplotlib
Export your results to a CSV file`,
            duration_minutes: 10
          }
        ],
        activities: [
          {
            title: 'Build Your Own Analysis',
            description: 'Create an analysis of your own dataset',
            instructions: [
              'Choose a dataset (can be from CSV or create your own)',
              'Perform at least 3 calculations',
              'Create 2 different visualizations',
              'Write insights about your findings'
            ],
            hints: [
              'Use pd.read_csv() to load external data',
              'Try different chart types: bar, line, scatter',
              'Use describe() method for quick statistics'
            ]
          }
        ]
      },
      {
        module_id: 'module-2',
        title: 'Data Cleaning and Transformation',
        description: 'Learn to clean messy data and transform it for analysis',
        objectives: [
          'Handle missing values effectively',
          'Transform data types',
          'Merge and reshape datasets'
        ],
        content_sections: [
          {
            title: 'Working with Real-World Data',
            content_type: 'markdown',
            content: `## Dealing with Messy Data

Real-world data is rarely perfect. In this module, you'll learn essential techniques for:

- **Identifying data quality issues**
- **Handling missing values strategically**
- **Transforming data for analysis**
- **Combining multiple data sources**

### Common Data Problems

1. **Missing values** (NaN, NULL, empty strings)
2. **Incorrect data types** (numbers stored as text)
3. **Duplicates** (repeated entries)
4. **Inconsistent formatting** (dates, names, categories)
5. **Outliers** (extreme values that may be errors)

Let's dive into practical solutions!`,
            duration_minutes: 5
          }
        ]
      },
      {
        module_id: 'module-3',
        title: 'Advanced Visualizations',
        description: 'Create compelling data stories with advanced visualization techniques',
        objectives: [
          'Master matplotlib and seaborn',
          'Create interactive plots',
          'Design dashboard-ready visualizations'
        ],
        content_sections: [
          {
            title: 'The Art of Data Visualization',
            content_type: 'markdown',
            content: `## Beyond Basic Charts

Great visualizations tell stories. You'll learn to create:

- **Interactive plots** that respond to user input
- **Statistical visualizations** that reveal patterns
- **Multi-dimensional views** of complex data
- **Publication-ready figures** with professional styling

Ready to make your data come alive? Let's begin!`,
            duration_minutes: 5
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getCourseById = (courseId) => {
  return COURSE_TEMPLATES.find(course => course.course_id === courseId);
};

export const getCoursesByType = (type) => {
  return COURSE_TEMPLATES.filter(course => course.type === type);
};

export const getCoursesByDifficulty = (difficulty) => {
  return COURSE_TEMPLATES.filter(course => course.difficulty === difficulty);
};

export const getCourseTags = () => {
  const tagsSet = new Set();
  COURSE_TEMPLATES.forEach(course => {
    course.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};
