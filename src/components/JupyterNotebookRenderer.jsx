import React from 'react'
import styled from 'styled-components'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Plot from 'react-plotly.js'
import MarkdownRenderer from './MarkdownRenderer'

// Main notebook container with paper effect
const NotebookDocument = styled.div`
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 3rem;
  max-width: 900px;
  margin: 0 auto;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.03);
  position: relative;

  /* Paper texture subtle effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.01) 50%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.008) 2px,
        rgba(0,0,0,0.008) 4px
      );
    pointer-events: none;
    border-radius: 6px;
    z-index: 0;
  }

  /* Ensure content is above the texture */
  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

const NotebookHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e1e4e8;
`

const NotebookTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const NotebookMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  strong {
    color: var(--gitthub-black);
  }
`

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.$primary ? '#FFA500' : '#f6f8fa'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};
  border: 2px solid ${props => props.$primary ? '#FFA500' : '#d1d5db'};
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: ${props => props.$primary ? '#FF9400' : '#e1e4e8'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Cell = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`

const CellLabel = styled.div`
  font-size: 0.8rem;
  color: var(--gitthub-gray);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const CodeCell = styled.div`
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`

const CodeCellHeader = styled.div`
  background: #2d2d2d;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #333;
`

const ExecutionCount = styled.span`
  color: #4ec9b0;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
`

const LanguageBadge = styled.span`
  background: #3794ff;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`

const CodeContent = styled.div`
  pre {
    margin: 0 !important;
    padding: 1rem !important;
    background: #1e1e1e !important;
  }

  code {
    font-size: 0.9rem !important;
    line-height: 1.5 !important;
  }
`

const OutputCell = styled.div`
  background: #f6f8fa;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
`

const OutputText = styled.pre`
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #24292f;
  white-space: pre-wrap;
  word-wrap: break-word;
`

const ImageOutput = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
`

const VideoOutput = styled.video`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
`

const HTMLOutput = styled.div`
  overflow-x: auto;
`

const DataFrameTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;

  thead {
    background: #f6f8fa;
  }

  th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #d1d5db;
    border-right: 1px solid #e1e4e8;

    &:last-child {
      border-right: none;
    }
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e1e4e8;
    border-right: 1px solid #e1e4e8;

    &:last-child {
      border-right: none;
    }
  }

  tbody tr:nth-child(even) {
    background: #fafbfc;
  }

  tbody tr:hover {
    background: #f0f0f0;
  }
`

const ErrorOutput = styled.div`
  background: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 4px;
  padding: 1rem;
  color: #c62828;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
`

// Render output based on type
const OutputRenderer = ({ output }) => {
  if (!output) return null

  const outputType = output.output_type

  // Stream output (stdout/stderr)
  if (outputType === 'stream') {
    return (
      <OutputCell>
        <OutputText>{output.text?.join('') || ''}</OutputText>
      </OutputCell>
    )
  }

  // Error output
  if (outputType === 'error') {
    return (
      <ErrorOutput>
        {output.ename}: {output.evalue}
        {'\n'}
        {output.traceback?.join('\n')}
      </ErrorOutput>
    )
  }

  // Execute result or display data
  if (outputType === 'execute_result' || outputType === 'display_data') {
    const data = output.data

    // Plotly chart
    if (data?.['application/vnd.plotly.v1+json']) {
      const plotlyData = data['application/vnd.plotly.v1+json']
      return (
        <OutputCell>
          <Plot
            data={plotlyData.data}
            layout={plotlyData.layout || {}}
            config={{ responsive: true }}
            style={{ width: '100%' }}
          />
        </OutputCell>
      )
    }

    // Image (PNG, JPEG, SVG)
    if (data?.['image/png']) {
      return (
        <OutputCell>
          <ImageOutput src={`data:image/png;base64,${data['image/png']}`} alt="Output" />
        </OutputCell>
      )
    }

    if (data?.['image/jpeg']) {
      return (
        <OutputCell>
          <ImageOutput src={`data:image/jpeg;base64,${data['image/jpeg']}`} alt="Output" />
        </OutputCell>
      )
    }

    if (data?.['image/svg+xml']) {
      return (
        <OutputCell>
          <HTMLOutput dangerouslySetInnerHTML={{ __html: data['image/svg+xml'] }} />
        </OutputCell>
      )
    }

    // HTML output
    if (data?.['text/html']) {
      const htmlContent = Array.isArray(data['text/html'])
        ? data['text/html'].join('')
        : data['text/html']

      // Check if it's a DataFrame
      if (htmlContent.includes('dataframe')) {
        return (
          <OutputCell>
            <HTMLOutput dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </OutputCell>
        )
      }

      return (
        <OutputCell>
          <HTMLOutput dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </OutputCell>
      )
    }

    // Plain text output
    if (data?.['text/plain']) {
      const textContent = Array.isArray(data['text/plain'])
        ? data['text/plain'].join('')
        : data['text/plain']

      return (
        <OutputCell>
          <OutputText>{textContent}</OutputText>
        </OutputCell>
      )
    }
  }

  return null
}

// Main component
const JupyterNotebookRenderer = ({ notebook, metadata = {}, showActions = true }) => {
  if (!notebook || !notebook.cells) {
    return <div>Invalid notebook format</div>
  }

  const { cells } = notebook
  const nbMetadata = notebook.metadata || {}

  // Extract notebook info
  const kernelInfo = nbMetadata.kernelspec?.display_name || nbMetadata.kernelspec?.name || 'Unknown'
  const language = nbMetadata.language_info?.name || 'python'

  return (
    <NotebookDocument>
      {metadata.title && (
        <NotebookHeader>
          <NotebookTitle>{metadata.title}</NotebookTitle>
          <NotebookMeta>
            {kernelInfo && (
              <MetaItem>
                <strong>Kernel:</strong> {kernelInfo}
              </MetaItem>
            )}
            {language && (
              <MetaItem>
                <strong>Language:</strong> {language}
              </MetaItem>
            )}
            <MetaItem>
              <strong>Cells:</strong> {cells.length}
            </MetaItem>
          </NotebookMeta>
        </NotebookHeader>
      )}

      {showActions && (
        <ActionBar>
          <ActionButton
            href={metadata.colabUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            $primary
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            Open in Colab
          </ActionButton>

          <ActionButton
            href={metadata.binderUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Open in Binder
          </ActionButton>

          <ActionButton
            as="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${metadata.title || 'notebook'}.ipynb`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download .ipynb
          </ActionButton>
        </ActionBar>
      )}

      {cells.map((cell, index) => {
        const cellType = cell.cell_type

        // Markdown cell
        if (cellType === 'markdown') {
          const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source

          return (
            <Cell key={index}>
              <div style={{ background: 'white', borderRadius: '6px', padding: '0.5rem' }}>
                <MarkdownRenderer content={source} />
              </div>
            </Cell>
          )
        }

        // Code cell
        if (cellType === 'code') {
          const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
          const executionCount = cell.execution_count
          const outputs = cell.outputs || []

          return (
            <Cell key={index}>
              <CodeCell>
                <CodeCellHeader>
                  {executionCount !== null && executionCount !== undefined && (
                    <ExecutionCount>In [{executionCount}]:</ExecutionCount>
                  )}
                  <LanguageBadge>{language}</LanguageBadge>
                </CodeCellHeader>
                <CodeContent>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      background: '#1e1e1e'
                    }}
                  >
                    {source}
                  </SyntaxHighlighter>
                </CodeContent>
              </CodeCell>

              {outputs.map((output, outputIndex) => (
                <OutputRenderer key={outputIndex} output={output} />
              ))}
            </Cell>
          )
        }

        // Raw cell (rare)
        if (cellType === 'raw') {
          const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
          return (
            <Cell key={index}>
              <CellLabel>Raw Cell</CellLabel>
              <OutputCell>
                <OutputText>{source}</OutputText>
              </OutputCell>
            </Cell>
          )
        }

        return null
      })}
    </NotebookDocument>
  )
}

export default JupyterNotebookRenderer
