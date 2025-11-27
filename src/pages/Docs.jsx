import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import FileTreeNav from '../components/hub/FileTreeNav'
import CommandPalette from '../components/hub/CommandPalette'
import MarkdownRenderer from '../components/MarkdownRenderer'
import DocsPreview from '../components/hub/DocsPreview'
import UploadDocModal from '../components/docs/UploadDocModal'
import docsService from '../services/docs-service'

// Styled Components
const DocsContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: white;
  margin: 0;
  padding: 0;
`

const LeftSidebar = styled.div`
  width: ${props => props.$visible ? '300px' : '0px'};
  min-width: ${props => props.$visible ? '300px' : '0px'};
  border-right: none;
  background: #e8e8e8;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  position: relative;
  border-radius: 0 12px 12px 0;
`

const NavigationHeader = styled.div`
  height: 22px;
  background: linear-gradient(to bottom,
    rgba(220, 220, 220, 0.95),
    rgba(200, 200, 200, 0.95)
  );
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px 8px 0 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

const HeaderText = styled.span`
  position: absolute;
  left: 35px;
  font-size: 0.75rem;
  color: #FFA500;
  font-weight: 500;
  user-select: none;
`

const CompactToggleButton = styled.button`
  position: absolute;
  left: 10px;
  top: 3px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg,
    rgba(255, 165, 0, 0.8),
    rgba(255, 140, 0, 0.9)
  );
  border: 1px solid rgba(255, 165, 0, 0.6);
  border-radius: 50%;
  padding: 0;
  font-size: 10px;
  line-height: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg,
      rgba(255, 165, 0, 1),
      rgba(255, 140, 0, 1)
    );
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(255, 165, 0, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`

const RefreshButton = styled.button`
  position: absolute;
  right: 10px;
  top: 3px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg,
    rgba(255, 165, 0, 0.8),
    rgba(255, 140, 0, 0.9)
  );
  border: 1px solid rgba(255, 165, 0, 0.6);
  border-radius: 50%;
  padding: 0;
  font-size: 10px;
  line-height: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg,
      rgba(255, 165, 0, 1),
      rgba(255, 140, 0, 1)
    );
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 2px 4px rgba(255, 165, 0, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.95) rotate(90deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const FileTreeScrollableArea = styled.div`
  flex: 0 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 50%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`

const PreviewPanelContainer = styled.div`
  flex: 1;
  min-height: 150px;
  background: transparent;
  padding: 0 12px 12px 12px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 3rem;
  background: white;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #2C2C2C;
  margin-bottom: 2rem;
  font-weight: 700;
  border-bottom: 3px solid #FFA500;
  padding-bottom: 1rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
`

const ErrorMessage = styled.div`
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  padding: 1.5rem;
  color: #c00;
  margin: 2rem 0;
`

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const EntryCard = styled.div`
  background: white;
  border: 2px solid ${props => props.$active ? '#FFA500' : '#ddd'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(255, 165, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  &:hover {
    border-color: #FFA500;
    box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
    transform: translateY(-2px);
  }
`

const EntryTitle = styled.h3`
  font-size: 1.3rem;
  color: #2C2C2C;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`

const EntryDescription = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`

const ContentSection = styled.div`
  display: ${props => props.$visible ? 'block' : 'none'};
  animation: ${props => props.$visible ? 'fadeIn 0.3s ease-in-out' : 'none'};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`


const FrontmatterContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin: 16px 0;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
    margin: 12px 0;
  }
`

const FrontmatterTitle = styled.h2`
  font-size: 1.5rem;
  color: #2C2C2C;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #FFA500;
  font-weight: 600;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }
`

const FrontmatterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  table-layout: fixed;
`

const FrontmatterRow = styled.tr`
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 165, 0, 0.05);
  }
`

const PropertyCell = styled.td`
  padding: 12px 16px;
  font-weight: 600;
  color: #555;
  vertical-align: top;
  width: 25%;
  min-width: 120px;
  max-width: 200px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  background: rgba(248, 248, 248, 0.5);
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 768px) {
    width: 30%;
    font-size: 0.85rem;
    padding: 10px 12px;
  }
`

const ValueCell = styled.td`
  padding: 12px 16px;
  color: #2C2C2C;
  vertical-align: top;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 12px;
  }

  code {
    background: #f6f8fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.85rem;
    color: #24292f;
    word-break: break-all;
    display: inline-block;
    max-width: 100%;
  }

  pre {
    background: #f6f8fa;
    padding: 8px 12px;
    border-radius: 4px;
    border-left: 3px solid #FFA500;
    margin: 4px 0;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    color: #24292f;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 100%;
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #24292f;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #FFA500;
    border-color: #FFA500;
    color: white;
  }

  &:active {
    transform: scale(0.95);
  }
`

// Post-it tab navigation components - horizontal at top
const PostItTabContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  margin-bottom: 0;
`

const PostItTab = styled.button`
  padding: 4px 10px;
  background: #e8e8e8;
  border: 1px solid #d0d0d0;
  border-bottom: ${props => props.$active ? '1px solid #f0f0f0' : '1px solid #d0d0d0'};
  border-radius: 4px 4px 0 0;
  font-size: 0.65rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#002FA7' : '#666'};
  cursor: pointer;
  margin-bottom: -1px;
  position: relative;
  z-index: 2;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  text-align: center;
  transition: all 0.15s ease;

  &:hover {
    color: #002FA7;
  }

  &:active {
    transform: scale(0.98);
  }
`

const FileListDropdown = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
  padding: 8px 10px;
  background: #f0f0f0;
  border: 1px solid #d0d0d0;
  border-radius: 0 0 4px 4px;
  position: relative;
  z-index: 1;
`

const FileButton = styled.button`
  padding: 3px 8px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: ${props => props.$active ? '#333' : '#666'};
  font-size: 0.65rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #333;
  }

  &:active {
    transform: scale(0.98);
  }
`

const ContentWithTabs = styled.div`
  /* No special positioning needed for horizontal tabs */
`

// Empty state styled components for main content
const MainEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
`

const MainEmptyIcon = styled.span`
  font-size: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
`

const MainEmptyText = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  text-align: center;
`

const MainSelectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: #f8f8f8;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 0.9rem;
  color: #2C2C2C;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    border-color: #FFA500;
    box-shadow: 0 2px 8px rgba(255, 165, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`

const MainSelectShortcut = styled.span`
  font-size: 0.75rem;
  color: #888;
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`

// Edit mode styled components
const DocumentHeader = styled.div`
  position: sticky;
  top: 1rem;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  margin-bottom: -2.5rem; /* Negative margin to overlap with content below */

  & > * {
    pointer-events: auto;
  }
`

// Wrapper for content display area (for edit button positioning)
const ContentDisplayWrapper = styled.div`
  position: relative;
`

const EditButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.$active ? '#FFA500' : 'white'};
  border: 1px solid ${props => props.$active ? '#FFA500' : '#d0d7de'};
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.$active ? 'white' : '#24292f'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${props => props.$active ? '#e69500' : '#f6f8fa'};
    border-color: ${props => props.$active ? '#e69500' : '#FFA500'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 70vh;
  padding: 0;
  margin: 0;
  font-family: 'IBM Plex Mono', 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
  line-height: 1.7;
  border: none;
  background: white;
  color: #24292f;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: #999;
  }
`

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SaveButton = styled(ActionButton)`
  background: #FFA500;
  border: 1px solid #FFA500;
  color: white;

  &:hover:not(:disabled) {
    background: #e69500;
    border-color: #e69500;
  }
`

const CancelButton = styled(ActionButton)`
  background: white;
  border: 1px solid #d0d7de;
  color: #24292f;

  &:hover:not(:disabled) {
    background: #f6f8fa;
    border-color: #999;
  }
`

const UnsavedIndicator = styled.span`
  font-size: 0.75rem;
  color: #d97706;
  font-style: italic;
`

// Toggle button when navigation is hidden (fixed to left edge)
const ToggleButtonHidden = styled.button`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 165, 0, 0.95);
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 12px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 2px;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #FFA500;
    padding-right: 12px;
    box-shadow: 2px 0 12px rgba(255, 165, 0, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`

// Helper function to parse workflow/skill/tool directory names
const parseEntryName = (dirName) => {
  // For workflows: workflow_20251115_008_deploy_gitthub_workflow_skill_to_claude_ai
  if (dirName.startsWith('workflow_')) {
    const parts = dirName.split('_')
    if (parts.length >= 4) {
      // Extract everything after the sequence number
      const titleParts = parts.slice(3)
      return titleParts.join(' ').replace(/-/g, ' ')
    }
  }

  // For skills and tools: just use the directory name
  return dirName.replace(/-/g, ' ').replace(/_/g, ' ')
}

// Helper function to parse YAML frontmatter
const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { metadata: {}, content, rawFrontmatter: '' }
  }

  try {
    const frontmatterText = match[1]
    const remainingContent = content.substring(match[0].length)

    const metadata = {}
    let currentArrayKey = null
    let currentArray = []

    frontmatterText.split('\n').forEach(line => {
      // Check if this is an array item (starts with spaces and dash)
      const arrayItemMatch = line.match(/^\s+-\s+(.+)$/)
      if (arrayItemMatch && currentArrayKey) {
        // This is an array item, add to current array
        currentArray.push(arrayItemMatch[1].trim())
        return
      }

      // If we were collecting an array and hit a non-array line, save it
      if (currentArrayKey && currentArray.length > 0) {
        metadata[currentArrayKey] = currentArray
        currentArrayKey = null
        currentArray = []
      }

      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')

        // Check if this starts an array (empty value after colon)
        if (value === '' || value === '|') {
          currentArrayKey = key
          currentArray = []
        } else {
          metadata[key] = value
        }
      }
    })

    // Don't forget to save the last array if we were collecting one
    if (currentArrayKey && currentArray.length > 0) {
      metadata[currentArrayKey] = currentArray
    }

    return { metadata, content: remainingContent, rawFrontmatter: frontmatterText }
  } catch (error) {
    console.error('Error parsing frontmatter:', error)
    console.error('Problematic content:', match[1])
    // Return safe fallback to prevent page crash
    return {
      metadata: {
        title: 'Parse Error',
        description: 'Failed to parse workflow metadata'
      },
      content: content.substring(match[0].length),
      rawFrontmatter: match[1]
    }
  }
}

function Docs() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Load saved state from localStorage
  const getSavedState = () => {
    try {
      const saved = localStorage.getItem('docsPageState')
      if (!saved) return null

      const state = JSON.parse(saved)

      // Migration: Handle users with old "tools" section in localStorage
      if (state.selectedSection === 'tools') {
        state.selectedSection = 'mcp' // Default to mcp section
        state.activeTab = null // Clear active tab
      }

      // Remove any toolEntries from saved state
      if (state.toolEntries) {
        delete state.toolEntries
      }

      return state
    } catch (e) {
      console.error('Error loading saved docs state:', e)
      return null
    }
  }
  const savedState = getSavedState()

  // Get initial state from URL, localStorage, or defaults
  const initialSection = searchParams.get('section') || savedState?.selectedSection || 'workflows'
  const initialTab = searchParams.get('tab') || savedState?.activeTab || null

  // Navigation visibility state with localStorage persistence
  const [isNavVisible, setIsNavVisible] = useState(() => {
    const saved = localStorage.getItem('docsNavVisible')
    return saved !== null ? JSON.parse(saved) : true
  })

  // State management
  const [selectedSection, setSelectedSection] = useState(initialSection)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [readmeExpanded, setReadmeExpanded] = useState(initialSection === 'readme')

  // Markdown content for README subitems
  const [readmeMain, setReadmeMain] = useState('')
  const [workflowsOverview, setWorkflowsOverview] = useState('')
  const [skillsOverview, setSkillsOverview] = useState('')
  const [mcpOverview, setMcpOverview] = useState('')
  const [subagentsOverview, setSubagentsOverview] = useState('')

  // Available entries (all from manifest files)
  const [availableWorkflows, setAvailableWorkflows] = useState([])
  const [availableSkills, setAvailableSkills] = useState([])
  const [availableMcp, setAvailableMcp] = useState([])
  const [availableSubagents, setAvailableSubagents] = useState([])

  // Selected catalog entries (user's chosen subset to display) - restore from localStorage
  const [workflowEntries, setWorkflowEntries] = useState(savedState?.workflowEntries || [])
  const [skillEntries, setSkillEntries] = useState(savedState?.skillEntries || [])
  const [mcpEntries, setMcpEntries] = useState(savedState?.mcpEntries || [])
  const [subagentEntries, setSubagentEntries] = useState(savedState?.subagentEntries || [])

  // Selected entry content
  const [selectedEntryContent, setSelectedEntryContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Preview panel data
  const [previewData, setPreviewData] = useState(null)

  // View mode for catalog entries (markdown or frontmatter)
  const [viewMode, setViewMode] = useState('markdown')
  const [rawFrontmatter, setRawFrontmatter] = useState('')

  // Per-item view state tracking (persists when switching between items)
  const [viewModeByItem, setViewModeByItem] = useState({})
  const [mainViewModeBySkill, setMainViewModeBySkill] = useState({})

  // Subdirectory navigation for skills - restore from localStorage
  const [selectedSubdir, setSelectedSubdir] = useState(savedState?.selectedSubdir || null)
  const [selectedFile, setSelectedFile] = useState(savedState?.selectedFile || null)
  const [subdirContent, setSubdirContent] = useState('')
  const [mainViewMode, setMainViewMode] = useState(savedState?.mainViewMode || 'skill.md') // 'skill.md' or 'yaml'

  // Track last active subtab per skill for persistence
  const [lastSubdirBySkill, setLastSubdirBySkill] = useState({})

  // Track last active tab per section for persistence when switching sections
  const [lastActiveTabBySection, setLastActiveTabBySection] = useState({})

  // Command palette state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Track last selected file per subdirectory for persistence
  const [lastFileBySubdir, setLastFileBySubdir] = useState({})

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [originalContent, setOriginalContent] = useState('') // Store original for comparison
  const [editingFilePath, setEditingFilePath] = useState(null) // Track which file is being edited

  // Refs for scroll sync between rendered view and edit textarea
  const mainContentRef = useRef(null)
  const textareaRef = useRef(null)
  const [scrollPercentage, setScrollPercentage] = useState(0)

  // Save state to localStorage when key selections change
  useEffect(() => {
    const stateToSave = {
      selectedSection,
      activeTab,
      workflowEntries,
      skillEntries,
      mcpEntries,
      subagentEntries,
      selectedSubdir,
      selectedFile,
      mainViewMode
    }
    try {
      localStorage.setItem('docsPageState', JSON.stringify(stateToSave))
    } catch (e) {
      console.error('Error saving docs state:', e)
    }
  }, [selectedSection, activeTab, workflowEntries, skillEntries, mcpEntries, subagentEntries, selectedSubdir, selectedFile, mainViewMode])

  // Flag to track if content needs to be loaded on mount (from restored state)
  const [needsContentLoad, setNeedsContentLoad] = useState(!!savedState?.activeTab)

  // Skill subdirectory structure (gitthub-workflow example)
  const skillSubdirStructure = {
    'gitthub-workflow': [
      {
        name: 'references',
        displayName: 'Guides',
        icon: '📚',
        files: [
          { name: 'deploy-guide.md', displayName: 'deploy-guide.md' },
          { name: 'educate-guide.md', displayName: 'educate-guide.md' },
          { name: 'navigate-guide.md', displayName: 'navigate-guide.md' },
          { name: 'reference-handling.md', displayName: 'reference-handling.md' },
          { name: 'skill-recommendations.md', displayName: 'skill-recommendations.md' }
        ]
      },
      {
        name: 'references/examples',
        displayName: 'Examples',
        icon: '💡',
        files: [
          { name: 'example-deploy.md', displayName: 'example-deploy.md' },
          { name: 'example-educate.md', displayName: 'example-educate.md' },
          { name: 'example-navigate.md', displayName: 'example-navigate.md' }
        ]
      },
      {
        name: 'references/format-standards',
        displayName: 'Standards',
        icon: '📐',
        files: [
          { name: 'workflow-format-spec.md', displayName: 'workflow-format-spec.md' },
          { name: 'file-naming-conventions.md', displayName: 'file-naming-conventions.md' },
          { name: 'quality-guidelines.md', displayName: 'quality-guidelines.md' }
        ]
      },
      {
        name: 'references/process-patterns',
        displayName: 'Patterns',
        icon: '🔄',
        files: [
          { name: 'best-practices.md', displayName: 'best-practices.md' },
          { name: 'common-patterns.md', displayName: 'common-patterns.md' },
          { name: 'workflow-generation-process.md', displayName: 'workflow-generation-process.md' }
        ]
      },
      {
        name: 'references/system-prompts',
        displayName: 'Prompts',
        icon: '🤖',
        files: [
          { name: 'deploy-guide.md', displayName: 'deploy-guide.md' },
          { name: 'educate-guide.md', displayName: 'educate-guide.md' },
          { name: 'navigate-guide.md', displayName: 'navigate-guide.md' }
        ]
      }
    ]
  }

  // MCP subdirectory structure (generic template for MCP servers)
  const mcpSubdirStructure = {
    // Template structure for any MCP entry
    default: [
      {
        name: 'references',
        displayName: 'Guides',
        icon: '📚',
        files: []
      },
      {
        name: 'references/examples',
        displayName: 'Examples',
        icon: '💡',
        files: []
      },
      {
        name: 'references/format-standards',
        displayName: 'Standards',
        icon: '📐',
        files: []
      },
      {
        name: 'references/process-patterns',
        displayName: 'Patterns',
        icon: '🔄',
        files: []
      },
      {
        name: 'references/prompts',
        displayName: 'Prompts',
        icon: '🤖',
        files: []
      }
    ]
  }

  // Subagent subdirectory structure (generic template for subagents)
  const subagentSubdirStructure = {
    // Template structure for any subagent entry
    default: [
      {
        name: 'references',
        displayName: 'Guides',
        icon: '📚',
        files: []
      },
      {
        name: 'references/examples',
        displayName: 'Examples',
        icon: '💡',
        files: []
      },
      {
        name: 'references/format-standards',
        displayName: 'Standards',
        icon: '📐',
        files: []
      },
      {
        name: 'references/process-patterns',
        displayName: 'Patterns',
        icon: '🔄',
        files: []
      },
      {
        name: 'references/prompts',
        displayName: 'Prompts',
        icon: '🤖',
        files: []
      }
    ]
  }

  // Keyboard shortcut handler for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      // Check for ⌘K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen(true)
      }

      // Toggle navigation pane with ^ key
      if (e.key === '^' || (e.shiftKey && e.key === '6')) {
        e.preventDefault()
        setIsNavVisible(prev => {
          const newValue = !prev
          localStorage.setItem('docsNavVisible', JSON.stringify(newValue))
          return newValue
        })
      }

      // Tab to cycle through sections (Workflows → Skills → MCP → Subagents → Workflows)
      if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        const sections = ['workflows', 'skills', 'mcp', 'subagents']
        const currentIndex = sections.indexOf(selectedSection)
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + sections.length) % sections.length  // Shift+Tab goes backward
          : (currentIndex + 1) % sections.length  // Tab goes forward
        handleSectionChange(sections[nextIndex], null)
      }

      // Also support ⌘1/2/3/4 for quick section switching
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '1') {
          e.preventDefault()
          handleSectionChange('workflows', null)
        } else if (e.key === '2') {
          e.preventDefault()
          handleSectionChange('skills', null)
        } else if (e.key === '3') {
          e.preventDefault()
          handleSectionChange('mcp', null)
        } else if (e.key === '4') {
          e.preventDefault()
          handleSectionChange('subagents', null)
        }
      }

      // Arrow keys to switch between content tabs
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // For skills with subdirectories
        if (selectedSection === 'skills' && activeTab) {
          const currentSkillId = activeTab
          const subdirs = skillSubdirStructure[currentSkillId]

          if (subdirs && subdirs.length > 0) {
            e.preventDefault()

            // Tabs: Main, then each subdir
            const tabs = ['main', ...subdirs.map(s => s.name)]
            const currentTab = selectedSubdir || 'main'
            const currentIndex = tabs.indexOf(currentTab)

            console.log('=== Arrow Navigation Debug ===')
            console.log('Key:', e.key)
            console.log('Tabs:', tabs)
            console.log('Current tab:', currentTab)
            console.log('Current index:', currentIndex)

            // Helper to update subtab and save to lastSubdirBySkill
            const setSubtab = (tabName) => {
              console.log('Setting subtab to:', tabName)
              if (tabName === 'main') {
                setSelectedSubdir(null)
                setSelectedFile(null)
              } else {
                setSelectedSubdir(tabName)
                setSelectedFile(null)
                // Save last active subtab for this skill
                setLastSubdirBySkill(prev => ({
                  ...prev,
                  [currentSkillId]: tabName
                }))
              }
            }

            if (e.key === 'ArrowDown') {
              // Down: Enter subtabs from main, or go to next subtab
              if (currentTab === 'main') {
                // Enter first subtab (or restore last used)
                const lastSubdir = lastSubdirBySkill[currentSkillId]
                if (lastSubdir && tabs.includes(lastSubdir)) {
                  setSubtab(lastSubdir)
                } else {
                  setSubtab(tabs[1]) // First subtab after 'main'
                }
              } else {
                // Go to next subtab (cycle back to first subtab, skip main)
                const nextIndex = currentIndex + 1
                if (nextIndex >= tabs.length) {
                  // Wrap to first subtab (index 1), not main
                  setSubtab(tabs[1])
                } else {
                  setSubtab(tabs[nextIndex])
                }
              }
              console.log('Down arrow - new index:', currentIndex + 1)
            } else if (e.key === 'ArrowUp') {
              // Up: Go to previous subtab, or return to main from first subtab
              if (currentTab === 'main') {
                // Already at main, do nothing
              } else if (currentIndex === 1) {
                // At first subtab, return to main
                setSubtab('main')
              } else {
                // Go to previous subtab
                setSubtab(tabs[currentIndex - 1])
              }
              console.log('Up arrow - new index:', currentIndex - 1)
            } else if (e.key === 'ArrowRight') {
              // Right: Cycle forward through all tabs including main
              const nextIndex = (currentIndex + 1) % tabs.length
              setSubtab(tabs[nextIndex])
              console.log('Right arrow - next index:', nextIndex)
            } else if (e.key === 'ArrowLeft') {
              // Left: Cycle backward through all tabs including main
              const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
              setSubtab(tabs[prevIndex])
              console.log('Left arrow - prev index:', prevIndex)
            }
          } else {
            // No subdirs, toggle between skill.md and yaml with left/right
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault()
              handleMainViewModeChange(mainViewMode === 'skill.md' ? 'yaml' : 'skill.md')
            }
          }
        } else if ((selectedSection === 'workflows' || selectedSection === 'tools') && selectedEntryContent) {
          // For workflows and tools: toggle between markdown and frontmatter
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault()
            handleViewModeChange(viewMode === 'markdown' ? 'frontmatter' : 'markdown')
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedSection, selectedEntryContent, activeTab, viewMode, mainViewMode, selectedSubdir, lastSubdirBySkill])

  // Get current section items for Command Palette
  const getCurrentSectionItems = useCallback(() => {
    // Upload action item (appears at top of all lists)
    const uploadAction = {
      id: '__upload__',
      name: 'Upload New...',
      description: `Upload a new ${selectedSection.slice(0, -1)} from a .md file`,
      type: 'action',
      isAction: true
    }

    switch (selectedSection) {
      case 'workflows':
        return [uploadAction, ...availableWorkflows.map(w => ({
          ...w,
          type: w.type || 'workflow'
        }))]
      case 'skills':
        return [uploadAction, ...availableSkills.map(s => ({
          ...s,
          type: s.difficulty || 'skill'
        }))]
      case 'mcp':
        return [uploadAction, ...availableMcp.map(m => ({
          ...m,
          type: m.category || 'mcp'
        }))]
      case 'subagents':
        return [uploadAction, ...availableSubagents.map(sa => ({
          ...sa,
          type: sa.category || 'subagent'
        }))]
      default:
        return []
    }
  }, [selectedSection, availableWorkflows, availableSkills, availableMcp, availableSubagents])

  // Load README overview markdown files on mount
  useEffect(() => {
    const loadOverviewFiles = async () => {
      try {
        const [readmeRes, workflowsRes, skillsRes, mcpRes, subagentsRes] = await Promise.all([
          fetch('/content/docs/welcome.md').then(r => r.text()),
          fetch('/content/docs/workflows.md').then(r => r.text()),
          fetch('/content/docs/skills.md').then(r => r.text()),
          fetch('/content/docs/mcp.md').then(r => r.text()),
          fetch('/content/docs/subagents.md').then(r => r.text())
        ])

        setReadmeMain(readmeRes)
        setWorkflowsOverview(workflowsRes)
        setSkillsOverview(skillsRes)
        setMcpOverview(mcpRes)
        setSubagentsOverview(subagentsRes)
      } catch (err) {
        console.error('Error loading overview files:', err)
        setError('Failed to load overview documentation')
      }
    }

    loadOverviewFiles()
  }, [])

  // Load manifest files on mount to get available entries
  useEffect(() => {
    const loadManifests = async () => {
      try {
        const [workflowsData, skillsData, mcpData, subagentsData] = await Promise.all([
          docsService.listSection('workflows'),
          docsService.listSection('skills'),
          docsService.listSection('mcp'),
          docsService.listSection('subagents')
        ])

        setAvailableWorkflows(workflowsData.items || [])
        setAvailableSkills(skillsData.items || [])
        setAvailableMcp(mcpData.items || [])
        setAvailableSubagents(subagentsData.items || [])
      } catch (err) {
        console.error('Error loading manifest files:', err)
        // Not critical - fallback to empty lists
      }
    }

    loadManifests()
  }, [])

  // Note: Catalog entries are no longer auto-loaded on section change.
  // Users now select specific entries via the search panel.

  // Load selected entry content
  useEffect(() => {
    const loadEntryContent = async () => {
      if (selectedSection === 'readme') return
      if (!activeTab) return

      setLoading(true)
      setError(null)

      try {
        // Use docsService to fetch document content
        const docData = await docsService.getDoc(selectedSection, activeTab)
        console.log('Fetched doc data:', docData)

        // Extract content and frontmatter from response
        const content = docData.content || ''
        const metadata = docData.frontmatter || {}
        const rawFrontmatterText = docData.raw
          ? docData.raw.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || ''
          : ''

        console.log('Parsed content length:', content.length)
        console.log('Metadata:', metadata)

        // Set content for main display (without frontmatter)
        setSelectedEntryContent(content)
        setRawFrontmatter(rawFrontmatterText)

        // Restore view state for this item (or default to 'markdown')
        if (selectedSection === 'workflows' || selectedSection === 'tools') {
          const savedMode = viewModeByItem[activeTab]
          setViewMode(savedMode || 'markdown')
        } else if (selectedSection === 'skills') {
          const savedMainMode = mainViewModeBySkill[activeTab]
          setMainViewMode(savedMainMode || 'skill.md')
        }

        // Only reset subdirectory navigation if this is a fresh load (not restored)
        if (!needsContentLoad) {
          setSelectedSubdir(null)
          setSelectedFile(null)
          setSubdirContent('')
        } else {
          // Mark that we've handled the restored state
          setNeedsContentLoad(false)
        }

        // Set preview data with type detection
        const previewType = detectContentType(selectedSection, metadata)
        setPreviewData({
          type: previewType,
          metadata: metadata,
          rawContent: content.substring(0, 500),  // First 500 chars for README
          section: activeTab
        })

        console.log('Loaded entry:', activeTab, 'Type:', previewType)
      } catch (err) {
        console.error('Error loading entry content:', err)
        setError(`Failed to load content for ${activeTab}`)
      } finally {
        setLoading(false)
      }
    }

    loadEntryContent()
  }, [selectedSection, activeTab])

  // Auto-load file when selectedSubdir changes (for arrow key navigation)
  useEffect(() => {
    console.log('=== Auto-load useEffect triggered ===')
    console.log('selectedSubdir:', selectedSubdir)
    console.log('selectedSection:', selectedSection)
    console.log('activeTab:', activeTab)

    const loadSubdirFileAuto = async (subdirName, fileName) => {
      console.log('loadSubdirFileAuto called:', subdirName, fileName)
      try {
        const filePath = `${subdirName}/${fileName}`
        console.log('Fetching via docsService:', filePath)
        const fileData = await docsService.getDocFile('skills', activeTab, filePath)
        const content = fileData.content || ''
        console.log('Content loaded, length:', content.length)
        setSubdirContent(content)
        setSelectedFile(`${subdirName}/${fileName}`)
        // Save last selected file for this subdirectory
        setLastFileBySubdir(prev => ({
          ...prev,
          [`${activeTab}/${subdirName}`]: fileName
        }))
      } catch (err) {
        console.error('Error loading subdirectory file:', err)
        setSubdirContent(`# Error\n\nFailed to load file: ${fileName}`)
      }
    }

    // Only process for skills with subdirectories
    if (selectedSection === 'skills' && activeTab) {
      const subdirs = skillSubdirStructure[activeTab]
      console.log('Subdirs for', activeTab, ':', subdirs ? subdirs.length : 'none')

      if (subdirs && subdirs.length > 0) {
        if (selectedSubdir) {
          // Find the subdirectory configuration
          const subdir = subdirs.find(s => s.name === selectedSubdir)
          console.log('Found subdir config:', subdir ? subdir.name : 'not found')

          if (subdir && subdir.files && subdir.files.length > 0) {
            // Check if there's a last used file for this subdirectory
            const lastFile = lastFileBySubdir[`${activeTab}/${selectedSubdir}`]
            const fileToLoad = lastFile || subdir.files[0].name

            // Load the file
            console.log('Auto-loading file:', selectedSubdir, fileToLoad)
            loadSubdirFileAuto(selectedSubdir, fileToLoad)
          } else {
            console.log('No files in subdir or subdir not found')
          }
        } else {
          // Returned to main - clear subdirectory content
          console.log('Clearing subdirectory content (back to main)')
          setSelectedFile(null)
          setSubdirContent('')
        }
      } else {
        console.log('No subdirs defined for this skill')
      }
    } else {
      console.log('Not a skill or no activeTab')
    }
  }, [selectedSubdir, selectedSection, activeTab])

  // Helper function to detect content type from metadata
  const detectContentType = (section, metadata) => {
    if (section === 'readme') return 'readme'

    // Workflow detection
    if (metadata.workflow_id || metadata.type === 'deploy' ||
        metadata.type === 'educate' || metadata.type === 'navigate' ||
        metadata.total_steps || metadata.steps) {
      return 'workflow'
    }

    // Skill detection
    if (metadata.skill_id || metadata.skill_type || metadata.skill_name) {
      return 'skill'
    }

    // Tool detection
    if (metadata.tool_id || metadata.category || metadata.capabilities) {
      return 'tool'
    }

    return 'generic'
  }

  // Handler for viewMode changes (persists per item)
  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    if (activeTab) {
      setViewModeByItem(prev => ({ ...prev, [activeTab]: mode }))
    }
  }

  // Handler for mainViewMode changes (persists per skill)
  const handleMainViewModeChange = (mode) => {
    setMainViewMode(mode)
    if (activeTab) {
      setMainViewModeBySkill(prev => ({ ...prev, [activeTab]: mode }))
    }
  }

  // Handle navigation changes
  const handleSectionChange = (section, tab = null) => {
    console.log('handleSectionChange called:', section, tab)

    // Save current tab for current section before switching (if we have one)
    if (activeTab && selectedSection !== 'readme' && selectedSection !== section) {
      setLastActiveTabBySection(prev => ({
        ...prev,
        [selectedSection]: activeTab
      }))
    }

    setSelectedSection(section)

    // Set default tab based on section
    if (section === 'readme') {
      setActiveTab(tab || 'welcome')
      setReadmeExpanded(true)

      // Set preview for README section
      setPreviewData({
        type: 'readme',
        metadata: {},
        rawContent: getReadmePreviewText(tab || 'welcome'),
        section: tab || 'welcome'
      })
    } else {
      // For catalog sections, tab is the entry ID
      let effectiveTab = tab

      // If no tab specified and undefined (not explicitly null), try to restore the last active tab for this section
      // If explicitly null (back button clicked), don't restore
      if (tab === undefined) {
        effectiveTab = lastActiveTabBySection[section] || null
      }

      setActiveTab(effectiveTab)
      console.log('Setting activeTab to:', effectiveTab)

      // Only clear preview when there's no selection at all
      if (!effectiveTab) {
        setPreviewData(null)
        setSelectedEntryContent('')
      }
    }

    // Update URL params
    const params = { section }
    if (tab) {
      params.tab = tab
    }
    setSearchParams(params)
  }

  // Helper to get README preview text
  const getReadmePreviewText = (tab) => {
    switch (tab) {
      case 'welcome':
        return readmeMain
      case 'workflows':
        return workflowsOverview
      case 'skills':
        return skillsOverview
      case 'mcp':
        return mcpOverview
      case 'subagents':
        return subagentsOverview
      default:
        return ''
    }
  }

  const handleReadmeToggle = () => {
    setReadmeExpanded(!readmeExpanded)
  }

  // Toggle navigation visibility
  const handleToggleNav = () => {
    const newValue = !isNavVisible
    setIsNavVisible(newValue)
    localStorage.setItem('docsNavVisible', JSON.stringify(newValue))
  }

  // Handle selecting a specific entry from search panel
  const handleSelectEntry = (section, entryId) => {
    // Handle upload action
    if (entryId === '__upload__') {
      setIsPaletteOpen(false)
      setIsUploadModalOpen(true)
      return
    }

    // Find the entry from available entries
    let entry = null
    let availableList = []

    switch (section) {
      case 'workflows':
        availableList = availableWorkflows
        break
      case 'skills':
        availableList = availableSkills
        break
      case 'mcp':
        availableList = availableMcp
        break
      case 'subagents':
        availableList = availableSubagents
        break
      default:
        return
    }

    entry = availableList.find(e => e.id === entryId)
    if (!entry) return

    // Replace selected entry with new selection (only one at a time)
    switch (section) {
      case 'workflows':
        setWorkflowEntries([entry])
        break
      case 'skills':
        setSkillEntries([entry])
        // Restore last active subtab for this skill
        const lastSubdir = lastSubdirBySkill[entryId]
        if (lastSubdir) {
          setSelectedSubdir(lastSubdir)
        } else {
          setSelectedSubdir(null)
        }
        setSelectedFile(null)
        break
      case 'mcp':
        setMcpEntries([entry])
        // Reset subdirectory state for mcp (similar to skills)
        setSelectedSubdir(null)
        setSelectedFile(null)
        break
      case 'subagents':
        setSubagentEntries([entry])
        // Reset subdirectory state for subagents (similar to skills)
        setSelectedSubdir(null)
        setSelectedFile(null)
        break
    }

    // Select the entry to load its content
    handleSectionChange(section, entryId)
  }

  // Handle item selection from the searchable list (workflows, skills, or tools)
  const handleItemSelectFromList = (itemId) => {
    handleSelectEntry(selectedSection, itemId)
  }

  // Handle upload completion - refresh and select the new document
  const handleUploadComplete = async (section, docId) => {
    console.log('Upload complete:', section, docId)

    try {
      // Reload the manifest for the section
      const sectionData = await docsService.listSection(section)

      // Update the appropriate state
      switch (section) {
        case 'workflows':
          setAvailableWorkflows(sectionData.items || [])
          break
        case 'skills':
          setAvailableSkills(sectionData.items || [])
          break
        case 'mcp':
          setAvailableMcp(sectionData.items || [])
          break
        case 'subagents':
          setAvailableSubagents(sectionData.items || [])
          break
      }

      // Select the newly uploaded document
      handleSelectEntry(section, docId)
    } catch (err) {
      console.error('Error refreshing after upload:', err)
    }
  }

  // Refresh all documentation content
  const handleRefresh = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to sync via docsService (calls backend sync endpoint)
      try {
        const syncResult = await docsService.syncAll()
        console.log(`✓ Synced ${syncResult.files_processed} files across ${syncResult.sections_synced.length} sections`)
      } catch (syncErr) {
        console.warn('Backend sync not available:', syncErr.message)
      }

      // Reload overview files (static, not managed by docsService)
      const [readmeRes, workflowsRes, skillsRes, mcpRes, subagentsRes] = await Promise.all([
        fetch('/content/docs/welcome.md').then(r => r.text()),
        fetch('/content/docs/workflows.md').then(r => r.text()),
        fetch('/content/docs/skills.md').then(r => r.text()),
        fetch('/content/docs/mcp.md').then(r => r.text()),
        fetch('/content/docs/subagents.md').then(r => r.text())
      ])

      setReadmeMain(readmeRes)
      setWorkflowsOverview(workflowsRes)
      setSkillsOverview(skillsRes)
      setMcpOverview(mcpRes)
      setSubagentsOverview(subagentsRes)

      // Reload manifests via docsService (with static fallback built-in)
      const [workflowsData, skillsData, mcpData, subagentsData] = await Promise.all([
        docsService.listSection('workflows'),
        docsService.listSection('skills'),
        docsService.listSection('mcp'),
        docsService.listSection('subagents')
      ])

      setAvailableWorkflows(workflowsData.items || [])
      setAvailableSkills(skillsData.items || [])
      setAvailableMcp(mcpData.items || [])
      setAvailableSubagents(subagentsData.items || [])
      console.log(`✓ Loaded ${workflowsData.count} workflows, ${skillsData.count} skills, ${mcpData.count} mcp, ${subagentsData.count} subagents`)

      // Clear selected entry lists to start fresh
      setWorkflowEntries([])
      setSkillEntries([])
      setMcpEntries([])
      setSubagentEntries([])
      setSelectedEntryContent('')
      setPreviewData(null)
    } catch (err) {
      console.error('Error refreshing documentation:', err)
      setError('Failed to refresh documentation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Enter edit mode
  const handleEnterEditMode = () => {
    // Capture scroll position before entering edit mode
    if (mainContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current
      const maxScroll = scrollHeight - clientHeight
      const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0
      setScrollPercentage(percentage)
    }

    // Determine which content to edit based on current view
    if (selectedSection === 'skills' && selectedFile) {
      // Editing a subdirectory file
      setEditContent(subdirContent)
      setOriginalContent(subdirContent)
      setEditingFilePath(selectedFile) // e.g., "references/deploy-guide.md"
    } else {
      // Editing the main document (SKILL.md, WORKFLOW.md, TOOL.md)
      const fullContent = rawFrontmatter
        ? `---\n${rawFrontmatter}\n---\n\n${selectedEntryContent}`
        : selectedEntryContent
      setEditContent(fullContent)
      setOriginalContent(fullContent)
      setEditingFilePath(null) // null means main document
    }
    setIsEditMode(true)
  }

  // Cancel edit and discard changes
  const handleCancelEdit = () => {
    // Capture textarea scroll position before exiting edit mode
    if (textareaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = textareaRef.current
      const maxScroll = scrollHeight - clientHeight
      const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0
      // Reverse the compensation applied when entering edit mode
      setScrollPercentage(percentage / 1.15)
    }

    setIsEditMode(false)
    setEditContent('')
    setOriginalContent('')
    setEditingFilePath(null)
  }

  // Scroll sync: scroll textarea to match rendered view position when entering edit mode
  useEffect(() => {
    if (isEditMode && textareaRef.current && scrollPercentage > 0) {
      // Use requestAnimationFrame to ensure textarea has rendered
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const { scrollHeight, clientHeight } = textareaRef.current
          const maxScroll = scrollHeight - clientHeight
          // Apply offset compensation (rendered content has more visual overhead than raw text)
          const compensatedPercentage = Math.min(scrollPercentage * 1.15, 1)
          textareaRef.current.scrollTop = maxScroll * compensatedPercentage
        }
      })
    }
  }, [isEditMode, scrollPercentage])

  // Scroll sync: restore MainContent scroll position when leaving edit mode
  useEffect(() => {
    if (!isEditMode && mainContentRef.current && scrollPercentage > 0) {
      requestAnimationFrame(() => {
        if (mainContentRef.current) {
          const { scrollHeight, clientHeight } = mainContentRef.current
          const maxScroll = scrollHeight - clientHeight
          mainContentRef.current.scrollTop = maxScroll * scrollPercentage
        }
      })
    }
  }, [isEditMode])

  // Save document
  const handleSaveDocument = async () => {
    setIsSaving(true)
    try {
      // Parse the edited content to extract frontmatter and content
      const { metadata: parsedFrontmatter, content: parsedContent } = parseFrontmatter(editContent)

      // Use docsService to update the document
      await docsService.updateDoc(selectedSection, activeTab, {
        frontmatter: parsedFrontmatter,
        content: parsedContent
      })

      // Update state based on what was edited
      if (editingFilePath) {
        // Saved a subdirectory file
        setSubdirContent(editContent)
      } else {
        // Saved main document - parse frontmatter
        const { metadata, content, rawFrontmatter: newRawFrontmatter } = parseFrontmatter(editContent)
        setSelectedEntryContent(content)
        setRawFrontmatter(newRawFrontmatter)
      }

      setOriginalContent(editContent)

      // Capture textarea scroll position before exiting edit mode
      if (textareaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = textareaRef.current
        const maxScroll = scrollHeight - clientHeight
        const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0
        // Reverse the compensation applied when entering edit mode
        setScrollPercentage(percentage / 1.15)
      }

      // Exit edit mode
      setIsEditMode(false)
      setEditContent('')
      setEditingFilePath(null)

      console.log('Document saved successfully')
    } catch (err) {
      console.error('Error saving document:', err)
      alert('Failed to save document. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Check if content has been modified
  const hasUnsavedChanges = editContent !== originalContent

  // Render content based on current section and tab
  const renderContent = () => {
    if (loading) {
      return <LoadingMessage>Loading content...</LoadingMessage>
    }

    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>
    }

    // README section - show overview markdown
    if (selectedSection === 'readme') {
      return (
        <ContentWrapper>
          <ContentSection $visible={activeTab === 'welcome'}>
            {activeTab === 'welcome' && readmeMain && (
              <MarkdownRenderer content={readmeMain.replace(/## Getting started:?[\s\S]*?(?=\n## |$)/i, '')} />
            )}
          </ContentSection>

          <ContentSection $visible={activeTab === 'workflows'}>
            {activeTab === 'workflows' && workflowsOverview && (
              <MarkdownRenderer content={workflowsOverview} />
            )}
          </ContentSection>

          <ContentSection $visible={activeTab === 'skills'}>
            {activeTab === 'skills' && skillsOverview && (
              <MarkdownRenderer content={skillsOverview} />
            )}
          </ContentSection>

          <ContentSection $visible={activeTab === 'mcp'}>
            {activeTab === 'mcp' && mcpOverview && (
              <MarkdownRenderer content={mcpOverview} />
            )}
          </ContentSection>

          <ContentSection $visible={activeTab === 'subagents'}>
            {activeTab === 'subagents' && subagentsOverview && (
              <MarkdownRenderer content={subagentsOverview} />
            )}
          </ContentSection>
        </ContentWrapper>
      )
    }

    // Catalog sections - show entry content directly
    if (selectedEntryContent) {
      // Copy frontmatter to clipboard
      const handleCopyFrontmatter = () => {
        navigator.clipboard.writeText(rawFrontmatter)
          .then(() => {
            // Optional: Show success feedback
            console.log('Frontmatter copied to clipboard')
          })
          .catch(err => {
            console.error('Failed to copy frontmatter:', err)
          })
      }

      // Parse frontmatter into key-value pairs for table display
      const parseFrontmatterForTable = (yamlText) => {
        const entries = []
        const lines = yamlText.split('\n')
        let currentKey = null
        let currentValue = []
        let inMultiline = false

        lines.forEach((line, index) => {
          // Check if line starts a new property (has a colon not in quotes)
          const colonMatch = line.match(/^(\s*)([^:]+):\s*(.*)$/)

          if (colonMatch && !inMultiline) {
            // Save previous entry if exists
            if (currentKey !== null) {
              entries.push({
                key: currentKey,
                value: currentValue.join('\n').trim()
              })
            }

            // Start new entry
            currentKey = colonMatch[2].trim()
            const valueStart = colonMatch[3].trim()

            // Check if it's a multiline value (starts with | or >)
            if (valueStart === '|' || valueStart === '>') {
              inMultiline = true
              currentValue = []
            } else if (valueStart.startsWith('[')) {
              // Handle arrays
              currentValue = [valueStart]
            } else {
              currentValue = [valueStart]
            }
          } else if (inMultiline && line.trim() && !line.startsWith('  ')) {
            // End of multiline block
            inMultiline = false
            if (currentKey !== null) {
              entries.push({
                key: currentKey,
                value: currentValue.join('\n').trim()
              })
              currentKey = null
              currentValue = []
            }
          } else if (line.trim()) {
            // Continuation of current value
            currentValue.push(line.replace(/^\s{2}/, ''))
          }
        })

        // Save last entry
        if (currentKey !== null) {
          entries.push({
            key: currentKey,
            value: currentValue.join('\n').trim()
          })
        }

        return entries
      }

      // Format value for display
      const formatValue = (value) => {
        // If value is empty, show placeholder
        if (!value) return <em style={{ color: '#999' }}>(empty)</em>

        // If value is multiline, wrap in pre tag
        if (value.includes('\n')) {
          return <pre>{value}</pre>
        }

        // If value looks like a list, format it
        if (value.startsWith('[') && value.endsWith(']')) {
          const items = value.slice(1, -1).split(',').map(item => item.trim())
          return items.map((item, idx) => (
            <span key={idx}>
              <code>{item}</code>
              {idx < items.length - 1 && ', '}
            </span>
          ))
        }

        // Otherwise return as plain text
        return value
      }

      const frontmatterEntries = (viewMode === 'frontmatter' || mainViewMode === 'yaml') ? parseFrontmatterForTable(rawFrontmatter) : []

      // Get subdirectory structure for current skill
      const currentSubdirs = selectedSection === 'skills' && activeTab
        ? skillSubdirStructure[activeTab] || []
        : []

      // Load file from subdirectory
      const loadSubdirFile = async (subdirName, fileName) => {
        try {
          const filePath = `${subdirName}/${fileName}`
          const fileData = await docsService.getDocFile('skills', activeTab, filePath)
          const content = fileData.content || ''
          setSubdirContent(content)
          setSelectedFile(`${subdirName}/${fileName}`)
          // Save last selected file for this subdirectory
          setLastFileBySubdir(prev => ({
            ...prev,
            [`${activeTab}/${subdirName}`]: fileName
          }))
        } catch (err) {
          console.error('Error loading subdirectory file:', err)
          setSubdirContent(`# Error\n\nFailed to load file: ${fileName}`)
        }
      }

      // Handle thumbnail click
      const handleThumbnailClick = (subdirName) => {
        if (selectedSubdir === subdirName) {
          // Deselect if clicking same thumbnail
          setSelectedSubdir(null)
          setSelectedFile(null)
          setSubdirContent('')
        } else {
          setSelectedSubdir(subdirName)
          setSelectedFile(null)
          setSubdirContent('')
        }
      }

      // Handle main thumbnail click (return to SKILL.md)
      const handleMainClick = () => {
        setSelectedSubdir(null)
        setSelectedFile(null)
        setSubdirContent('')
      }

      const hasTabs = selectedSection === 'skills' && currentSubdirs.length > 0

      // Debug: Log render state
      console.log('=== Render Debug ===')
      console.log('selectedFile:', selectedFile)
      console.log('subdirContent length:', subdirContent ? subdirContent.length : 0)
      console.log('hasTabs:', hasTabs)

      return (
        <ContentWrapper>
          {/* Edit mode view - textarea replaces rendered content in-place */}
          {isEditMode ? (
            <>
              {/* Document header with cancel button in edit mode */}
              <DocumentHeader>
                {hasUnsavedChanges && (
                  <UnsavedIndicator>Unsaved changes</UnsavedIndicator>
                )}
                <EditButton
                  $active={true}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  ✕ Cancel
                </EditButton>
              </DocumentHeader>
              <EditTextarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Enter document content..."
                spellCheck={false}
                autoFocus
              />
              <EditActions>
                <CancelButton onClick={handleCancelEdit} disabled={isSaving}>
                  Cancel
                </CancelButton>
                <SaveButton
                  onClick={handleSaveDocument}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </SaveButton>
              </EditActions>
            </>
          ) : (
            <ContentWithTabs $hasTabs={hasTabs}>
              {/* Post-it tabs for skills */}
              {hasTabs && (
                <PostItTabContainer>
                  <PostItTab
                    $active={!selectedSubdir}
                    onClick={handleMainClick}
                  >
                    Main
                  </PostItTab>
                  {currentSubdirs.map((subdir) => (
                    <PostItTab
                      key={subdir.name}
                      $active={selectedSubdir === subdir.name}
                      onClick={() => handleThumbnailClick(subdir.name)}
                    >
                      {subdir.displayName}
                    </PostItTab>
                  ))}
                </PostItTabContainer>
              )}

            {/* File list dropdown for Main tab (SKILL.md / YAML) */}
            {!selectedSubdir && hasTabs && (
              <FileListDropdown>
                <FileButton
                  $active={mainViewMode === 'skill.md'}
                  onClick={() => handleMainViewModeChange('skill.md')}
                >
                  SKILL.md
                </FileButton>
                <FileButton
                  $active={mainViewMode === 'yaml'}
                  onClick={() => handleMainViewModeChange('yaml')}
                >
                  YAML
                </FileButton>
              </FileListDropdown>
            )}

            {/* File list dropdown when subdirectory is selected */}
            {selectedSubdir && (
              <FileListDropdown>
                {currentSubdirs
                  .find(s => s.name === selectedSubdir)
                  ?.files.map((file) => (
                    <FileButton
                      key={file.name}
                      $active={selectedFile === `${selectedSubdir}/${file.name}`}
                      onClick={() => loadSubdirFile(selectedSubdir, file.name)}
                    >
                      {file.displayName}
                    </FileButton>
                  ))}
              </FileListDropdown>
            )}

            {/* View toggle only for non-skill content (workflows, tools) */}
            {!hasTabs && !selectedFile && (
              <PostItTabContainer>
                <PostItTab
                  $active={viewMode === 'markdown'}
                  onClick={() => handleViewModeChange('markdown')}
                >
                  📄 Markdown
                </PostItTab>
                <PostItTab
                  $active={viewMode === 'frontmatter'}
                  onClick={() => handleViewModeChange('frontmatter')}
                >
                  📋 Frontmatter
                </PostItTab>
              </PostItTabContainer>
            )}

            {/* Document header with edit button - positioned after tabs */}
            <DocumentHeader>
              <EditButton
                $active={false}
                onClick={handleEnterEditMode}
                disabled={isSaving}
              >
                ✎ Edit
              </EditButton>
            </DocumentHeader>

            {/* Content display */}
            {selectedFile ? (
              // Show subdirectory file content
              <MarkdownRenderer content={subdirContent} />
            ) : hasTabs ? (
              // Skills with tabs: show based on mainViewMode
              mainViewMode === 'skill.md' ? (
                <MarkdownRenderer content={selectedEntryContent} />
              ) : (
                <FrontmatterContainer>
                  <CopyButton onClick={handleCopyFrontmatter}>
                    Copy YAML
                  </CopyButton>
                  <FrontmatterTitle>Document Properties</FrontmatterTitle>
                  <FrontmatterTable>
                    <tbody>
                      {frontmatterEntries.map((entry, index) => (
                        <FrontmatterRow key={index}>
                          <PropertyCell>{entry.key}</PropertyCell>
                          <ValueCell>{formatValue(entry.value)}</ValueCell>
                        </FrontmatterRow>
                      ))}
                    </tbody>
                  </FrontmatterTable>
                </FrontmatterContainer>
              )
            ) : viewMode === 'markdown' ? (
              <MarkdownRenderer content={selectedEntryContent} />
            ) : (
              <FrontmatterContainer>
                <CopyButton onClick={handleCopyFrontmatter}>
                  Copy YAML
                </CopyButton>
                <FrontmatterTitle>Document Properties</FrontmatterTitle>
                <FrontmatterTable>
                  <tbody>
                    {frontmatterEntries.map((entry, index) => (
                      <FrontmatterRow key={index}>
                        <PropertyCell>{entry.key}</PropertyCell>
                        <ValueCell>{formatValue(entry.value)}</ValueCell>
                      </FrontmatterRow>
                    ))}
                  </tbody>
                </FrontmatterTable>
              </FrontmatterContainer>
            )}
            </ContentWithTabs>
          )}
        </ContentWrapper>
      )
    }

    // Show empty state when no entry selected
    if (selectedSection === 'workflows' || selectedSection === 'skills' || selectedSection === 'mcp' || selectedSection === 'subagents') {
      const sectionLabel = selectedSection.slice(0, -1)
      const sectionIcons = {
        workflows: '📋',
        skills: '🎯',
        mcp: '🔌',
        subagents: '🤖'
      }
      const sectionIcon = sectionIcons[selectedSection] || '📄'
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const shortcutKey = isMac ? '⌘K' : 'Ctrl+K'

      return (
        <ContentWrapper>
          <PageTitle>
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
          </PageTitle>
          <MainEmptyState>
            <MainEmptyIcon>{sectionIcon}</MainEmptyIcon>
            <MainEmptyText>
              No {sectionLabel} selected
            </MainEmptyText>
            <MainSelectButton onClick={() => setIsPaletteOpen(true)}>
              Select {sectionLabel}
              <MainSelectShortcut>{shortcutKey}</MainSelectShortcut>
            </MainSelectButton>
          </MainEmptyState>
        </ContentWrapper>
      )
    }

    // Default fallback
    return (
      <ContentWrapper>
        <PageTitle>Documentation</PageTitle>
        <LoadingMessage style={{ color: '#999' }}>
          Select an item from the navigation to get started
        </LoadingMessage>
      </ContentWrapper>
    )
  }

  return (
    <DocsContainer>
      {!isNavVisible && (
        <ToggleButtonHidden onClick={handleToggleNav}>
          DOCS
        </ToggleButtonHidden>
      )}

      <LeftSidebar $visible={isNavVisible}>
        {isNavVisible && (
          <NavigationHeader>
            <CompactToggleButton onClick={handleToggleNav}>
              ←
            </CompactToggleButton>
            <RefreshButton onClick={handleRefresh} disabled={loading} title="Refresh documentation">
              ↻
            </RefreshButton>
          </NavigationHeader>
        )}
        <FileTreeScrollableArea style={['workflows', 'skills', 'mcp', 'subagents'].includes(selectedSection) && !activeTab ? { flex: 1, maxHeight: 'none' } : {}}>
          <FileTreeNav
            selectedSection={selectedSection}
            activeTab={activeTab}
            onSectionChange={handleSectionChange}
            onOpenPalette={() => setIsPaletteOpen(true)}
            workflowEntries={workflowEntries}
            skillEntries={skillEntries}
            mcpEntries={mcpEntries}
            subagentEntries={subagentEntries}
            availableWorkflows={availableWorkflows}
            availableSkills={availableSkills}
            availableMcp={availableMcp}
            availableSubagents={availableSubagents}
            onItemSelectFromList={handleItemSelectFromList}
          />
        </FileTreeScrollableArea>
        {isNavVisible && !(['workflows', 'skills', 'mcp', 'subagents'].includes(selectedSection) && !activeTab) && (
          <PreviewPanelContainer>
            <DocsPreview data={previewData} />
          </PreviewPanelContainer>
        )}
      </LeftSidebar>

      <MainContent ref={mainContentRef}>
        {renderContent()}
      </MainContent>

      {/* Command Palette for fast search */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        items={getCurrentSectionItems()}
        activeSection={selectedSection}
        onSelect={handleSelectEntry}
        placeholder={`Search ${selectedSection === 'workflows' ? 'workflows' : selectedSection === 'skills' ? 'skills' : selectedSection === 'mcp' ? 'mcp servers' : selectedSection === 'subagents' ? 'subagents' : 'items'}...`}
      />

      {/* Upload Document Modal */}
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        activeSection={selectedSection}
        onUploadComplete={handleUploadComplete}
      />
    </DocsContainer>
  )
}

export default Docs
