import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import docsService from '../../services/docs-service'

// Modal overlay with blur
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2C2C2C;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`

const Body = styled.div`
  padding: 24px;
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #24292f;
  background: white;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #FFA500;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
  }
`

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#FFA500' : props.$hasFile ? '#4CAF50' : '#d0d7de'};
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  background: ${props => props.$isDragging ? 'rgba(255, 165, 0, 0.05)' : props.$hasFile ? 'rgba(76, 175, 80, 0.05)' : '#fafafa'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #FFA500;
    background: rgba(255, 165, 0, 0.05);
  }
`

const DropIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`

const DropText = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.95rem;
`

const DropSubtext = styled.p`
  margin: 8px 0 0 0;
  color: #999;
  font-size: 0.8rem;
`

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
  margin-top: 12px;
`

const FileIcon = styled.span`
  font-size: 1.5rem;
`

const FileInfo = styled.div`
  flex: 1;
  text-align: left;
`

const FileName = styled.div`
  font-weight: 500;
  color: #24292f;
  font-size: 0.9rem;
`

const FileSize = styled.div`
  color: #666;
  font-size: 0.8rem;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #d73a49;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;

  &:hover {
    background: rgba(215, 58, 73, 0.1);
  }
`

const MetadataPreview = styled.div`
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
`

const MetadataTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  color: #555;
  font-weight: 500;
`

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  font-size: 0.85rem;
`

const MetadataKey = styled.span`
  color: #666;
  font-weight: 500;
`

const MetadataValue = styled.span`
  color: #24292f;
  word-break: break-word;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #24292f;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #FFA500;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`

const IdHint = styled.p`
  margin: 6px 0 0 0;
  font-size: 0.75rem;
  color: #666;
`

const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CancelButton = styled(Button)`
  background: white;
  border: 1px solid #d0d7de;
  color: #24292f;

  &:hover:not(:disabled) {
    background: #f6f8fa;
    border-color: #999;
  }
`

const UploadButton = styled(Button)`
  background: #FFA500;
  border: 1px solid #FFA500;
  color: white;

  &:hover:not(:disabled) {
    background: #e69500;
    border-color: #e69500;
  }
`

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px;
  color: #c00;
  font-size: 0.875rem;
  margin-top: 16px;
`

// Parse YAML frontmatter from markdown content
const parseFrontmatter = (content) => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content }

  const yamlStr = match[1]
  const frontmatter = {}
  let currentKey = null
  let inArray = false

  yamlStr.split('\n').forEach(line => {
    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && inArray) {
        const value = line.replace(/^\s+-\s+/, '').trim().replace(/['\"]/g, '')
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = []
        }
        frontmatter[currentKey].push(value)
      }
      return
    }

    // Check for key: value
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0 && !line.startsWith(' ')) {
      currentKey = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // Handle inline arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[currentKey] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['\"]/g, ''))
        inArray = false
      } else if (value === '' || value === '|') {
        // Start of array or multiline
        inArray = true
        frontmatter[currentKey] = []
      } else {
        frontmatter[currentKey] = value.replace(/['\"]/g, '')
        inArray = false
      }
    }
  })

  return { frontmatter, content: match[2].trim() }
}

// Generate URL-safe ID from filename or name
const generateId = (filename, name) => {
  const base = name || filename.replace(/\.md$/i, '')
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadDocModal({ isOpen, onClose, activeSection, onUploadComplete }) {
  const [section, setSection] = useState(activeSection || 'workflows')
  const [file, setFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [docId, setDocId] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Reset state when section changes
  const handleSectionChange = (e) => {
    setSection(e.target.value)
    setError(null)
  }

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.name.endsWith('.md')) {
      setError('Please select a Markdown (.md) file')
      return
    }

    setFile(selectedFile)
    setError(null)

    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      setFileContent(content)

      // Parse frontmatter
      const { frontmatter, content: bodyContent } = parseFrontmatter(content)
      setParsedData({ frontmatter, content: bodyContent })

      // Generate ID from filename or frontmatter name
      const generatedId = generateId(selectedFile.name, frontmatter.name)
      setDocId(generatedId)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(selectedFile)
  }, [])

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }

  // Click to select file
  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0])
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null)
    setFileContent('')
    setParsedData(null)
    setDocId('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload document
  const handleUpload = async () => {
    if (!file || !parsedData || !docId) {
      setError('Please select a file and provide a document ID')
      return
    }

    // Validate ID format
    if (!/^[a-z0-9_-]+$/.test(docId)) {
      setError('ID must contain only lowercase letters, numbers, hyphens, and underscores')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result = await docsService.createDoc(section, {
        id: docId,
        frontmatter: parsedData.frontmatter,
        content: parsedData.content
      })

      console.log('Document created:', result)

      // Notify parent and close
      if (onUploadComplete) {
        onUploadComplete(section, docId)
      }
      onClose()
    } catch (err) {
      console.error('Upload failed:', err)
      setError(err.message || 'Failed to upload document. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Close modal and reset state
  const handleClose = () => {
    setFile(null)
    setFileContent('')
    setParsedData(null)
    setDocId('')
    setError(null)
    setIsDragging(false)
    onClose()
  }

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={handleClose} onKeyDown={handleKeyDown}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Upload Document</Title>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </Header>

        <Body>
          <FormGroup>
            <Label>Section</Label>
            <Select value={section} onChange={handleSectionChange}>
              <option value="workflows">Workflows</option>
              <option value="skills">Skills</option>
              <option value="tools">Tools</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Markdown File</Label>
            <DropZone
              $isDragging={isDragging}
              $hasFile={!!file}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
            >
              {file ? (
                <>
                  <DropIcon>&#10003;</DropIcon>
                  <DropText>File selected</DropText>
                </>
              ) : (
                <>
                  <DropIcon>&#128196;</DropIcon>
                  <DropText>Drop your .md file here or click to browse</DropText>
                  <DropSubtext>Supports Markdown files with YAML frontmatter</DropSubtext>
                </>
              )}
            </DropZone>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {file && (
              <FilePreview>
                <FileIcon>&#128196;</FileIcon>
                <FileInfo>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                </FileInfo>
                <RemoveButton onClick={handleRemoveFile}>Remove</RemoveButton>
              </FilePreview>
            )}
          </FormGroup>

          {parsedData && (
            <>
              <MetadataPreview>
                <MetadataTitle>Extracted Metadata</MetadataTitle>
                <MetadataGrid>
                  {Object.entries(parsedData.frontmatter).slice(0, 6).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <MetadataKey>{key}:</MetadataKey>
                      <MetadataValue>
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </MetadataValue>
                    </React.Fragment>
                  ))}
                  {Object.keys(parsedData.frontmatter).length > 6 && (
                    <>
                      <MetadataKey>...</MetadataKey>
                      <MetadataValue>
                        {Object.keys(parsedData.frontmatter).length - 6} more fields
                      </MetadataValue>
                    </>
                  )}
                </MetadataGrid>
              </MetadataPreview>

              <FormGroup style={{ marginTop: 20 }}>
                <Label>Document ID</Label>
                <Input
                  type="text"
                  value={docId}
                  onChange={(e) => setDocId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                  placeholder="my-document-id"
                />
                <IdHint>
                  This will be the folder name. Use lowercase letters, numbers, hyphens, and underscores only.
                </IdHint>
              </FormGroup>
            </>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Body>

        <Footer>
          <CancelButton onClick={handleClose} disabled={isUploading}>
            Cancel
          </CancelButton>
          <UploadButton
            onClick={handleUpload}
            disabled={!file || !docId || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </UploadButton>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  )
}

export default UploadDocModal
