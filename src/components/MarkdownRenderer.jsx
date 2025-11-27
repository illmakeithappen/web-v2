import React, { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import MermaidDiagram from './MermaidDiagram'
import ObsidianCallout from './ObsidianCallout'
import 'katex/dist/katex.min.css'

// Styled Components
const ReadmeDocument = styled.div`
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 3rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  line-height: 1.7;
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

const ReadmeHeader = styled.div`
  margin-bottom: 2.5rem;
`

const ReadmeMainTitle = styled.h1`
  font-size: 3rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`

const ReadmeSubtitle = styled.p`
  font-size: 1.3rem;
  color: var(--gitthub-gray);
  margin: 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const TableOfContents = styled.div`
  background: #f6f8fa;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
`

const TocTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--gitthub-black);
  margin: 0 0 1rem 0;
  font-weight: 700;
`

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const TocItem = styled.li`
  margin: 0.5rem 0;
  padding-left: ${props => props.$level === 2 ? '1.5rem' : '0'};
`

const TocLink = styled.a`
  color: #0969da;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`

const ReadmeSection = styled.section`
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const ReadmeHeading = styled.h2`
  font-size: 2rem;
  color: var(--gitthub-black);
  margin: 2rem 0 1.5rem 0;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #d1d5db;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`

const ReadmeSubheading = styled.h3`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin: 1.5rem 0 1rem 0;
  font-weight: 600;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`

const ReadmeParagraph = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #24292f;
  margin: 1rem 0;
`

const ReadmeList = styled.ul`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #24292f;
  margin: 1rem 0;
  padding-left: 2rem;

  li {
    margin: 0.5rem 0;
  }

  /* Task list styling */
  li input[type="checkbox"] {
    margin-right: 0.5rem;
  }
`

const ReadmeLink = styled(Link)`
  color: #0969da;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

const ReadmeExternalLink = styled.a`
  color: #0969da;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

const ReadmeBlockquote = styled.blockquote`
  border-left: 4px solid #d1d5db;
  padding: 0 1.5rem;
  margin: 1.5rem 0;
  color: #57606a;
`

const ReadmeCode = styled.code`
  background: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #24292f;
`

const CodeBlockWrapper = styled.div`
  position: relative;
  margin: 1.5rem 0;
`

const ReadmeCodeBlock = styled.pre`
  background: #f6f8fa;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 1rem;
  padding-top: 2.5rem;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;

  code {
    background: none;
    padding: 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #24292f;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.$copied ? '#22c55e' : '#0969da'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => props.$copied ? '#16a34a' : '#0860ca'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`

const ReadmeTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  font-size: 0.95rem;

  th, td {
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f6f8fa;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background: #fafbfc;
  }
`

const Highlight = styled.mark`
  background: #fff3cd;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
`

// Helper function to detect if link is internal
const isInternalLink = (href) => {
  if (!href) return false
  return href.startsWith('/') || href.startsWith('#')
}

// Helper to extract frontmatter and content
const parseFrontmatter = (markdown) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (match) {
    const frontmatter = {}
    const frontmatterLines = match[1].split('\n')
    frontmatterLines.forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim()
      }
    })
    return {
      frontmatter,
      content: match[2]
    }
  }

  return {
    frontmatter: {},
    content: markdown
  }
}

// Parse Obsidian callouts from blockquotes
const parseObsidianCallouts = (content) => {
  // Pattern: > [!type] Title
  const calloutRegex = /^> \[!(\w+)\]([^\n]*)\n((?:> [^\n]*\n?)*)/gm

  return content.replace(calloutRegex, (match, type, title, body) => {
    // Clean up the body (remove > prefixes)
    const cleanBody = body.replace(/^> /gm, '').trim()

    // Create a special marker that we'll recognize in the component
    return `<obsidian-callout type="${type}" title="${title.trim()}">\n${cleanBody}\n</obsidian-callout>`
  })
}

// Parse highlights ==text==
const parseHighlights = (content) => {
  return content.replace(/==([^=]+)==/g, '<mark>$1</mark>')
}

// Code block component with copy button
const CodeBlock = ({ children, className, node, onDoubleClick }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const code = String(children).trim()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <CodeBlockWrapper
      data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
      onDoubleClick={onDoubleClick}
    >
      <CopyButton onClick={handleCopy} $copied={copied}>
        {copied ? '✓ Copied!' : '📋 Copy'}
      </CopyButton>
      <ReadmeCodeBlock>
        <code className={className}>
          {children}
        </code>
      </ReadmeCodeBlock>
    </CodeBlockWrapper>
  )
}

// Custom renderer for TOC
const TableOfContentsRenderer = ({ children }) => {
  const extractTocItems = (nodes) => {
    const items = []
    React.Children.forEach(nodes, (child) => {
      if (child?.props?.children) {
        React.Children.forEach(child.props.children, (item) => {
          if (item?.props?.children) {
            items.push(item.props.children)
          }
        })
      }
    })
    return items
  }

  const tocItems = extractTocItems(children)

  return (
    <TableOfContents>
      <TocTitle>Table of Contents</TocTitle>
      <TocList>
        {tocItems.map((item, index) => {
          const isNested = Array.isArray(item) && item[0]?.props?.children
          const level = isNested ? 2 : 1

          return (
            <TocItem key={index} $level={level}>
              {item}
            </TocItem>
          )
        })}
      </TocList>
    </TableOfContents>
  )
}

const MarkdownRenderer = ({ content, onParagraphDoubleClick, editMode = false }) => {
  const { frontmatter, content: mainContent } = useMemo(() => {
    const parsed = parseFrontmatter(content || '')
    // Apply Obsidian-specific transformations
    let processedContent = parsed.content
    processedContent = parseObsidianCallouts(processedContent)
    processedContent = parseHighlights(processedContent)
    return { frontmatter: parsed.frontmatter, content: processedContent }
  }, [content])

  // Custom components for markdown elements
  const components = {
    h1: ({ children, node, ...props }) => (
      <ReadmeHeading
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeHeading>
    ),
    h2: ({ children, node, ...props }) => (
      <ReadmeHeading
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeHeading>
    ),
    h3: ({ children, node, ...props }) => (
      <ReadmeSubheading
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeSubheading>
    ),
    p: ({ children, node, ...props }) => (
      <ReadmeParagraph
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeParagraph>
    ),
    ul: ({ children, node, ...props }) => {
      if (props.className?.includes('toc')) {
        return <TableOfContentsRenderer>{children}</TableOfContentsRenderer>
      }
      return (
        <ReadmeList
          {...props}
          data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
          onDoubleClick={(e) => {
            if (onParagraphDoubleClick && node) {
              onParagraphDoubleClick(e, node)
            }
          }}
        >
          {children}
        </ReadmeList>
      )
    },
    ol: ({ children, node, ...props }) => (
      <ReadmeList
        as="ol"
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeList>
    ),
    blockquote: ({ children, node, ...props }) => (
      <ReadmeBlockquote
        {...props}
        data-paragraph-id={node?.position ? `para-${node.position.start.line}` : undefined}
        onDoubleClick={(e) => {
          if (onParagraphDoubleClick && node) {
            onParagraphDoubleClick(e, node)
          }
        }}
      >
        {children}
      </ReadmeBlockquote>
    ),
    a: ({ href, children, ...props }) => {
      if (isInternalLink(href)) {
        return <ReadmeLink to={href} {...props}>{children}</ReadmeLink>
      }
      return (
        <ReadmeExternalLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </ReadmeExternalLink>
      )
    },
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      // Handle Mermaid diagrams
      if (language === 'mermaid' && !inline) {
        return <MermaidDiagram chart={String(children).trim()} />
      }

      // Regular code blocks with copy button
      if (!inline) {
        return (
          <CodeBlock
            className={className}
            node={node}
            onDoubleClick={(e) => {
              if (onParagraphDoubleClick && node) {
                onParagraphDoubleClick(e, node)
              }
            }}
          >
            {children}
          </CodeBlock>
        )
      }

      // Inline code
      return <ReadmeCode {...props}>{children}</ReadmeCode>
    },
    table: ({ children, ...props }) => <ReadmeTable {...props}>{children}</ReadmeTable>,
    mark: ({ children }) => <Highlight>{children}</Highlight>,
    section: ({ children, ...props }) => <ReadmeSection {...props}>{children}</ReadmeSection>,
    // Handle custom Obsidian callout elements
    'obsidian-callout': ({ type, title, children }) => (
      <ObsidianCallout type={type} title={title}>
        {children}
      </ObsidianCallout>
    ),
  }

  return (
    <ReadmeDocument>
      {frontmatter.title && (
        <ReadmeHeader>
          <ReadmeMainTitle>{frontmatter.title}</ReadmeMainTitle>
          {frontmatter.subtitle && (
            <ReadmeSubtitle>{frontmatter.subtitle}</ReadmeSubtitle>
          )}
        </ReadmeHeader>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {mainContent}
      </ReactMarkdown>
    </ReadmeDocument>
  )
}

export default MarkdownRenderer
