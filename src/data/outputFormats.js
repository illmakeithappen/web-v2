// Output Format Definitions for Claude Pipeline Builder

export const OUTPUT_CATEGORIES = [
  { id: 'documents', name: 'Documents', icon: '📄', description: 'Generate reports, PDFs, and text documents' },
  { id: 'data', name: 'Data Files', icon: '💾', description: 'Export structured data formats' },
  { id: 'interactive', name: 'Interactive', icon: '🎛️', description: 'Create dashboards and web apps' },
  { id: 'code', name: 'Code', icon: '⌨️', description: 'Generate scripts and notebooks' },
  { id: 'communication', name: 'Communication', icon: '📨', description: 'Send emails, messages, and notifications' }
];

export const OUTPUT_FORMATS = {
  // === DOCUMENTS ===
  documents: [
    {
      id: 'doc-markdown',
      name: 'Markdown Report',
      category: 'documents',
      icon: '📝',
      description: 'Generate formatted Markdown document',
      templates: [
        { id: 'executive', name: 'Executive Summary', description: 'High-level overview with key insights' },
        { id: 'technical', name: 'Technical Report', description: 'Detailed technical documentation' },
        { id: 'analysis', name: 'Data Analysis', description: 'Statistical analysis with visualizations' },
        { id: 'meeting', name: 'Meeting Notes', description: 'Structured meeting summary' },
        { id: 'custom', name: 'Custom Template', description: 'Define your own Markdown structure' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        includeToC: { type: 'boolean', label: 'Include Table of Contents', default: true },
        sections: { type: 'multi-text', label: 'Required Sections', placeholder: 'Introduction, Findings, Conclusion' },
        style: { type: 'select', label: 'Style Guide', options: ['GitHub', 'CommonMark', 'Academic'], default: 'GitHub' }
      },
      examples: ['Executive summary', 'Technical documentation', 'Research report']
    },
    {
      id: 'doc-html',
      name: 'HTML Page',
      category: 'documents',
      icon: '🌐',
      description: 'Generate styled HTML document',
      templates: [
        { id: 'landing', name: 'Landing Page', description: 'Single-page website' },
        { id: 'portfolio', name: 'Portfolio', description: 'Project showcase page' },
        { id: 'documentation', name: 'Documentation Site', description: 'Multi-section docs' },
        { id: 'blog', name: 'Blog Post', description: 'Article with header/footer' },
        { id: 'custom', name: 'Custom HTML', description: 'Custom structure and styling' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        cssFramework: { type: 'select', label: 'CSS Framework', options: ['None', 'Bootstrap', 'Tailwind'], default: 'None' },
        theme: { type: 'select', label: 'Color Theme', options: ['Light', 'Dark', 'Auto'], default: 'Light' },
        responsive: { type: 'boolean', label: 'Mobile Responsive', default: true }
      },
      examples: ['Project page', 'Documentation site', 'Blog post']
    },
    {
      id: 'doc-pdf',
      name: 'PDF Document',
      category: 'documents',
      icon: '📕',
      description: 'Generate professional PDF',
      templates: [
        { id: 'report', name: 'Business Report', description: 'Formal business document' },
        { id: 'invoice', name: 'Invoice', description: 'Billing document' },
        { id: 'presentation', name: 'Presentation Slides', description: 'Slide deck format' },
        { id: 'whitepaper', name: 'Whitepaper', description: 'Research paper format' },
        { id: 'custom', name: 'Custom PDF', description: 'Custom layout and styling' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        pageSize: { type: 'select', label: 'Page Size', options: ['A4', 'Letter', 'Legal'], default: 'A4' },
        orientation: { type: 'select', label: 'Orientation', options: ['Portrait', 'Landscape'], default: 'Portrait' },
        headerFooter: { type: 'boolean', label: 'Include Header/Footer', default: true }
      },
      examples: ['Business report', 'Invoice', 'Whitepaper']
    },
    {
      id: 'doc-word',
      name: 'Word Document',
      category: 'documents',
      icon: '📘',
      description: 'Generate Microsoft Word .docx file',
      templates: [
        { id: 'memo', name: 'Memo', description: 'Internal communication' },
        { id: 'proposal', name: 'Proposal', description: 'Business proposal' },
        { id: 'contract', name: 'Contract', description: 'Legal agreement template' },
        { id: 'resume', name: 'Resume', description: 'Professional CV' },
        { id: 'custom', name: 'Custom Document', description: 'Custom Word template' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        styles: { type: 'boolean', label: 'Apply Built-in Styles', default: true },
        trackChanges: { type: 'boolean', label: 'Enable Track Changes', default: false }
      },
      examples: ['Business memo', 'Proposal', 'Contract']
    }
  ],

  // === DATA FILES ===
  data: [
    {
      id: 'data-excel',
      name: 'Excel Spreadsheet',
      category: 'data',
      icon: '📊',
      description: 'Generate Excel workbook with data and charts',
      templates: [
        { id: 'financial', name: 'Financial Report', description: 'P&L, balance sheet format' },
        { id: 'sales', name: 'Sales Dashboard', description: 'Sales metrics and charts' },
        { id: 'analytics', name: 'Analytics Report', description: 'Data analysis with pivots' },
        { id: 'comparison', name: 'Comparison Table', description: 'Side-by-side comparison' },
        { id: 'custom', name: 'Custom Workbook', description: 'Define custom sheets and format' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        includeCharts: { type: 'boolean', label: 'Include Charts', default: true },
        pivotTables: { type: 'boolean', label: 'Create Pivot Tables', default: false },
        formatting: { type: 'boolean', label: 'Apply Conditional Formatting', default: true },
        formulas: { type: 'boolean', label: 'Include Formulas', default: true }
      },
      examples: ['Financial report', 'Sales dashboard', 'Data export']
    },
    {
      id: 'data-csv',
      name: 'CSV File',
      category: 'data',
      icon: '📄',
      description: 'Export as comma-separated values',
      templates: [
        { id: 'simple', name: 'Simple Export', description: 'Plain CSV export' },
        { id: 'normalized', name: 'Normalized Data', description: 'Clean, normalized format' },
        { id: 'custom', name: 'Custom CSV', description: 'Custom delimiter and encoding' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        delimiter: { type: 'select', label: 'Delimiter', options: [',', ';', '\t', '|'], default: ',' },
        encoding: { type: 'select', label: 'Encoding', options: ['UTF-8', 'UTF-16', 'ISO-8859-1'], default: 'UTF-8' },
        headers: { type: 'boolean', label: 'Include Headers', default: true },
        quoting: { type: 'select', label: 'Quote Style', options: ['Minimal', 'All', 'None'], default: 'Minimal' }
      },
      examples: ['Data export', 'Bulk import format', 'Database dump']
    },
    {
      id: 'data-json',
      name: 'JSON File',
      category: 'data',
      icon: '{ }',
      description: 'Export as structured JSON',
      templates: [
        { id: 'array', name: 'Array Format', description: 'Array of objects' },
        { id: 'nested', name: 'Nested Objects', description: 'Hierarchical structure' },
        { id: 'api', name: 'API Response', description: 'REST API format' },
        { id: 'config', name: 'Configuration', description: 'Config file format' },
        { id: 'custom', name: 'Custom JSON', description: 'Custom schema' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        pretty: { type: 'boolean', label: 'Pretty Print (Indented)', default: true },
        indent: { type: 'number', label: 'Indent Spaces', default: 2, min: 0, max: 8 },
        schema: { type: 'json', label: 'JSON Schema (optional)' }
      },
      examples: ['API export', 'Configuration file', 'Data interchange']
    },
    {
      id: 'data-parquet',
      name: 'Parquet File',
      category: 'data',
      icon: '🗜️',
      description: 'Export as Apache Parquet columnar format',
      templates: [
        { id: 'analytics', name: 'Analytics Export', description: 'Optimized for analytics' },
        { id: 'warehouse', name: 'Data Warehouse', description: 'ETL pipeline format' },
        { id: 'custom', name: 'Custom Parquet', description: 'Custom schema and compression' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        compression: { type: 'select', label: 'Compression', options: ['snappy', 'gzip', 'brotli', 'none'], default: 'snappy' },
        rowGroupSize: { type: 'number', label: 'Row Group Size', default: 1000000 }
      },
      examples: ['Big data export', 'Analytics pipeline', 'Data lake storage']
    }
  ],

  // === INTERACTIVE ===
  interactive: [
    {
      id: 'interactive-dashboard-react',
      name: 'React Dashboard',
      category: 'interactive',
      icon: '⚛️',
      description: 'Interactive React web dashboard',
      templates: [
        { id: 'analytics', name: 'Analytics Dashboard', description: 'Metrics and charts' },
        { id: 'admin', name: 'Admin Panel', description: 'Management interface' },
        { id: 'monitoring', name: 'Monitoring Dashboard', description: 'Real-time monitoring' },
        { id: 'custom', name: 'Custom Dashboard', description: 'Build from scratch' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        chartLibrary: { type: 'select', label: 'Chart Library', options: ['Recharts', 'Chart.js', 'D3'], default: 'Recharts' },
        uiFramework: { type: 'select', label: 'UI Framework', options: ['Material-UI', 'Ant Design', 'Chakra UI'], default: 'Material-UI' },
        darkMode: { type: 'boolean', label: 'Include Dark Mode', default: true }
      },
      examples: ['Analytics dashboard', 'Admin panel', 'Monitoring interface']
    },
    {
      id: 'interactive-streamlit',
      name: 'Streamlit App',
      category: 'interactive',
      icon: '🎈',
      description: 'Python Streamlit web application',
      templates: [
        { id: 'data-explorer', name: 'Data Explorer', description: 'Interactive data analysis' },
        { id: 'ml-demo', name: 'ML Model Demo', description: 'Model prediction interface' },
        { id: 'report', name: 'Interactive Report', description: 'Filterable report' },
        { id: 'custom', name: 'Custom App', description: 'Custom Streamlit app' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        caching: { type: 'boolean', label: 'Enable Caching', default: true },
        sidebar: { type: 'boolean', label: 'Include Sidebar', default: true },
        theme: { type: 'select', label: 'Theme', options: ['Light', 'Dark'], default: 'Light' }
      },
      examples: ['Data explorer', 'ML demo', 'Interactive report']
    },
    {
      id: 'interactive-gradio',
      name: 'Gradio Interface',
      category: 'interactive',
      icon: '🎨',
      description: 'Gradio ML model interface',
      templates: [
        { id: 'classifier', name: 'Classifier', description: 'Image/text classification' },
        { id: 'generator', name: 'Generator', description: 'Text/image generation' },
        { id: 'chatbot', name: 'Chatbot', description: 'Conversational interface' },
        { id: 'custom', name: 'Custom Interface', description: 'Custom Gradio blocks' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        examples: { type: 'boolean', label: 'Include Examples', default: true },
        analytics: { type: 'boolean', label: 'Enable Analytics', default: false },
        share: { type: 'boolean', label: 'Generate Share Link', default: false }
      },
      examples: ['ML model interface', 'Chatbot', 'Image classifier']
    }
  ],

  // === CODE ===
  code: [
    {
      id: 'code-python',
      name: 'Python Script',
      category: 'code',
      icon: '🐍',
      description: 'Generate Python automation script',
      templates: [
        { id: 'data-processing', name: 'Data Processing', description: 'ETL pipeline script' },
        { id: 'api-client', name: 'API Client', description: 'API interaction script' },
        { id: 'automation', name: 'Automation', description: 'Task automation script' },
        { id: 'analysis', name: 'Data Analysis', description: 'Analysis script' },
        { id: 'custom', name: 'Custom Script', description: 'Custom Python code' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        includeTests: { type: 'boolean', label: 'Include Unit Tests', default: false },
        docstrings: { type: 'boolean', label: 'Add Docstrings', default: true },
        typeHints: { type: 'boolean', label: 'Include Type Hints', default: true },
        logging: { type: 'boolean', label: 'Add Logging', default: true }
      },
      examples: ['ETL pipeline', 'API client', 'Automation script']
    },
    {
      id: 'code-jupyter',
      name: 'Jupyter Notebook',
      category: 'code',
      icon: '📓',
      description: 'Generate interactive Jupyter notebook',
      templates: [
        { id: 'analysis', name: 'Data Analysis', description: 'Step-by-step analysis' },
        { id: 'tutorial', name: 'Tutorial', description: 'Educational notebook' },
        { id: 'exploration', name: 'Data Exploration', description: 'Exploratory analysis' },
        { id: 'ml', name: 'ML Workflow', description: 'Machine learning pipeline' },
        { id: 'custom', name: 'Custom Notebook', description: 'Custom cells and markdown' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        includePlots: { type: 'boolean', label: 'Include Visualizations', default: true },
        markdown: { type: 'boolean', label: 'Rich Markdown Cells', default: true },
        outputs: { type: 'boolean', label: 'Execute and Save Outputs', default: false }
      },
      examples: ['Data analysis', 'ML tutorial', 'Exploratory analysis']
    },
    {
      id: 'code-shell',
      name: 'Shell Script',
      category: 'code',
      icon: '💻',
      description: 'Generate Bash/Shell automation script',
      templates: [
        { id: 'deploy', name: 'Deployment Script', description: 'App deployment automation' },
        { id: 'backup', name: 'Backup Script', description: 'Data backup automation' },
        { id: 'setup', name: 'Setup Script', description: 'Environment setup' },
        { id: 'cron', name: 'Cron Job', description: 'Scheduled task' },
        { id: 'custom', name: 'Custom Script', description: 'Custom shell commands' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        shell: { type: 'select', label: 'Shell', options: ['bash', 'zsh', 'sh'], default: 'bash' },
        errorHandling: { type: 'boolean', label: 'Add Error Handling', default: true },
        logging: { type: 'boolean', label: 'Add Logging', default: true }
      },
      examples: ['Deployment script', 'Backup automation', 'Setup script']
    }
  ],

  // === COMMUNICATION ===
  communication: [
    {
      id: 'comm-email',
      name: 'Email',
      category: 'communication',
      icon: '📧',
      description: 'Send email with results',
      templates: [
        { id: 'report', name: 'Report Email', description: 'Email with report attachment' },
        { id: 'alert', name: 'Alert Notification', description: 'Urgent alert message' },
        { id: 'summary', name: 'Summary Digest', description: 'Daily/weekly summary' },
        { id: 'custom', name: 'Custom Email', description: 'Custom template' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        to: { type: 'text', label: 'Recipient Email(s)', required: true, placeholder: 'email@example.com' },
        cc: { type: 'text', label: 'CC (optional)', placeholder: 'cc@example.com' },
        subject: { type: 'text', label: 'Subject Line', required: true },
        format: { type: 'select', label: 'Format', options: ['HTML', 'Plain Text'], default: 'HTML' },
        attachResults: { type: 'boolean', label: 'Attach Pipeline Results', default: true }
      },
      examples: ['Send report', 'Alert notification', 'Daily summary']
    },
    {
      id: 'comm-slack',
      name: 'Slack Message',
      category: 'communication',
      icon: '💬',
      description: 'Post to Slack channel',
      templates: [
        { id: 'notification', name: 'Notification', description: 'Simple notification' },
        { id: 'alert', name: 'Alert', description: 'Urgent alert with mentions' },
        { id: 'report', name: 'Report Summary', description: 'Formatted report' },
        { id: 'custom', name: 'Custom Message', description: 'Custom Slack blocks' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        webhook: { type: 'password', label: 'Webhook URL', required: true },
        channel: { type: 'text', label: 'Channel', placeholder: '#general' },
        mentions: { type: 'text', label: 'Mentions', placeholder: '@user1, @user2' },
        thread: { type: 'boolean', label: 'Reply in Thread', default: false }
      },
      examples: ['Send notification', 'Alert team', 'Post report']
    },
    {
      id: 'comm-github-issue',
      name: 'GitHub Issue',
      category: 'communication',
      icon: '🐙',
      description: 'Create GitHub issue',
      templates: [
        { id: 'bug', name: 'Bug Report', description: 'Bug report template' },
        { id: 'feature', name: 'Feature Request', description: 'Feature request' },
        { id: 'task', name: 'Task', description: 'Task/to-do item' },
        { id: 'custom', name: 'Custom Issue', description: 'Custom template' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        repo: { type: 'text', label: 'Repository', required: true, placeholder: 'owner/repo' },
        token: { type: 'password', label: 'GitHub Token', required: true },
        title: { type: 'text', label: 'Issue Title', required: true },
        labels: { type: 'text', label: 'Labels', placeholder: 'bug, enhancement' },
        assignees: { type: 'text', label: 'Assignees', placeholder: 'username1, username2' }
      },
      examples: ['Create bug report', 'Request feature', 'Track task']
    },
    {
      id: 'comm-webhook',
      name: 'Webhook POST',
      category: 'communication',
      icon: '🔗',
      description: 'Send results to webhook endpoint',
      templates: [
        { id: 'json', name: 'JSON Payload', description: 'Send JSON data' },
        { id: 'form', name: 'Form Data', description: 'POST form data' },
        { id: 'custom', name: 'Custom Webhook', description: 'Custom format' }
      ],
      configSchema: {
        template: { type: 'select', label: 'Template', options: [], required: true },
        url: { type: 'text', label: 'Webhook URL', required: true },
        method: { type: 'select', label: 'HTTP Method', options: ['POST', 'PUT', 'PATCH'], default: 'POST' },
        headers: { type: 'json', label: 'Headers (JSON)', placeholder: '{"Authorization": "Bearer token"}' },
        format: { type: 'select', label: 'Data Format', options: ['JSON', 'Form Data', 'XML'], default: 'JSON' }
      },
      examples: ['Trigger automation', 'Update external system', 'Send to API']
    }
  ]
};

// Helper function to get all output formats as flat array
export function getAllOutputFormats() {
  return Object.values(OUTPUT_FORMATS).flat();
}

// Helper function to get output formats by category
export function getOutputFormatsByCategory(categoryId) {
  return OUTPUT_FORMATS[categoryId] || [];
}

// Helper function to find output format by ID
export function getOutputFormatById(id) {
  return getAllOutputFormats().find(format => format.id === id);
}

// Helper function to get templates for a specific output format
export function getTemplatesForFormat(formatId) {
  const format = getOutputFormatById(formatId);
  return format ? format.templates : [];
}
