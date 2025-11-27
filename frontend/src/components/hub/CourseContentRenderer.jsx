import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styled from 'styled-components'
import Plot from 'react-plotly.js'
import 'katex/dist/katex.min.css'

// Styled Components with Beige Theme
const ContentDocument = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #faf9f7 100%);
  border: 1px solid #e8e4dd;
  border-radius: 8px;
  padding: 2.5rem;
  margin: 0;
  line-height: 1.7;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(139, 122, 88, 0.06),
    0 4px 16px rgba(139, 122, 88, 0.04);
  position: relative;

  /* Subtle paper texture */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(90deg, transparent 0%, rgba(139, 122, 88, 0.01) 50%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(139, 122, 88, 0.006) 2px,
        rgba(139, 122, 88, 0.006) 4px
      );
    pointer-events: none;
    border-radius: 8px;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const ContentHeading = styled.h2`
  font-size: 1.75rem;
  color: var(--gitthub-black);
  margin: 2rem 0 1.2rem 0;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gitthub-beige);
  line-height: 1.3;

  &:first-child {
    margin-top: 0;
  }
`

const ContentSubheading = styled.h3`
  font-size: 1.4rem;
  color: var(--gitthub-black);
  margin: 1.5rem 0 1rem 0;
  font-weight: 600;
  line-height: 1.3;
`

const ContentParagraph = styled.p`
  font-size: 1.05rem;
  line-height: 1.75;
  color: #2c2c2c;
  margin: 1rem 0;
`

const ContentList = styled.ul`
  font-size: 1.05rem;
  line-height: 1.75;
  color: #2c2c2c;
  margin: 1rem 0;
  padding-left: 2rem;

  li {
    margin: 0.6rem 0;

    input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }
  }
`

const CodeBlock = styled.div`
  background: #1e1e1e;
  border: 2px solid var(--gitthub-black);
  border-radius: 6px;
  margin: 1.5rem 0;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`

const CodeHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--gitthub-black);
`

const LanguageBadge = styled.span`
  background: var(--gitthub-black);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`

const CopyButton = styled.button`
  background: white;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-black);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-black);
    color: white;
  }
`

const InlineCode = styled.code`
  background: var(--gitthub-light-beige);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--gitthub-black);
  border: 1px solid var(--gitthub-beige);
`

const Blockquote = styled.blockquote`
  border-left: 4px solid var(--gitthub-beige);
  padding: 0 1.5rem;
  margin: 1.5rem 0;
  color: #57606a;
  background: linear-gradient(90deg, var(--gitthub-light-beige) 0%, transparent 100%);
  border-radius: 0 4px 4px 0;
`

const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: ${props => props.$checked ?
    'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' :
    'linear-gradient(135deg, var(--gitthub-light-beige) 0%, #f5f4f0 100%)'
  };
  border-radius: 6px;
  border: 1px solid ${props => props.$checked ? '#81c784' : 'var(--gitthub-beige)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  input[type="checkbox"] {
    margin-top: 0.25rem;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    flex: 1;
  }
`

// Notebook Cell Components
const NotebookCell = styled.div`
  margin: 2rem 0;
  position: relative;
`

const NotebookCodeCell = styled.div`
  background: #1e1e1e;
  border: 2px solid var(--gitthub-black);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

const NotebookCellHeader = styled.div`
  background: linear-gradient(135deg, var(--gitthub-beige) 0%, var(--gitthub-light-beige) 100%);
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 2px solid var(--gitthub-black);
`

const ExecutionBadge = styled.span`
  background: var(--gitthub-black);
  color: var(--gitthub-light-beige);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  font-weight: 600;
`

const NotebookOutput = styled.div`
  background: #faf9f7;
  border: 1px solid var(--gitthub-beige);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #24292f;

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
  }
`

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: white;
  border: 1px solid var(--gitthub-beige);
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;

  thead {
    background: var(--gitthub-light-beige);
  }

  th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--gitthub-beige);
    color: var(--gitthub-black);
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e8e4dd;
  }

  tbody tr:nth-child(even) {
    background: #faf9f7;
  }

  tbody tr:hover {
    background: var(--gitthub-light-beige);
  }
`

// Helper function to detect content type
const detectContentType = (content) => {
  if (!content) return 'text'

  // Check if it's a Jupyter notebook JSON
  if (typeof content === 'object' && content.cells) {
    return 'notebook'
  }

  // Check if content contains notebook markers
  if (typeof content === 'string') {
    if (content.includes('```python') && content.includes('# Output:')) {
      return 'notebook-markdown'
    }
    if (content.includes('```jupyter') || content.includes('```notebook')) {
      return 'notebook-embedded'
    }
  }

  return 'markdown'
}

// Copy to clipboard function
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // Could add a toast notification here
  })
}

// Parse notebook from markdown
const parseNotebookFromMarkdown = (content) => {
  const cells = []
  const codeBlockRegex = /```python\n([\s\S]*?)```\n(?:# Output:\n```\n([\s\S]*?)```)?/g

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add any markdown before the code block
    if (match.index > lastIndex) {
      const markdown = content.substring(lastIndex, match.index).trim()
      if (markdown) {
        cells.push({ type: 'markdown', content: markdown })
      }
    }

    // Add the code cell
    cells.push({
      type: 'code',
      source: match[1],
      output: match[2] || null
    })

    lastIndex = match.index + match[0].length
  }

  // Add any remaining markdown
  if (lastIndex < content.length) {
    const markdown = content.substring(lastIndex).trim()
    if (markdown) {
      cells.push({ type: 'markdown', content: markdown })
    }
  }

  return cells
}

// Notebook Cell Renderer
const NotebookCellRenderer = ({ cell, index }) => {
  if (cell.type === 'markdown') {
    return (
      <ContentDocument style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={markdownComponents}
        >
          {cell.content}
        </ReactMarkdown>
      </ContentDocument>
    )
  }

  if (cell.type === 'code') {
    return (
      <NotebookCell>
        <NotebookCodeCell>
          <NotebookCellHeader>
            <ExecutionBadge>In [{index}]</ExecutionBadge>
            <LanguageBadge>Python</LanguageBadge>
            <CopyButton onClick={() => copyToClipboard(cell.source)}>
              Copy
            </CopyButton>
          </NotebookCellHeader>
          <SyntaxHighlighter
            language="python"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#1e1e1e',
              fontSize: '0.95rem'
            }}
          >
            {cell.source}
          </SyntaxHighlighter>
        </NotebookCodeCell>

        {cell.output && (
          <NotebookOutput>
            <pre>{cell.output}</pre>
          </NotebookOutput>
        )}
      </NotebookCell>
    )
  }

  return null
}

// Markdown components configuration
const markdownComponents = {
  h1: ({ children }) => <ContentHeading as="h1" style={{ fontSize: '2rem' }}>{children}</ContentHeading>,
  h2: ({ children }) => <ContentHeading>{children}</ContentHeading>,
  h3: ({ children }) => <ContentSubheading>{children}</ContentSubheading>,
  p: ({ children }) => <ContentParagraph>{children}</ContentParagraph>,
  ul: ({ children }) => <ContentList>{children}</ContentList>,
  ol: ({ children }) => <ContentList as="ol">{children}</ContentList>,
  blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''

    if (!inline && language) {
      return (
        <CodeBlock>
          <CodeHeader>
            <LanguageBadge>{language}</LanguageBadge>
            <CopyButton onClick={() => copyToClipboard(String(children))}>
              Copy
            </CopyButton>
          </CodeHeader>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#1e1e1e',
              fontSize: '0.95rem'
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </CodeBlock>
      )
    }

    return <InlineCode {...props}>{children}</InlineCode>
  }
}

// Main Component
const CourseContentRenderer = ({
  content,
  contentType,
  onStepCheck,
  checkedSteps = {},
  moduleIndex = 0,
  sectionIndex = 0
}) => {
  const detectedType = contentType || detectContentType(content)

  // Handle checklist items specially
  if (contentType === 'checklist') {
    const items = content.split('\n').filter(item => item.trim())
    return (
      <div>
        {items.map((item, idx) => {
          const stepId = `${moduleIndex}-${sectionIndex}-${idx}`
          return (
            <ChecklistItem
              key={stepId}
              $checked={checkedSteps[stepId]}
              onClick={() => onStepCheck && onStepCheck(stepId)}
            >
              <input
                type="checkbox"
                checked={checkedSteps[stepId] || false}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              <label>{item}</label>
            </ChecklistItem>
          )
        })}
      </div>
    )
  }

  // Handle notebook content
  if (detectedType === 'notebook-markdown') {
    const cells = parseNotebookFromMarkdown(content)
    return (
      <ContentDocument>
        {cells.map((cell, index) => (
          <NotebookCellRenderer key={index} cell={cell} index={index + 1} />
        ))}
      </ContentDocument>
    )
  }

  // Handle standard markdown
  if (detectedType === 'markdown' || detectedType === 'text') {
    return (
      <ContentDocument>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </ContentDocument>
    )
  }

  // Handle raw notebook JSON
  if (detectedType === 'notebook' && typeof content === 'object') {
    const { cells } = content
    return (
      <ContentDocument>
        {cells.map((cell, index) => {
          const cellData = {
            type: cell.cell_type === 'code' ? 'code' : 'markdown',
            source: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
            output: cell.outputs?.[0]?.text?.join('') || null
          }
          return <NotebookCellRenderer key={index} cell={cellData} index={index + 1} />
        })}
      </ContentDocument>
    )
  }

  // Fallback to plain text
  return (
    <ContentDocument>
      <ContentParagraph>{content}</ContentParagraph>
    </ContentDocument>
  )
}

export default CourseContentRenderer