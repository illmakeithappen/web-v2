import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FileTreeNav from '../components/hub/FileTreeNav'
import CommandPalette from '../components/hub/CommandPalette'
import MarkdownRenderer from '../components/MarkdownRenderer'
import MarkdownEditor from '../components/MarkdownEditor'
import InlineMarkdownEditor from '../components/InlineMarkdownEditor'
import SeamlessMarkdownEditor from '../components/SeamlessMarkdownEditor'
import DocsPreview from '../components/hub/DocsPreview'
import SupabaseUploadModal from '../components/docs/SupabaseUploadModal'
import DeleteContentModal from '../components/docs/DeleteContentModal'
import docsService from '../services/docs-service'
import { fetchWorkflowById, fetchWorkflows, fetchSkills, fetchMcpServers, fetchSubagents, fetchSkillById, fetchMcpServerById, fetchSubagentById } from '../services/template-service'
import { updateContent, parseFrontmatter as parseMarkdownFrontmatter, serializeMarkdown } from '../services/content-edit-service'
import { storageService } from '../services/storage-service'
import JSZip from 'jszip'

// Helper function to build subdirectory structure from references
// Maps file_path patterns to display names and icons
const SUBDIR_CONFIG = {
  'references': { displayName: 'Guides', icon: '📚' },
  'references/examples': { displayName: 'Examples', icon: '💡' },
  'references/format-standards': { displayName: 'Standards', icon: '📐' },
  'references/process-patterns': { displayName: 'Patterns', icon: '🔄' },
  'references/system-prompts': { displayName: 'Prompts', icon: '🤖' },
  'references/prompts': { displayName: 'Prompts', icon: '🤖' },
  'guides': { displayName: 'Guides', icon: '📚' },
  'examples': { displayName: 'Examples', icon: '💡' },
  'standards': { displayName: 'Standards', icon: '📐' },
  'patterns': { displayName: 'Patterns', icon: '🔄' },
  'prompts': { displayName: 'Prompts', icon: '🤖' }
}

// Infer subdirectory from filename when file_path is not available
function inferSubdirFromFilename(filename) {
  const name = filename.toLowerCase()

  // Examples pattern
  if (name.startsWith('example-') || name.includes('-example')) {
    return 'references/examples'
  }

  // Standards/Format patterns
  if (name.includes('-spec') || name.includes('-conventions') ||
      name.includes('-guidelines') || name.includes('format-')) {
    return 'references/format-standards'
  }

  // Patterns patterns
  if (name.includes('best-practices') || name.includes('common-patterns') ||
      name.includes('-process') || name.includes('patterns')) {
    return 'references/process-patterns'
  }

  // Prompts patterns
  if (name.includes('prompt') || name.includes('system-prompt')) {
    return 'references/system-prompts'
  }

  // Default to guides
  return 'references'
}

function buildSubdirStructureFromReferences(references) {
  if (!references || references.length === 0) return []

  // Group references by their directory path
  const dirGroups = {}

  references.forEach(ref => {
    // Get directory from file_path or infer from filename
    let dirPath = ''
    if (ref.file_path) {
      // file_path might be like "references/examples/example-deploy.md"
      const parts = ref.file_path.split('/')
      if (parts.length > 1) {
        // Everything except the filename
        dirPath = parts.slice(0, -1).join('/')
      } else {
        dirPath = inferSubdirFromFilename(ref.name || ref.file_path)
      }
    } else {
      // Infer from filename when file_path is not available
      dirPath = inferSubdirFromFilename(ref.name || '')
    }

    if (!dirGroups[dirPath]) {
      dirGroups[dirPath] = []
    }
    dirGroups[dirPath].push({
      name: ref.name,
      displayName: ref.title || ref.name,
      id: ref.id,
      content: ref.content
    })
  })

  // Convert to subdirectory structure array
  const subdirs = Object.entries(dirGroups).map(([dirPath, files]) => {
    const config = SUBDIR_CONFIG[dirPath] || { displayName: dirPath.split('/').pop() || 'Files', icon: '📄' }
    return {
      name: dirPath,
      displayName: config.displayName,
      icon: config.icon,
      files: files
    }
  })

  // Sort subdirectories in a consistent order
  const orderMap = {
    'references': 0,
    'references/examples': 1,
    'references/format-standards': 2,
    'references/process-patterns': 3,
    'references/system-prompts': 4,
    'references/prompts': 4
  }

  subdirs.sort((a, b) => {
    const orderA = orderMap[a.name] ?? 99
    const orderB = orderMap[b.name] ?? 99
    return orderA - orderB
  })

  return subdirs
}

// Styled Components
const DocsContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: white;
  margin: 0;
  padding: 0;
  overflow: visible;
`

const LeftSidebar = styled.div`
  width: ${props => props.$visible ? '300px' : '0px'};
  min-width: ${props => props.$visible ? '300px' : '0px'};
  border-right: none;
  background: #e8e8e8;
  overflow-x: hidden;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  position: relative;
  border-radius: 0 12px 12px 0;
  z-index: 100;
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
  position: relative;
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
  flex-wrap: wrap;
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

// Workflow References Panel styled components
const ReferencesPanel = styled.div`
  background: #fafafa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
`

const ReferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ReferenceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #0969da;
    box-shadow: 0 2px 8px rgba(9, 105, 218, 0.1);
  }
`

const ReferenceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const ReferenceIcon = styled.span`
  font-size: 1.25rem;
`

const ReferenceName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #24292f;
`

const ReferenceActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ReferenceActionButton = styled.button`
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 0.8rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`

const UploadReferenceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: transparent;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #0969da;
    color: #0969da;
    background: rgba(9, 105, 218, 0.05);
  }
`

const EmptyReferencesState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
  text-align: center;
`

const ReferencePreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ReferencePreviewContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`

const ReferencePreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e4e8;
  background: #f6f8fa;
`

const ReferencePreviewTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #24292f;
`

const ReferencePreviewClose = styled.button`
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 0.8rem;
  color: #374151;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`

const ReferencePreviewBody = styled.div`
  padding: 1.5rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  line-height: 1.6;
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
  const { user } = useAuth()

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
  // First-time visitors see README > welcome.md (Getting Started)
  const initialSection = searchParams.get('section') || savedState?.selectedSection || 'readme'
  const initialTab = searchParams.get('tab') || savedState?.activeTab || (savedState?.selectedSection ? null : 'welcome')

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
  const [metadata, setMetadata] = useState({})
  const [currentReferences, setCurrentReferences] = useState([])

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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Track last selected file per subdirectory for persistence
  const [lastFileBySubdir, setLastFileBySubdir] = useState({})

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [originalContent, setOriginalContent] = useState('') // Store original for comparison
  const [editingFilePath, setEditingFilePath] = useState(null) // Track which file is being edited

  // Paragraph-level inline editing state
  const [editingParagraphId, setEditingParagraphId] = useState(null)
  const [editingParagraphContent, setEditingParagraphContent] = useState('')
  const [originalParagraphContent, setOriginalParagraphContent] = useState('')
  const [paragraphPosition, setParagraphPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  // Workflow-specific tab state (Main / References)
  const [workflowTab, setWorkflowTab] = useState('main') // 'main' | 'references'
  const [workflowReferences, setWorkflowReferences] = useState([]) // Files from S3
  const [previewingReference, setPreviewingReference] = useState(null) // Currently previewing reference file

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
          const subdirs = buildSubdirStructureFromReferences(currentReferences)

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
    // Upload action item (appears at top of all lists) - only for logged-in users
    const uploadAction = user ? {
      id: '__upload__',
      name: 'Upload New...',
      description: `Upload a new ${selectedSection.slice(0, -1)} from a .md file`,
      type: 'action',
      isAction: true
    } : null

    // Filter out null upload action for non-logged-in users
    const withUpload = (items) => uploadAction ? [uploadAction, ...items] : items

    switch (selectedSection) {
      case 'workflows':
        return withUpload(availableWorkflows.map(w => ({
          ...w,
          type: w.type || 'workflow'
        })))
      case 'skills':
        return withUpload(availableSkills.map(s => ({
          ...s,
          type: s.difficulty || 'skill'
        })))
      case 'mcp':
        return withUpload(availableMcp.map(m => ({
          ...m,
          type: m.category || 'mcp'
        })))
      case 'subagents':
        return withUpload(availableSubagents.map(sa => ({
          ...sa,
          type: sa.category || 'subagent'
        })))
      default:
        return []
    }
  }, [selectedSection, availableWorkflows, availableSkills, availableMcp, availableSubagents, user])

  // Load README overview markdown files on mount
  // Tries Supabase doc_overviews table first, falls back to static files
  useEffect(() => {
    const loadOverviewFiles = async () => {
      try {
        const overviews = await docsService.fetchAllOverviews()

        setReadmeMain(overviews.welcome || '')
        setWorkflowsOverview(overviews.workflows || '')
        setSkillsOverview(overviews.skills || '')
        setMcpOverview(overviews.mcp || '')
        setSubagentsOverview(overviews.subagents || '')

        // Set initial preview data for first-time visitors on README section
        if (selectedSection === 'readme' && activeTab) {
          const contentMap = {
            welcome: overviews.welcome,
            workflows: overviews.workflows,
            skills: overviews.skills,
            mcp: overviews.mcp,
            subagents: overviews.subagents
          }
          setPreviewData({
            type: 'readme',
            metadata: {},
            rawContent: contentMap[activeTab] || '',
            section: activeTab
          })
        }
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
        // Fetch workflows from Supabase (both public templates AND user's own workflows)
        // Pass user ID to get user's workflows OR public templates (is_template=true)
        const workflowsResponse = await fetchWorkflows(user?.id, { limit: 100 })

        // Transform Supabase workflows to match the expected format
        const transformedWorkflows = workflowsResponse.success
          ? workflowsResponse.workflows.map(w => ({
              id: w.id,  // Use UUID from Supabase
              name: w.name,
              description: w.description,
              category: w.category,
              tags: w.tags || [],
              difficulty: w.metadata?.difficulty || 'intermediate',
              steps: w.steps || [],  // Include steps extracted by template-service
              frontmatter: w.frontmatter,  // Include frontmatter for fallback
              content: w.content,  // Include content for parsing
            }))
          : []

        // Fetch other content types from Supabase (using template-service)
        const [skillsResponse, mcpResponse, subagentsResponse] = await Promise.all([
          fetchSkills(user?.id, { limit: 100 }),
          fetchMcpServers(user?.id, { limit: 100 }),
          fetchSubagents(user?.id, { limit: 100 })
        ])

        // Transform skills to match expected format
        const transformedSkills = skillsResponse.success
          ? skillsResponse.skills.map(s => ({
              id: s.id,  // UUID from Supabase
              name: s.name,
              description: s.description,
              category: s.category,
              tags: s.tags || [],
              content: s.content,
              frontmatter: s.frontmatter,
            }))
          : []

        // Transform MCP servers to match expected format
        const transformedMcp = mcpResponse.success
          ? mcpResponse.mcp_servers.map(m => ({
              id: m.id,  // UUID from Supabase
              name: m.name,
              description: m.description,
              category: m.category,
              tags: m.tags || [],
              content: m.content,
              frontmatter: m.frontmatter,
            }))
          : []

        // Transform subagents to match expected format
        const transformedSubagents = subagentsResponse.success
          ? subagentsResponse.subagents.map(a => ({
              id: a.id,  // UUID from Supabase
              name: a.name,
              description: a.description,
              category: a.category,
              tags: a.tags || [],
              content: a.content,
              frontmatter: a.frontmatter,
            }))
          : []

        // Filter content for unauthenticated users
        // - Workflows: empty for unauthenticated
        // - Skills: only show "gitthub-workflow" for unauthenticated
        // - MCP/Subagents: empty for unauthenticated
        const filteredWorkflows = user ? transformedWorkflows : []
        const filteredSkills = user
          ? transformedSkills
          : transformedSkills.filter(s => s.name === 'gitthub-workflow')
        const filteredMcp = user ? transformedMcp : []
        const filteredSubagents = user ? transformedSubagents : []

        setAvailableWorkflows(filteredWorkflows)
        setAvailableSkills(filteredSkills)
        setAvailableMcp(filteredMcp)
        setAvailableSubagents(filteredSubagents)
      } catch (err) {
        console.error('Error loading manifest files:', err)
        // Not critical - fallback to empty lists
      }
    }

    loadManifests()
  }, [user])

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
        let docData = null
        let content = ''
        let metadataObj = {}
        let rawFrontmatterText = ''

        // Use template-service for workflows to load from Supabase + markdown files
        if (selectedSection === 'workflows') {
          const response = await fetchWorkflowById(activeTab)
          if (!response.success || !response.workflow) {
            throw new Error('Failed to load workflow')
          }

          const workflow = response.workflow
          content = workflow.content || ''
          // Merge frontmatter with steps from template-service extraction
          metadataObj = {
            ...workflow.frontmatter || {},
            steps: workflow.steps || workflow.frontmatter?.steps || [],  // Include extracted steps
          }
          rawFrontmatterText = workflow.raw_content
            ? workflow.raw_content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || ''
            : ''
          // Fetch workflow reference files (from metadata or S3)
          fetchWorkflowReferences(activeTab, workflow.frontmatter?.references)
          // Reset to Main tab when selecting a new workflow
          setWorkflowTab('main')
        } else if (selectedSection === 'skills') {
          // Fetch skill from Supabase
          const response = await fetchSkillById(activeTab)
          if (!response.success || !response.skill) {
            throw new Error('Failed to load skill')
          }

          const skill = response.skill
          content = skill.content || ''
          metadataObj = skill.frontmatter || {}
          rawFrontmatterText = skill.raw_content
            ? skill.raw_content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || ''
            : ''
          // Store references for subdirectory tabs
          setCurrentReferences(skill.references || [])
          console.log('Fetched skill from Supabase:', skill.name, 'with', skill.references?.length || 0, 'references')
        } else if (selectedSection === 'mcp') {
          // Fetch MCP server from Supabase
          const response = await fetchMcpServerById(activeTab)
          if (!response.success || !response.mcp_server) {
            throw new Error('Failed to load MCP server')
          }

          const mcpServer = response.mcp_server
          content = mcpServer.content || ''
          metadataObj = mcpServer.frontmatter || {}
          rawFrontmatterText = mcpServer.raw_content
            ? mcpServer.raw_content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || ''
            : ''
          // Store references for subdirectory tabs
          setCurrentReferences(mcpServer.references || [])
          console.log('Fetched MCP server from Supabase:', mcpServer.name, 'with', mcpServer.references?.length || 0, 'references')
        } else if (selectedSection === 'subagents') {
          // Fetch subagent from Supabase
          const response = await fetchSubagentById(activeTab)
          if (!response.success || !response.subagent) {
            throw new Error('Failed to load subagent')
          }

          const subagent = response.subagent
          content = subagent.content || ''
          metadataObj = subagent.frontmatter || {}
          rawFrontmatterText = subagent.raw_content
            ? subagent.raw_content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] || ''
            : ''
          // Store references for subdirectory tabs
          setCurrentReferences(subagent.references || [])
          console.log('Fetched subagent from Supabase:', subagent.name, 'with', subagent.references?.length || 0, 'references')
        }

        console.log('Parsed content length:', content.length)
        console.log('Metadata:', metadataObj)

        // Set content for main display (without frontmatter)
        setSelectedEntryContent(content)
        setRawFrontmatter(rawFrontmatterText)
        setMetadata(metadataObj)

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
        const previewType = detectContentType(selectedSection, metadataObj)
        setPreviewData({
          type: previewType,
          metadata: metadataObj,
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
        // Find the file in currentReferences by matching file_path or name
        const targetPath = `${subdirName}/${fileName}`
        console.log('Looking for reference:', targetPath)
        const ref = currentReferences.find(r =>
          r.file_path === targetPath ||
          r.name === fileName ||
          (r.file_path && r.file_path.endsWith(`/${fileName}`))
        )

        if (ref && ref.content) {
          console.log('Content loaded from reference, length:', ref.content.length)
          setSubdirContent(ref.content)
        } else {
          console.warn('Reference not found or has no content:', targetPath)
          setSubdirContent(`# ${fileName}\n\nContent not available.`)
        }

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
      const subdirs = buildSubdirStructureFromReferences(currentReferences)
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
  }, [selectedSubdir, selectedSection, activeTab, currentReferences, lastFileBySubdir])

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
  const handleSectionChange = (section, tab) => {
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

      // If no tab specified (undefined), try to restore the last active tab for this section
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
      // Workflows are stored in Supabase, other sections use docsService
      if (section === 'workflows') {
        // Fetch workflows from Supabase
        const workflowsResponse = await fetchWorkflows(user?.id, { limit: 100 })

        const transformedWorkflows = workflowsResponse.success
          ? workflowsResponse.workflows.map(w => ({
              id: w.id,
              name: w.name,
              description: w.description,
              category: w.category,
              tags: w.tags || [],
              difficulty: w.metadata?.difficulty || 'intermediate',
              steps: w.steps || [],  // Include steps extracted by template-service
              frontmatter: w.frontmatter,  // Include frontmatter for fallback
              content: w.content,  // Include content for parsing
            }))
          : []

        setAvailableWorkflows(transformedWorkflows)
      } else {
        // Other sections: fetch from Supabase using template-service
        switch (section) {
          case 'skills': {
            const skillsResponse = await fetchSkills(user?.id, { limit: 100 })
            const transformedSkills = skillsResponse.success
              ? skillsResponse.skills.map(s => ({
                  id: s.id,
                  name: s.name,
                  description: s.description,
                  category: s.category,
                  tags: s.tags || [],
                  content: s.content,
                  frontmatter: s.frontmatter,
                }))
              : []
            setAvailableSkills(transformedSkills)
            break
          }
          case 'mcp': {
            const mcpResponse = await fetchMcpServers(user?.id, { limit: 100 })
            const transformedMcp = mcpResponse.success
              ? mcpResponse.mcp_servers.map(m => ({
                  id: m.id,
                  name: m.name,
                  description: m.description,
                  category: m.category,
                  tags: m.tags || [],
                  content: m.content,
                  frontmatter: m.frontmatter,
                }))
              : []
            setAvailableMcp(transformedMcp)
            break
          }
          case 'subagents': {
            const subagentsResponse = await fetchSubagents(user?.id, { limit: 100 })
            const transformedSubagents = subagentsResponse.success
              ? subagentsResponse.subagents.map(a => ({
                  id: a.id,
                  name: a.name,
                  description: a.description,
                  category: a.category,
                  tags: a.tags || [],
                  content: a.content,
                  frontmatter: a.frontmatter,
                }))
              : []
            setAvailableSubagents(transformedSubagents)
            break
          }
        }
      }

      // Select the newly uploaded document
      handleSelectEntry(section, docId)
    } catch (err) {
      console.error('Error refreshing after upload:', err)
    }
  }

  // Handle delete completion - refresh the list and clear selection if deleted
  const handleDeleteComplete = async (deletedIds) => {
    console.log('Delete complete, removed IDs:', deletedIds)

    try {
      // Get the content type based on current section
      const section = selectedSection === 'readme' ? 'workflows' : selectedSection

      // Refresh the list
      switch (section) {
        case 'workflows': {
          const workflowsResponse = await fetchWorkflows(user?.id, { limit: 100 })
          const transformedWorkflows = workflowsResponse.success
            ? workflowsResponse.workflows.map(w => ({
                id: w.id,
                name: w.name,
                description: w.description,
                category: w.category,
                tags: w.tags || [],
                difficulty: w.metadata?.difficulty || 'intermediate',
                steps: w.steps || [],
                frontmatter: w.frontmatter,
                content: w.content,
              }))
            : []
          setAvailableWorkflows(transformedWorkflows)
          break
        }
        case 'skills': {
          const skillsResponse = await fetchSkills(user?.id, { limit: 100 })
          const transformedSkills = skillsResponse.success
            ? skillsResponse.skills.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                category: s.category,
                tags: s.tags || [],
                content: s.content,
                frontmatter: s.frontmatter,
              }))
            : []
          setAvailableSkills(transformedSkills)
          break
        }
        case 'mcp': {
          const mcpResponse = await fetchMcpServers(user?.id, { limit: 100 })
          const transformedMcp = mcpResponse.success
            ? mcpResponse.mcp_servers.map(m => ({
                id: m.id,
                name: m.name,
                description: m.description,
                category: m.category,
                tags: m.tags || [],
                content: m.content,
                frontmatter: m.frontmatter,
              }))
            : []
          setAvailableMcp(transformedMcp)
          break
        }
        case 'subagents': {
          const subagentsResponse = await fetchSubagents(user?.id, { limit: 100 })
          const transformedSubagents = subagentsResponse.success
            ? subagentsResponse.subagents.map(a => ({
                id: a.id,
                name: a.name,
                description: a.description,
                category: a.category,
                tags: a.tags || [],
                content: a.content,
                frontmatter: a.frontmatter,
              }))
            : []
          setAvailableSubagents(transformedSubagents)
          break
        }
      }

      // If currently selected item was deleted, clear selection
      if (activeTab && deletedIds.includes(activeTab)) {
        setActiveTab(null)
        setDocContent('')
        setMetadata({})
        setRawFrontmatter('')
        setCurrentReferences([])
      }
    } catch (err) {
      console.error('Error refreshing after delete:', err)
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

      // Reload overview files (from Supabase doc_overviews with static fallback)
      const overviews = await docsService.fetchAllOverviews()

      setReadmeMain(overviews.welcome || '')
      setWorkflowsOverview(overviews.workflows || '')
      setSkillsOverview(overviews.skills || '')
      setMcpOverview(overviews.mcp || '')
      setSubagentsOverview(overviews.subagents || '')

      // Reload all content from Supabase
      const [workflowsResponse, skillsResponse, mcpResponse, subagentsResponse] = await Promise.all([
        fetchWorkflows(user?.id, { limit: 100 }),
        fetchSkills(user?.id, { limit: 100 }),
        fetchMcpServers(user?.id, { limit: 100 }),
        fetchSubagents(user?.id, { limit: 100 })
      ])

      // Transform workflows
      const transformedWorkflows = workflowsResponse.success
        ? workflowsResponse.workflows.map(w => ({
            id: w.id,
            name: w.name,
            description: w.description,
            category: w.category,
            tags: w.tags || [],
            difficulty: w.metadata?.difficulty || 'intermediate',
            steps: w.steps || [],
            frontmatter: w.frontmatter,
            content: w.content,
          }))
        : []

      // Transform skills
      const transformedSkills = skillsResponse.success
        ? skillsResponse.skills.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            category: s.category,
            tags: s.tags || [],
            content: s.content,
            frontmatter: s.frontmatter,
          }))
        : []

      // Transform MCP servers
      const transformedMcp = mcpResponse.success
        ? mcpResponse.mcp_servers.map(m => ({
            id: m.id,
            name: m.name,
            description: m.description,
            category: m.category,
            tags: m.tags || [],
            content: m.content,
            frontmatter: m.frontmatter,
          }))
        : []

      // Transform subagents
      const transformedSubagents = subagentsResponse.success
        ? subagentsResponse.subagents.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            category: a.category,
            tags: a.tags || [],
            content: a.content,
            frontmatter: a.frontmatter,
          }))
        : []

      setAvailableWorkflows(transformedWorkflows)
      setAvailableSkills(transformedSkills)
      setAvailableMcp(transformedMcp)
      setAvailableSubagents(transformedSubagents)
      console.log(`✓ Loaded ${transformedWorkflows.length} workflows, ${transformedSkills.length} skills, ${transformedMcp.length} mcp, ${transformedSubagents.length} subagents`)

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

  // Download state
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  // Clear download error when switching entities
  useEffect(() => {
    setDownloadError(null)
  }, [activeTab, selectedSection])

  // Download file from storage - bundles main content + references into ZIP
  const handleDownload = async () => {
    if (!activeTab || !selectedSection || selectedSection === 'readme') {
      return
    }

    setIsDownloading(true)
    setDownloadError(null)

    try {
      // 1. Get main content from database (includes edits)
      const mainContent = selectedEntryContent
      if (!mainContent) {
        setDownloadError('No content available for download')
        setIsDownloading(false)
        return
      }

      // Reconstruct full document with frontmatter
      const fullDocument = rawFrontmatter
        ? `---\n${rawFrontmatter}\n---\n\n${mainContent}`
        : mainContent

      // 2. Create ZIP file
      const zip = new JSZip()

      // Add main document as "workflow.md" (clean name, not UUID)
      zip.file('workflow.md', fullDocument)

      // 3. For workflows, add FILTERED reference files from S3
      // Use dynamic path (may be nested for legacy uploads)
      if (selectedSection === 'workflows' && workflowReferences.length > 0) {
        const referencesFolder = zip.folder('references')

        for (const ref of workflowReferences) {
          // Double-filter: skip ZIP files and UUID-named files
          const name = ref.name?.toLowerCase() || ''
          if (name.endsWith('.zip')) continue
          if (/^[a-f0-9]{8}-[a-f0-9]{4}/.test(name)) continue

          try {
            // Use fullPath from metadata if available, otherwise construct standard path
            let filePath = ref.fullPath || `workflows/${activeTab}/references/${ref.name}`
            // Handle vault-web bucket prefix
            if (filePath.startsWith('vault-web/')) {
              filePath = filePath.replace('vault-web/', '')
            }
            const { data, error } = await storageService.downloadFile(filePath)
            if (!error && data) {
              referencesFolder.file(ref.name, data)
            } else {
              console.warn(`Could not include reference file: ${ref.name}`)
            }
          } catch (refErr) {
            console.warn(`Error downloading reference ${ref.name}:`, refErr)
          }
        }
      }

      // 4. For skills with subdocuments (references), include them
      if (selectedSection === 'skills' && currentReferences && currentReferences.length > 0) {
        const referencesFolder = zip.folder('references')
        for (const ref of currentReferences) {
          if (ref.raw_content) {
            const refFileName = ref.file_path
              ? ref.file_path.split('/').pop()
              : `${ref.name || ref.title || 'reference'}.md`
            referencesFolder.file(refFileName, ref.raw_content)
          }
        }
      }

      // 5. Generate ZIP with clean name: {id}_{date}.zip
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
      const zipFileName = `${activeTab}_${today}.zip`

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = zipFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Download error:', err)
      setDownloadError('Download failed')
    } finally {
      setIsDownloading(false)
    }
  }

  // Fetch workflow references from metadata (frontmatter.references)
  // The metadata contains full paths to files in storage
  const fetchWorkflowReferences = async (workflowId, metadataReferences = null) => {
    console.log('fetchWorkflowReferences:', workflowId, 'metadata:', metadataReferences)

    // Use references from frontmatter metadata
    if (metadataReferences && Array.isArray(metadataReferences) && metadataReferences.length > 0) {
      // Convert to reference objects with filename and full path
      const refObjects = metadataReferences.map(ref => {
        // Handle both full paths and plain filenames
        const fullPath = typeof ref === 'string' ? ref : ref.path
        const fileName = fullPath.split('/').pop()
        return {
          name: fileName,
          fullPath: fullPath  // Keep full path for download/preview
        }
      }).filter(ref => {
        // Filter out zip files and UUID-named items
        const name = ref.name?.toLowerCase() || ''
        if (!name) return false
        if (name.endsWith('.zip')) return false
        if (/^[a-f0-9]{8}-[a-f0-9]{4}/.test(name)) return false
        return true
      })

      console.log('Workflow references from metadata:', refObjects)
      setWorkflowReferences(refObjects)
      return
    }

    // Fallback: try to list from S3 at standard path
    try {
      const { data: files, error } = await storageService.listFilesInSubfolder(
        'workflows',
        workflowId,
        'references'
      )

      if (!error && files && files.length > 0) {
        const validReferences = files.filter(file => {
          const name = file.name?.toLowerCase() || ''
          if (!name) return false
          if (name.endsWith('.zip')) return false
          if (name.startsWith('.')) return false
          if (/^[a-f0-9]{8}-[a-f0-9]{4}/.test(name)) return false
          return true
        })
        console.log('Workflow references from S3:', validReferences)
        setWorkflowReferences(validReferences)
        return
      }
    } catch (err) {
      console.warn('S3 fallback failed:', err)
    }

    setWorkflowReferences([])
  }

  // Get file path - use fullPath from metadata if available, otherwise construct standard path
  const getReferencePath = (file) => {
    if (file.fullPath) return file.fullPath
    return `workflows/${activeTab}/references/${file.name}`
  }

  // Get public URL for a reference file (for preview)
  const getReferencePublicUrl = (file) => {
    const path = getReferencePath(file)
    // Determine bucket from path - if starts with 'vault-web/', use that bucket
    if (path.startsWith('vault-web/')) {
      const pathWithoutBucket = path.replace('vault-web/', '')
      return storageService.getPublicUrl(pathWithoutBucket)
    }
    return storageService.getPublicUrl(path)
  }

  // Preview a reference file (images and PDFs)
  const handlePreviewReference = (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
    const isPdf = ext === 'pdf'

    if (isImage || isPdf) {
      const publicUrl = getReferencePublicUrl(file)
      setPreviewingReference({ name: file.name, url: publicUrl, type: isImage ? 'image' : 'pdf' })
    } else {
      // For other files, just trigger download
      handleDownloadReference(file)
    }
  }

  // Download a single reference file
  const handleDownloadReference = async (file) => {
    try {
      const filePath = getReferencePath(file)
      // Handle vault-web bucket path
      let downloadPath = filePath
      if (filePath.startsWith('vault-web/')) {
        downloadPath = filePath.replace('vault-web/', '')
      }
      const { data, error } = await storageService.downloadFile(downloadPath)
      if (error) {
        console.error('Error downloading file:', error)
        return
      }
      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading file:', err)
    }
  }

  // Delete a reference file
  const handleDeleteReference = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return
    }
    try {
      const filePath = getReferencePath(file)
      let deletePath = filePath
      if (filePath.startsWith('vault-web/')) {
        deletePath = filePath.replace('vault-web/', '')
      }
      const { error } = await storageService.deleteFile(deletePath)
      if (error) {
        console.error('Error deleting file:', error)
        return
      }
      // Refresh the references list
      await fetchWorkflowReferences(activeTab, metadata?.references)
    } catch (err) {
      console.error('Error deleting file:', err)
    }
  }

  // Handle upload of reference file
  const handleUploadReference = async (file) => {
    try {
      // Upload to S3: workflows/{workflowId}/references/{filename}
      const { error } = await storageService.uploadFile('workflows', `${activeTab}/references`, file)
      if (error) {
        console.error('Error uploading file:', error)
        return
      }
      // Refresh the references list
      await fetchWorkflowReferences(activeTab, metadata?.references)
      setIsUploadModalOpen(false)
    } catch (err) {
      console.error('Error uploading file:', err)
    }
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
  const handleSaveDocument = async (newContent) => {
    // Use newContent if provided (from SeamlessMarkdownEditor), otherwise fall back to editContent state
    const contentToSave = newContent || editContent
    setIsSaving(true)
    try {
      // Parse the edited content to extract frontmatter and content
      const { frontmatter: parsedFrontmatter, content: parsedContent } = parseMarkdownFrontmatter(contentToSave)

      // Determine content type for updateContent service
      const contentType = selectedSection === 'workflows' ? 'workflow'
        : selectedSection === 'skills' ? 'skill'
        : selectedSection === 'mcp' ? 'mcp_server'
        : selectedSection === 'subagents' ? 'subagent'
        : null

      if (!contentType || !activeTab) {
        throw new Error('Invalid content type or active tab')
      }

      // Update content in Supabase using content-edit-service
      const result = await updateContent(
        contentType,
        activeTab,  // ID of the workflow/skill/mcp/subagent
        parsedContent,
        contentToSave,  // raw_content with frontmatter
        parsedFrontmatter
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to update content')
      }

      // Update state based on what was edited
      if (editingFilePath) {
        // Saved a subdirectory file (references)
        setSubdirContent(contentToSave)
      } else {
        // Saved main document - parse frontmatter
        const { metadata, content, rawFrontmatter: newRawFrontmatter } = parseFrontmatter(contentToSave)
        setSelectedEntryContent(content)
        setRawFrontmatter(newRawFrontmatter)
      }

      setOriginalContent(contentToSave)

      // Exit edit mode
      setIsEditMode(false)
      setEditContent('')
      setEditingFilePath(null)

      console.log('Document saved successfully to database')
    } catch (err) {
      console.error('Error saving document:', err)
      alert(`Failed to save document: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Save overview document (welcome, workflows, skills, mcp, subagents overviews)
  const handleSaveOverview = async (slug, content) => {
    setIsSaving(true)
    try {
      const result = await docsService.updateOverview(slug, content)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update overview')
      }

      // Update local state based on which overview was edited
      switch (slug) {
        case 'welcome':
          setReadmeMain(content)
          break
        case 'workflows':
          setWorkflowsOverview(content)
          break
        case 'skills':
          setSkillsOverview(content)
          break
        case 'mcp':
          setMcpOverview(content)
          break
        case 'subagents':
          setSubagentsOverview(content)
          break
      }

      console.log(`Overview ${slug} saved successfully`)
      return { success: true }
    } catch (err) {
      console.error('Error saving overview:', err)
      alert(`Failed to save overview: ${err.message}`)
      return { success: false, error: err.message }
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to extract paragraph markdown from full content using node position
  const extractParagraphMarkdown = (fullMarkdown, position) => {
    if (!position || !position.start || !position.end) {
      console.error('Invalid node position:', position)
      return ''
    }
    const lines = fullMarkdown.split('\n')
    const startLine = position.start.line - 1 // Convert to 0-indexed
    const endLine = position.end.line - 1
    return lines.slice(startLine, endLine + 1).join('\n')
  }

  // Handle double-click on paragraph to enter inline edit mode
  const handleParagraphDoubleClick = (event, node) => {
    event.preventDefault()
    event.stopPropagation()

    // Check for concurrent edits
    if (editingParagraphId && editingParagraphContent !== originalParagraphContent) {
      const confirm = window.confirm(
        'You have unsaved changes. Discard them and edit another paragraph?'
      )
      if (!confirm) return
    }

    // Don't allow paragraph editing if in full-document edit mode
    if (isEditMode) {
      alert('Please exit full-document edit mode before editing paragraphs.')
      return
    }

    // Extract markdown for this paragraph
    const paragraphMarkdown = extractParagraphMarkdown(
      selectedEntryContent,
      node.position
    )

    if (!paragraphMarkdown) {
      console.error('Failed to extract paragraph content')
      return
    }

    // Calculate overlay position relative to MainContent container
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = mainContentRef.current?.getBoundingClientRect()

    if (!containerRect) {
      console.error('MainContent ref not available')
      return
    }

    setParagraphPosition({
      top: rect.top - containerRect.top + (mainContentRef.current?.scrollTop || 0),
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height
    })

    // Enter edit mode
    setEditingParagraphId(`para-${node.position.start.line}`)
    setEditingParagraphContent(paragraphMarkdown)
    setOriginalParagraphContent(paragraphMarkdown)
  }

  // Save edited paragraph
  const handleSaveParagraph = async (newContent) => {
    // Replace paragraph in full document
    const updatedContent = selectedEntryContent.replace(
      originalParagraphContent,
      newContent
    )

    // Reconstruct full document with frontmatter
    const fullDoc = rawFrontmatter
      ? `---\n${rawFrontmatter}\n---\n\n${updatedContent}`
      : updatedContent

    // Parse frontmatter
    const { frontmatter, content } = parseMarkdownFrontmatter(fullDoc)

    // Determine content type
    const contentType = selectedSection === 'workflows' ? 'workflow'
      : selectedSection === 'skills' ? 'skill'
      : selectedSection === 'mcp' ? 'mcp_server'
      : selectedSection === 'subagents' ? 'subagent'
      : null

    if (!contentType || !activeTab) {
      alert('Unable to save: Invalid content type or no active tab')
      return
    }

    try {
      setIsSaving(true)
      const result = await updateContent(
        contentType,
        activeTab,
        updatedContent,
        fullDoc,
        frontmatter
      )

      if (result.success) {
        setSelectedEntryContent(updatedContent)
        setEditingParagraphId(null)
        setEditingParagraphContent('')
        setOriginalParagraphContent('')
        console.log('Paragraph saved successfully')
      } else {
        throw new Error(result.error || 'Failed to save paragraph')
      }
    } catch (err) {
      console.error('Failed to save paragraph:', err)
      alert(`Failed to save: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel paragraph editing
  const handleCancelParagraphEdit = () => {
    setEditingParagraphId(null)
    setEditingParagraphContent('')
    setOriginalParagraphContent('')
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
              <MarkdownRenderer content={readmeMain} />
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

        // Ensure value is a string
        const stringValue = typeof value === 'string' ? value : String(value)

        // If value is multiline, wrap in pre tag
        if (stringValue.includes('\n')) {
          return <pre>{stringValue}</pre>
        }

        // If value looks like a list, format it
        if (stringValue.startsWith('[') && stringValue.endsWith(']')) {
          const items = stringValue.slice(1, -1).split(',').map(item => item.trim())
          return items.map((item, idx) => (
            <span key={idx}>
              <code>{item}</code>
              {idx < items.length - 1 && ', '}
            </span>
          ))
        }

        // Otherwise return as plain text
        return stringValue
      }

      // For frontmatter display, prefer structured metadata over parsed YAML
      // This ensures all fields from database are shown (title, description, purpose, steps, etc.)
      const frontmatterEntries = (viewMode === 'frontmatter' || mainViewMode === 'yaml')
        ? (Object.keys(metadata).length > 0
            ? Object.entries(metadata).map(([key, value]) => ({
                key,
                value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
              }))
            : parseFrontmatterForTable(rawFrontmatter))
        : []

      // Get subdirectory structure from current references (loaded from Supabase)
      const currentSubdirs = selectedSection === 'skills' && activeTab
        ? buildSubdirStructureFromReferences(currentReferences)
        : []

      // Load file from subdirectory (from Supabase references)
      const loadSubdirFile = async (subdirName, fileName) => {
        try {
          // Find the file in currentReferences by matching file_path or name
          const targetPath = `${subdirName}/${fileName}`
          const ref = currentReferences.find(r =>
            r.file_path === targetPath ||
            r.name === fileName ||
            (r.file_path && r.file_path.endsWith(`/${fileName}`))
          )

          if (ref && ref.content) {
            setSubdirContent(ref.content)
          } else {
            console.warn('Reference not found or has no content:', targetPath)
            setSubdirContent(`# ${fileName}\n\nContent not available.`)
          }

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
          {/* Edit mode view - SeamlessMarkdownEditor for in-place editing */}
          {isEditMode ? (
            <>
              <MarkdownEditor
                initialValue={editContent}
                onChange={setEditContent}
                onSave={handleSaveDocument}
                height="70vh"
                placeholder="Enter document content..."
              />
              <EditActions>
                {hasUnsavedChanges && (
                  <UnsavedIndicator>Unsaved changes</UnsavedIndicator>
                )}
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

            {/* Workflow tabs: Main / References */}
            {selectedSection === 'workflows' && !selectedFile && (
              <PostItTabContainer>
                <PostItTab
                  $active={workflowTab === 'main'}
                  onClick={() => setWorkflowTab('main')}
                >
                  Main
                </PostItTab>
                <PostItTab
                  $active={workflowTab === 'references'}
                  onClick={() => setWorkflowTab('references')}
                >
                  References
                </PostItTab>
              </PostItTabContainer>
            )}

            {/* View toggle for workflow Main tab and other non-skill content */}
            {!hasTabs && !selectedFile && (selectedSection !== 'workflows' || workflowTab === 'main') && (
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

            {/* Document header with edit button only */}
            <DocumentHeader>
              {user && (
                <EditButton
                  $active={false}
                  onClick={handleEnterEditMode}
                  disabled={isSaving}
                >
                  ✎ Edit
                </EditButton>
              )}
            </DocumentHeader>

            {/* Content display */}
            {selectedFile ? (
              // Show subdirectory file content
              <MarkdownRenderer
                content={subdirContent}
                onParagraphDoubleClick={handleParagraphDoubleClick}
              />
            ) : selectedSection === 'workflows' && workflowTab === 'references' ? (
              // Show workflow references panel
              <ReferencesPanel>
                {workflowReferences.length > 0 ? (
                  <ReferencesList>
                    {workflowReferences.map((file) => (
                      <ReferenceItem key={file.name}>
                        <ReferenceInfo>
                          <ReferenceIcon>📄</ReferenceIcon>
                          <ReferenceName>{file.name}</ReferenceName>
                        </ReferenceInfo>
                        <ReferenceActions>
                          <ReferenceActionButton onClick={() => handlePreviewReference(file)}>
                            Preview
                          </ReferenceActionButton>
                          <ReferenceActionButton onClick={() => handleDownloadReference(file)}>
                            ⬇️
                          </ReferenceActionButton>
                          <ReferenceActionButton onClick={() => handleDeleteReference(file)}>
                            🗑️
                          </ReferenceActionButton>
                        </ReferenceActions>
                      </ReferenceItem>
                    ))}
                  </ReferencesList>
                ) : (
                  <EmptyReferencesState>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</span>
                    <p>No reference files yet</p>
                    <p style={{ fontSize: '0.8rem' }}>Upload files to attach to this workflow</p>
                  </EmptyReferencesState>
                )}
                <UploadReferenceButton onClick={() => setIsUploadModalOpen(true)}>
                  + Upload Reference
                </UploadReferenceButton>
              </ReferencesPanel>
            ) : hasTabs ? (
              // Skills with tabs: show based on mainViewMode
              mainViewMode === 'skill.md' ? (
                <MarkdownRenderer
                  content={selectedEntryContent}
                  onParagraphDoubleClick={handleParagraphDoubleClick}
                />
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
              <MarkdownRenderer
                content={selectedEntryContent}
                onParagraphDoubleClick={handleParagraphDoubleClick}
              />
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

          {/* Inline paragraph editor overlay */}
          {editingParagraphId && (
            <InlineMarkdownEditor
              content={editingParagraphContent}
              position={paragraphPosition}
              onChange={setEditingParagraphContent}
              onSave={handleSaveParagraph}
              onCancel={handleCancelParagraphEdit}
              isSaving={isSaving}
            />
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
            user={user}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
            onDownloadClick={handleDownload}
            isDownloading={isDownloading}
            downloadError={downloadError}
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
      <SupabaseUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        activeSection={selectedSection === 'readme' ? 'workflows' : selectedSection}
        onUploadComplete={handleUploadComplete}
      />

      {/* Delete Content Modal */}
      <DeleteContentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        contentType={
          selectedSection === 'skills' ? 'skill' :
          selectedSection === 'mcp' ? 'mcp_server' :
          selectedSection === 'subagents' ? 'subagent' :
          'workflow'
        }
        items={
          selectedSection === 'skills' ? availableSkills :
          selectedSection === 'mcp' ? availableMcp :
          selectedSection === 'subagents' ? availableSubagents :
          availableWorkflows
        }
        onDeleteComplete={handleDeleteComplete}
      />

      {/* Reference Preview Modal (Images + PDFs) */}
      {previewingReference && (
        <ReferencePreviewModal onClick={() => setPreviewingReference(null)}>
          <ReferencePreviewContent onClick={(e) => e.stopPropagation()}>
            <ReferencePreviewHeader>
              <ReferencePreviewTitle>{previewingReference.name}</ReferencePreviewTitle>
              <ReferencePreviewClose onClick={() => setPreviewingReference(null)}>
                Close
              </ReferencePreviewClose>
            </ReferencePreviewHeader>
            <ReferencePreviewBody>
              {previewingReference.type === 'image' && (
                <img
                  src={previewingReference.url}
                  alt={previewingReference.name}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              )}
              {previewingReference.type === 'pdf' && (
                <iframe
                  src={previewingReference.url}
                  title={previewingReference.name}
                  style={{ width: '100%', height: '70vh', border: 'none' }}
                />
              )}
              {!previewingReference.type && previewingReference.content}
            </ReferencePreviewBody>
          </ReferencePreviewContent>
        </ReferencePreviewModal>
      )}
    </DocsContainer>
  )
}

export default Docs
