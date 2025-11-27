// Input Source Definitions for Claude Pipeline Builder

export const INPUT_CATEGORIES = [
  { id: 'files', name: 'Files', icon: '📁', description: 'Upload or reference files from various sources' },
  { id: 'databases', name: 'Databases', icon: '🗄️', description: 'Connect to relational and NoSQL databases' },
  { id: 'apis', name: 'APIs', icon: '🔌', description: 'Integrate with REST, GraphQL, and other APIs' },
  { id: 'structured', name: 'Structured Data', icon: '📊', description: 'Work with spreadsheets and data files' },
  { id: 'web', name: 'Web', icon: '🌐', description: 'Scrape websites and fetch web content' },
  { id: 'realtime', name: 'Real-time', icon: '⚡', description: 'Streams, events, and live data' }
];

export const INPUT_SOURCES = {
  // === FILES ===
  files: [
    {
      id: 'file-local-upload',
      name: 'Local File Upload',
      category: 'files',
      icon: '📤',
      description: 'Upload files from your computer',
      supportedFormats: ['.pdf', '.docx', '.txt', '.md', '.csv', '.xlsx', '.json', '.xml'],
      configSchema: {
        files: { type: 'file-list', label: 'Select Files', required: true },
        maxSize: { type: 'number', label: 'Max Size (MB)', default: 10 },
        allowMultiple: { type: 'boolean', label: 'Allow Multiple Files', default: true }
      },
      examples: ['Upload PDFs for analysis', 'Process Word documents', 'Import text files']
    },
    {
      id: 'file-path',
      name: 'File Path Reference',
      category: 'files',
      icon: '📍',
      description: 'Reference files by absolute or relative paths',
      supportedFormats: ['All file types'],
      configSchema: {
        path: { type: 'text', label: 'File Path', required: true, placeholder: '/path/to/file.pdf' },
        recursive: { type: 'boolean', label: 'Include Subdirectories', default: false },
        pattern: { type: 'text', label: 'File Pattern (glob)', placeholder: '*.pdf' }
      },
      examples: ['Reference local directory', 'Batch process files', 'Monitor folder for new files']
    },
    {
      id: 'file-s3',
      name: 'AWS S3 Storage',
      category: 'files',
      icon: '☁️',
      description: 'Access files from Amazon S3 buckets',
      supportedFormats: ['All file types'],
      configSchema: {
        bucket: { type: 'text', label: 'Bucket Name', required: true },
        key: { type: 'text', label: 'Object Key/Prefix', required: true },
        region: { type: 'select', label: 'Region', options: ['us-east-1', 'us-west-2', 'eu-west-1'], default: 'us-east-1' },
        accessKey: { type: 'text', label: 'Access Key ID', required: true },
        secretKey: { type: 'password', label: 'Secret Access Key', required: true }
      },
      examples: ['Read from S3 bucket', 'Process cloud-stored files', 'Access shared storage']
    },
    {
      id: 'file-google-drive',
      name: 'Google Drive',
      category: 'files',
      icon: '📁',
      description: 'Access files from Google Drive',
      supportedFormats: ['Google Docs', 'Sheets', 'Slides', 'PDFs', 'Images'],
      configSchema: {
        fileId: { type: 'text', label: 'File/Folder ID', required: true },
        apiKey: { type: 'password', label: 'API Key', required: true },
        includeShared: { type: 'boolean', label: 'Include Shared Files', default: false }
      },
      examples: ['Access Google Docs', 'Import Google Sheets', 'Sync from Drive']
    },
    {
      id: 'file-dropbox',
      name: 'Dropbox',
      category: 'files',
      icon: '📦',
      description: 'Access files from Dropbox',
      supportedFormats: ['All file types'],
      configSchema: {
        path: { type: 'text', label: 'Dropbox Path', required: true, placeholder: '/folder/file.pdf' },
        accessToken: { type: 'password', label: 'Access Token', required: true },
        recursive: { type: 'boolean', label: 'Include Subfolders', default: false }
      },
      examples: ['Sync from Dropbox', 'Access team files', 'Download shared folders']
    }
  ],

  // === DATABASES ===
  databases: [
    {
      id: 'db-postgresql',
      name: 'PostgreSQL',
      category: 'databases',
      icon: '🐘',
      description: 'Connect to PostgreSQL database',
      configSchema: {
        host: { type: 'text', label: 'Host', required: true, placeholder: 'localhost' },
        port: { type: 'number', label: 'Port', default: 5432 },
        database: { type: 'text', label: 'Database Name', required: true },
        user: { type: 'text', label: 'Username', required: true },
        password: { type: 'password', label: 'Password', required: true },
        query: { type: 'textarea', label: 'SQL Query (optional)', placeholder: 'SELECT * FROM users' }
      },
      examples: ['Query customer data', 'Extract analytics', 'Join multiple tables']
    },
    {
      id: 'db-mysql',
      name: 'MySQL',
      category: 'databases',
      icon: '🐬',
      description: 'Connect to MySQL/MariaDB database',
      configSchema: {
        host: { type: 'text', label: 'Host', required: true, placeholder: 'localhost' },
        port: { type: 'number', label: 'Port', default: 3306 },
        database: { type: 'text', label: 'Database Name', required: true },
        user: { type: 'text', label: 'Username', required: true },
        password: { type: 'password', label: 'Password', required: true },
        query: { type: 'textarea', label: 'SQL Query (optional)', placeholder: 'SELECT * FROM orders' }
      },
      examples: ['Extract sales data', 'Query e-commerce database', 'Generate reports']
    },
    {
      id: 'db-mongodb',
      name: 'MongoDB',
      category: 'databases',
      icon: '🍃',
      description: 'Connect to MongoDB database',
      configSchema: {
        uri: { type: 'text', label: 'Connection URI', required: true, placeholder: 'mongodb://localhost:27017' },
        database: { type: 'text', label: 'Database Name', required: true },
        collection: { type: 'text', label: 'Collection Name', required: true },
        query: { type: 'textarea', label: 'Query (JSON)', placeholder: '{ "status": "active" }' }
      },
      examples: ['Query document store', 'Extract user profiles', 'Aggregate logs']
    },
    {
      id: 'db-sqlite',
      name: 'SQLite',
      category: 'databases',
      icon: '🗃️',
      description: 'Connect to SQLite database file',
      configSchema: {
        path: { type: 'text', label: 'Database File Path', required: true, placeholder: '/path/to/database.db' },
        query: { type: 'textarea', label: 'SQL Query (optional)', placeholder: 'SELECT * FROM table' }
      },
      examples: ['Query local database', 'Extract embedded data', 'Analyze app database']
    },
    {
      id: 'db-redis',
      name: 'Redis',
      category: 'databases',
      icon: '🔴',
      description: 'Connect to Redis key-value store',
      configSchema: {
        host: { type: 'text', label: 'Host', required: true, placeholder: 'localhost' },
        port: { type: 'number', label: 'Port', default: 6379 },
        password: { type: 'password', label: 'Password (optional)' },
        db: { type: 'number', label: 'Database Number', default: 0 },
        keys: { type: 'text', label: 'Key Pattern', placeholder: 'user:*' }
      },
      examples: ['Fetch cached data', 'Extract session info', 'Query key-value pairs']
    }
  ],

  // === APIs ===
  apis: [
    {
      id: 'api-rest',
      name: 'REST API',
      category: 'apis',
      icon: '🔗',
      description: 'Call REST API endpoints',
      configSchema: {
        url: { type: 'text', label: 'API Endpoint', required: true, placeholder: 'https://api.example.com/data' },
        method: { type: 'select', label: 'HTTP Method', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
        headers: { type: 'json', label: 'Headers (JSON)', placeholder: '{"Authorization": "Bearer token"}' },
        body: { type: 'json', label: 'Request Body (JSON)', placeholder: '{"key": "value"}' },
        params: { type: 'json', label: 'Query Params (JSON)', placeholder: '{"page": 1}' }
      },
      examples: ['Fetch API data', 'POST form data', 'Authenticate and query']
    },
    {
      id: 'api-graphql',
      name: 'GraphQL API',
      category: 'apis',
      icon: '◈',
      description: 'Query GraphQL endpoints',
      configSchema: {
        endpoint: { type: 'text', label: 'GraphQL Endpoint', required: true, placeholder: 'https://api.example.com/graphql' },
        query: { type: 'textarea', label: 'GraphQL Query', required: true, placeholder: 'query { users { id name } }' },
        variables: { type: 'json', label: 'Variables (JSON)', placeholder: '{"limit": 10}' },
        headers: { type: 'json', label: 'Headers (JSON)', placeholder: '{"Authorization": "Bearer token"}' }
      },
      examples: ['Query graph data', 'Fetch nested resources', 'Paginated queries']
    },
    {
      id: 'api-webhook',
      name: 'Webhook Listener',
      category: 'apis',
      icon: '📞',
      description: 'Receive data via webhooks',
      configSchema: {
        url: { type: 'text', label: 'Webhook URL', required: true, readonly: true, placeholder: 'Auto-generated' },
        secret: { type: 'password', label: 'Webhook Secret (optional)' },
        method: { type: 'select', label: 'Allowed Methods', options: ['POST', 'GET', 'PUT'], default: 'POST' }
      },
      examples: ['Receive GitHub webhooks', 'Listen for Stripe events', 'Handle form submissions']
    },
    {
      id: 'api-websocket',
      name: 'WebSocket Stream',
      category: 'apis',
      icon: '🔌',
      description: 'Connect to WebSocket for real-time data',
      configSchema: {
        url: { type: 'text', label: 'WebSocket URL', required: true, placeholder: 'wss://stream.example.com' },
        protocol: { type: 'text', label: 'Protocol (optional)' },
        reconnect: { type: 'boolean', label: 'Auto-reconnect', default: true }
      },
      examples: ['Stream market data', 'Real-time chat', 'Live notifications']
    }
  ],

  // === STRUCTURED DATA ===
  structured: [
    {
      id: 'structured-excel',
      name: 'Excel Spreadsheet',
      category: 'structured',
      icon: '📊',
      description: 'Import Excel files (.xlsx, .xls)',
      configSchema: {
        file: { type: 'file', label: 'Excel File', required: true, accept: '.xlsx,.xls' },
        sheet: { type: 'text', label: 'Sheet Name (optional)', placeholder: 'Sheet1' },
        range: { type: 'text', label: 'Cell Range (optional)', placeholder: 'A1:Z100' },
        headerRow: { type: 'number', label: 'Header Row Number', default: 1 }
      },
      examples: ['Import sales data', 'Process financial reports', 'Analyze survey responses']
    },
    {
      id: 'structured-csv',
      name: 'CSV File',
      category: 'structured',
      icon: '📄',
      description: 'Import comma-separated values',
      configSchema: {
        file: { type: 'file', label: 'CSV File', required: true, accept: '.csv' },
        delimiter: { type: 'text', label: 'Delimiter', default: ',' },
        encoding: { type: 'select', label: 'Encoding', options: ['UTF-8', 'UTF-16', 'ISO-8859-1'], default: 'UTF-8' },
        hasHeader: { type: 'boolean', label: 'First Row is Header', default: true }
      },
      examples: ['Import customer list', 'Process export data', 'Bulk data import']
    },
    {
      id: 'structured-json',
      name: 'JSON File',
      category: 'structured',
      icon: '{ }',
      description: 'Import JSON data files',
      configSchema: {
        file: { type: 'file', label: 'JSON File', required: true, accept: '.json' },
        path: { type: 'text', label: 'JSONPath (optional)', placeholder: '$.data[*]' },
        validate: { type: 'boolean', label: 'Validate JSON Schema', default: false }
      },
      examples: ['Import configuration', 'Process API responses', 'Load data export']
    },
    {
      id: 'structured-xml',
      name: 'XML File',
      category: 'structured',
      icon: '</>',
      description: 'Import XML documents',
      configSchema: {
        file: { type: 'file', label: 'XML File', required: true, accept: '.xml' },
        xpath: { type: 'text', label: 'XPath Query (optional)', placeholder: '//record' },
        namespace: { type: 'json', label: 'Namespaces (JSON)', placeholder: '{"ns": "http://..."}' }
      },
      examples: ['Parse XML feeds', 'Import SOAP responses', 'Process legacy data']
    },
    {
      id: 'structured-parquet',
      name: 'Parquet File',
      category: 'structured',
      icon: '🗜️',
      description: 'Import Apache Parquet columnar data',
      configSchema: {
        file: { type: 'file', label: 'Parquet File', required: true, accept: '.parquet' },
        columns: { type: 'text', label: 'Columns (comma-separated)', placeholder: 'col1,col2,col3' }
      },
      examples: ['Import big data', 'Process analytics exports', 'Load data warehouse files']
    }
  ],

  // === WEB ===
  web: [
    {
      id: 'web-scrape',
      name: 'Web Scraping',
      category: 'web',
      icon: '🕷️',
      description: 'Extract data from websites',
      configSchema: {
        url: { type: 'text', label: 'Target URL', required: true, placeholder: 'https://example.com' },
        selector: { type: 'text', label: 'CSS Selector', placeholder: '.article-content' },
        waitFor: { type: 'text', label: 'Wait for Element', placeholder: '#content' },
        javascript: { type: 'boolean', label: 'Execute JavaScript', default: false }
      },
      examples: ['Scrape product data', 'Extract article content', 'Monitor website changes']
    },
    {
      id: 'web-rss',
      name: 'RSS Feed',
      category: 'web',
      icon: '📡',
      description: 'Subscribe to RSS/Atom feeds',
      configSchema: {
        url: { type: 'text', label: 'Feed URL', required: true, placeholder: 'https://example.com/feed.xml' },
        limit: { type: 'number', label: 'Max Items', default: 50 },
        since: { type: 'date', label: 'Items Since Date' }
      },
      examples: ['Monitor blog posts', 'Aggregate news', 'Track updates']
    },
    {
      id: 'web-sitemap',
      name: 'Sitemap Crawler',
      category: 'web',
      icon: '🗺️',
      description: 'Crawl website from sitemap',
      configSchema: {
        sitemapUrl: { type: 'text', label: 'Sitemap URL', required: true, placeholder: 'https://example.com/sitemap.xml' },
        maxPages: { type: 'number', label: 'Max Pages', default: 100 },
        pattern: { type: 'text', label: 'URL Pattern (regex)', placeholder: '.*\/blog\/.*' }
      },
      examples: ['Crawl entire site', 'Extract all pages', 'Index website content']
    }
  ],

  // === REAL-TIME ===
  realtime: [
    {
      id: 'realtime-stream',
      name: 'Data Stream',
      category: 'realtime',
      icon: '🌊',
      description: 'Connect to data streams',
      configSchema: {
        source: { type: 'text', label: 'Stream Source', required: true },
        format: { type: 'select', label: 'Data Format', options: ['JSON', 'CSV', 'Binary'], default: 'JSON' },
        buffer: { type: 'number', label: 'Buffer Size', default: 1000 }
      },
      examples: ['Stream sensor data', 'Real-time logs', 'Live metrics']
    },
    {
      id: 'realtime-events',
      name: 'Event Source (SSE)',
      category: 'realtime',
      icon: '📨',
      description: 'Server-sent events stream',
      configSchema: {
        url: { type: 'text', label: 'SSE Endpoint', required: true, placeholder: 'https://api.example.com/events' },
        eventType: { type: 'text', label: 'Event Type Filter' },
        reconnect: { type: 'boolean', label: 'Auto-reconnect', default: true }
      },
      examples: ['Real-time notifications', 'Live updates', 'Event streaming']
    },
    {
      id: 'realtime-queue',
      name: 'Message Queue',
      category: 'realtime',
      icon: '📬',
      description: 'Connect to message queues (RabbitMQ, Kafka)',
      configSchema: {
        type: { type: 'select', label: 'Queue Type', options: ['RabbitMQ', 'Kafka', 'Redis Queue'], required: true },
        host: { type: 'text', label: 'Host', required: true },
        queue: { type: 'text', label: 'Queue/Topic Name', required: true },
        credentials: { type: 'json', label: 'Credentials (JSON)' }
      },
      examples: ['Process job queue', 'Subscribe to topics', 'Handle async tasks']
    }
  ]
};

// Helper function to get all input sources as flat array
export function getAllInputSources() {
  return Object.values(INPUT_SOURCES).flat();
}

// Helper function to get input sources by category
export function getInputSourcesByCategory(categoryId) {
  return INPUT_SOURCES[categoryId] || [];
}

// Helper function to find input source by ID
export function getInputSourceById(id) {
  return getAllInputSources().find(source => source.id === id);
}
