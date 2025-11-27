import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PreviewContainer = styled.div`
  background: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: var(--gitthub-gray);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SuccessBox = styled.div`
  background: #D1FAE5;
  border: 2px solid #10B981;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SuccessIcon = styled.div`
  font-size: 2rem;
`;

const SuccessContent = styled.div`
  flex: 1;
`;

const SuccessTitle = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #065F46;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.div`
  font-size: 0.9rem;
  color: #065F46;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: ${props => props.$active ? '2px' : '0'} solid var(--gitthub-black);
  border-bottom: ${props => props.$active ? 'none' : '2px solid rgba(0, 0, 0, 0.1)'};
  border-radius: ${props => props.$active ? '4px 4px 0 0' : '0'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: ${props => props.$active ? '-2px' : '0'};

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const CodeContainer = styled.div`
  background: #2d2d2d;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CodeHeader = styled.div`
  background: #1a1a1a;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CodeFilename = styled.div`
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  color: #10B981;
  font-weight: 600;
`;

const CopyButton = styled.button`
  padding: 0.5rem 1rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const CodeContent = styled.div`
  max-height: 500px;
  overflow-y: auto;
  font-size: 0.85rem;

  pre {
    margin: 0 !important;
    padding: 1rem !important;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: var(--gitthub-light-beige);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFA500;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: var(--gitthub-gray);
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  padding: 1rem;
  background: ${props => props.$primary ? '#FFA500' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid ${props => props.$primary ? '#FFA500' : 'var(--gitthub-black)'};
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#FF8C00' : 'var(--gitthub-black)'};
    color: white;
    transform: translateY(-1px);
  }
`;


const FILE_TABS = [
  { id: 'server_py', label: 'server.py', language: 'python' },
  { id: 'requirements_txt', label: 'requirements.txt', language: 'text' },
  { id: 'env_example', label: '.env.example', language: 'bash' },
  { id: 'readme_md', label: 'README.md', language: 'markdown' }
];

function CodePreview({ generatedCode, serverConfig, onBack, onReset }) {
  const [activeTab, setActiveTab] = useState('server_py');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    const code = generatedCode[activeTab];
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadAll = () => {
    // Create a text file combining all files (in production, create a ZIP)
    const allFiles = FILE_TABS.map(tab => {
      return `# ========================================\n# ${tab.label}\n# ========================================\n\n${generatedCode[tab.id]}\n\n`;
    }).join('\n');

    const blob = new Blob([allFiles], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverConfig.name || 'mcp-server'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const countLines = (code) => {
    return code ? code.split('\n').length : 0;
  };

  return (
    <PreviewContainer>
      <SectionTitle>Step 4: Download Your MCP Server</SectionTitle>
      <SectionDescription>
        Your MCP server code is ready! Download it and follow the installation instructions.
      </SectionDescription>

      <SuccessBox>
        <SuccessIcon>✅</SuccessIcon>
        <SuccessContent>
          <SuccessTitle>Code Generated Successfully!</SuccessTitle>
          <SuccessText>
            Your {serverConfig.name} MCP server is ready to use.
            Download the files and follow the README for installation instructions.
          </SuccessText>
        </SuccessContent>
      </SuccessBox>

      <StatsGrid>
        <StatCard>
          <StatNumber>{generatedCode?.file_count || 4}</StatNumber>
          <StatLabel>Files</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{countLines(generatedCode?.server_py)}</StatNumber>
          <StatLabel>Lines of Code</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{serverConfig.tools.length}</StatNumber>
          <StatLabel>Tools</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{serverConfig.resources.length + serverConfig.prompts.length}</StatNumber>
          <StatLabel>Resources + Prompts</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabNavigation>
        {FILE_TABS.map(tab => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabNavigation>

      <CodeContainer>
        <CodeHeader>
          <CodeFilename>
            {FILE_TABS.find(t => t.id === activeTab)?.label}
          </CodeFilename>
          <CopyButton onClick={handleCopyCode}>
            {copySuccess ? '✓ Copied!' : 'Copy Code'}
          </CopyButton>
        </CodeHeader>
        <CodeContent>
          <SyntaxHighlighter
            language={FILE_TABS.find(t => t.id === activeTab)?.language}
            style={tomorrow}
            showLineNumbers
          >
            {generatedCode?.[activeTab] || ''}
          </SyntaxHighlighter>
        </CodeContent>
      </CodeContainer>

      <ActionButtons>
        <ActionButton $primary onClick={handleDownloadAll}>
          📥 Download All Files
        </ActionButton>
        <ActionButton onClick={() => alert('Save to database feature coming soon!')}>
          💾 Save to My Servers
        </ActionButton>
      </ActionButtons>
    </PreviewContainer>
  );
}

export default CodePreview;
