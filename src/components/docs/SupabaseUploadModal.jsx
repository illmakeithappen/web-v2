import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import JSZip from 'jszip'
import { supabase } from '../../lib/supabase'
import { parseFrontmatter, serializeMarkdown } from '../../services/content-edit-service'

// Styled components (reused from UploadDocModal)
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
  max-width: 600px;
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

const FileType = styled.div`
  color: #FFA500;
  font-size: 0.75rem;
  margin-top: 2px;
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
  max-height: 300px;
  overflow-y: auto;
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

const FileList = styled.div`
  margin-top: 8px;
  padding-left: 16px;
`

const FileListItem = styled.div`
  font-size: 0.8rem;
  color: #666;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '📄 ';
  }
`

const FileBadge = styled.span`
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  background: ${props => props.$isMarkdown ? '#d4edda' : '#fff3cd'};
  color: ${props => props.$isMarkdown ? '#155724' : '#856404'};
  border: 1px solid ${props => props.$isMarkdown ? '#c3e6cb' : '#ffeaa7'};
`

const FileWarning = styled.span`
  font-size: 0.7rem;
  color: #856404;
  font-style: italic;
`

const InfoMessage = styled.div`
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 4px;
  padding: 12px;
  margin-top: 12px;
  font-size: 0.875rem;
  color: #0c5460;
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

const SuccessMessage = styled.div`
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 6px;
  padding: 12px;
  color: #060;
  font-size: 0.875rem;
  margin-top: 16px;
`

const ProgressMessage = styled.div`
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  color: #24292f;
  font-size: 0.875rem;
  margin-top: 16px;
`

const WarningMessage = styled.div`
  background: #fffbea;
  border: 1px solid #ffd666;
  border-radius: 6px;
  padding: 12px;
  color: #ad6800;
  font-size: 0.875rem;
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
`

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function SupabaseUploadModal({ isOpen, onClose, activeSection, onUploadComplete }) {
  const [section, setSection] = useState(activeSection || 'workflows')
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null) // 'markdown' or 'zip'
  const [parsedData, setParsedData] = useState(null)
  const [name, setName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const fileInputRef = useRef(null)

  // Check authentication status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkAuthStatus()
    }
  }, [isOpen])

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user?.id)
      setAuthChecked(true)
    } catch (err) {
      console.error('Auth check failed:', err)
      setIsAuthenticated(false)
      setAuthChecked(true)
    }
  }

  // Reset state when section changes
  const handleSectionChange = (e) => {
    setSection(e.target.value)
    setError(null)
  }

  // Extract and parse ZIP file
  const parseZipFile = async (zipFile) => {
    try {
      const zip = await JSZip.loadAsync(zipFile)
      let mainFile = null
      const references = []
      const subdirectoryMap = {} // Track subdirectory structure for skills

      // Determine main file name based on section
      const mainFileName = section === 'workflows' ? 'WORKFLOW.md'
        : section === 'skills' ? 'SKILL.md'
        : section === 'mcp' ? 'MCP.md'
        : section === 'subagents' ? 'SUBAGENT.md'
        : null

      // Get all files (excluding directories)
      const allFiles = Object.keys(zip.files).filter(f => !zip.files[f].dir)

      // Auto-detect parent folder structure
      let basePath = ''
      const firstFileParts = allFiles[0]?.split('/')
      if (firstFileParts && firstFileParts.length > 1) {
        const potentialBasePath = firstFileParts[0] + '/'
        // Check if all files are nested in the same parent folder
        if (allFiles.every(f => f.startsWith(potentialBasePath))) {
          basePath = potentialBasePath
          console.log(`Detected parent folder: ${basePath} - auto-stripping`)
        }
      }

      // Process all files (including non-markdown)
      for (const [filename, fileObj] of Object.entries(zip.files)) {
        if (fileObj.dir) continue

        // Skip macOS metadata files
        if (filename.includes('__MACOSX') || filename.includes('.DS_Store')) {
          continue
        }

        // Strip base path if detected
        const relativePath = basePath ? filename.replace(basePath, '') : filename
        const basename = relativePath.split('/').pop()
        const extension = basename.split('.').pop().toLowerCase()
        const isMarkdown = extension === 'md'

        // Extract content based on file type
        let content = null
        let rawContent = null
        let frontmatter = {}

        if (isMarkdown) {
          // Parse markdown files
          rawContent = await fileObj.async('text')
          const parsed = parseFrontmatter(rawContent)
          content = parsed.content
          frontmatter = parsed.frontmatter
        }
        // For non-markdown files: content stays null

        const fileData = {
          filename: basename,
          path: relativePath,
          extension: extension,
          isMarkdown: isMarkdown,
          content: content,
          rawContent: rawContent,
          frontmatter: frontmatter,
          fileType: extension
        }

        // Categorize as main file or reference
        if (basename === mainFileName) {
          mainFile = fileData
        } else if (relativePath.includes('references/')) {
          references.push(fileData)

          // For skills, track subdirectory structure
          if (section === 'skills') {
            // Extract subdirectory path (e.g., "references/examples" or "references")
            const pathParts = relativePath.split('/')
            if (pathParts[0] === 'references') {
              const subdirPath = pathParts.length > 2
                ? `${pathParts[0]}/${pathParts[1]}` // e.g., "references/examples"
                : pathParts[0] // just "references" for root-level files

              if (!subdirectoryMap[subdirPath]) {
                subdirectoryMap[subdirPath] = []
              }
              subdirectoryMap[subdirPath].push({
                filename: basename,
                path: relativePath
              })
            }
          }
        }
      }

      if (!mainFile) {
        const structure = allFiles.map(f => basePath ? f.replace(basePath, '') : f).join(', ')
        throw new Error(`ZIP must contain a ${mainFileName} file. Found structure: ${structure}`)
      }

      // Validate main file is markdown
      if (!mainFile.isMarkdown) {
        throw new Error(`Main file must be markdown (.md), found: .${mainFile.extension}`)
      }

      console.log('Upload summary:', {
        mainFile: mainFile.filename,
        markdownRefs: references.filter(r => r.isMarkdown).length,
        binaryRefs: references.filter(r => !r.isMarkdown).length,
        totalFiles: 1 + references.length,
        subdirectories: Object.keys(subdirectoryMap)
      })

      return {
        mainFile,
        references,
        subdirectoryMap,
        fileCount: 1 + references.length,
        hasNonMarkdownFiles: references.some(r => !r.isMarkdown)
      }
    } catch (err) {
      throw new Error(`Failed to parse ZIP: ${err.message}`)
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return

    const fileName = selectedFile.name.toLowerCase()
    const isZip = fileName.endsWith('.zip')
    const isMarkdown = fileName.endsWith('.md')

    // Validate file type
    if (!isZip && !isMarkdown) {
      setError('Please select a Markdown (.md) or ZIP (.zip) file')
      return
    }

    setFile(selectedFile)
    setFileType(isZip ? 'zip' : 'markdown')
    setError(null)
    setSuccess(null)

    try {
      if (isZip) {
        setUploadProgress('Parsing ZIP file...')
        const zipData = await parseZipFile(selectedFile)
        setParsedData(zipData)
        setUploadProgress('')

        // Generate name from frontmatter or ZIP filename
        const generatedName = zipData.mainFile.frontmatter.name
          || zipData.mainFile.frontmatter.title
          || selectedFile.name.replace('.zip', '')
        setName(generatedName)
      } else {
        // Single markdown file
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target.result
          const { frontmatter, content: bodyContent } = parseFrontmatter(content)

          setParsedData({
            mainFile: { frontmatter, content: bodyContent },
            references: [],
            fileCount: 1
          })

          // Generate name from frontmatter or filename
          const generatedName = frontmatter.name
            || frontmatter.title
            || selectedFile.name.replace('.md', '')
          setName(generatedName)
        }
        reader.onerror = () => {
          setError('Failed to read file')
        }
        reader.readAsText(selectedFile)
      }
    } catch (err) {
      setError(err.message)
      setParsedData(null)
    }
  }, [section])

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
    setFileType(null)
    setParsedData(null)
    setName('')
    setError(null)
    setSuccess(null)
    setUploadProgress('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload to Supabase
  const handleUpload = async () => {
    if (!file || !parsedData || !name.trim()) {
      setError('Please select a file and provide a name')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const { mainFile, references } = parsedData

      // Determine table and content type
      const table = `${section}`
      const contentType = section === 'workflows' ? 'workflow'
        : section === 'skills' ? 'skill'
        : section === 'mcp' ? 'mcp_server'
        : section === 'subagents' ? 'subagent'
        : null

      // Get current user for RLS policy compliance
      const { data: { user } } = await supabase.auth.getUser()

      // AUTHENTICATION GUARD: Require user to be logged in
      if (!user?.id) {
        setError('You must be logged in to upload content. Please sign in and try again.')
        setIsUploading(false)
        return
      }

      // Debug: Log parsed frontmatter and user
      console.log('Parsed frontmatter:', mainFile.frontmatter)
      console.log('Current user:', user)
      console.log('User ID:', user.id)

      setUploadProgress(`Creating ${section.slice(0, -1)}...`)

      // Check if record with same name already exists for this user
      const { data: existingRecords } = await supabase
        .from(table)
        .select('id, name')
        .eq('name', name.trim())
        .eq('user_id', user.id)

      let newRecord

      if (existingRecords && existingRecords.length > 0) {
        // Update existing record
        console.log(`Updating existing ${section.slice(0, -1)}: ${name.trim()}`)
        setUploadProgress(`Updating existing ${section.slice(0, -1)}...`)

        const { data: updatedRecord, error: updateError } = await supabase
          .from(table)
          .update({
            description: mainFile.frontmatter.description || '',
            category: mainFile.frontmatter.category || 'general',
            content: mainFile.content,
            raw_content: serializeMarkdown(mainFile.frontmatter, mainFile.content),
            frontmatter: mainFile.frontmatter,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecords[0].id)
          .select()
          .single()

        if (updateError) throw updateError
        newRecord = updatedRecord
        console.log('Updated record:', newRecord)
      } else {
        // Create new record
        console.log(`Creating new ${section.slice(0, -1)}: ${name.trim()}`)

        const insertData = {
          name: name.trim(),
          description: mainFile.frontmatter.description || '',
          category: mainFile.frontmatter.category || 'general',
          content: mainFile.content,
          raw_content: serializeMarkdown(mainFile.frontmatter, mainFile.content),
          frontmatter: mainFile.frontmatter,
          is_template: false,
          user_id: user.id
        }

        const { data: createdRecord, error: createError } = await supabase
          .from(table)
          .insert(insertData)
          .select()
          .single()

        if (createError) throw createError
        newRecord = createdRecord
        console.log('Created record:', newRecord)
      }

      // Upload references if any
      if (references.length > 0) {
        setUploadProgress(`Uploading ${references.length} reference file${references.length > 1 ? 's' : ''}...`)

        console.log(`Upserting ${references.length} references for ${contentType} with id: ${newRecord.id}`)

        for (let i = 0; i < references.length; i++) {
          const ref = references[i]

          // Build reference data object
          const refData = {
            parent_type: contentType,
            parent_id: newRecord.id,
            name: ref.filename,

            // Markdown files: full parsing
            title: ref.isMarkdown ? (ref.frontmatter.title || ref.filename.replace('.md', '')) : ref.filename,
            description: ref.isMarkdown ? (ref.frontmatter.description || null) : null,
            content: ref.content,           // NULL for non-markdown
            raw_content: ref.rawContent,    // NULL for non-markdown
            frontmatter: ref.frontmatter,   // {} for non-markdown

            order_index: i
          }

          // Add file type metadata if migration 004 has been applied
          // TODO: Remove this check once migration 004 is confirmed applied
          try {
            refData.file_type = ref.extension
            refData.is_markdown = ref.isMarkdown
          } catch (e) {
            // Columns don't exist yet, skip them
            console.warn('file_type and is_markdown columns not available yet - run migration 004')
          }

          // Use upsert to handle both new and existing references
          const { error: refError } = await supabase
            .from('content_references')
            .upsert(refData, {
              onConflict: 'parent_type,parent_id,name'  // Match on unique constraint
            })

          if (refError) {
            console.error(`Failed to upload reference ${ref.filename}:`, refError)

            // Check if it's an RLS policy violation
            if (refError.code === 'PGRST301' || refError.message?.includes('policy') || refError.message?.includes('permission')) {
              setError(`Permission denied: You don't have access to upload references for this ${contentType}. Please ensure you're logged in as the owner.`)
            } else {
              setError(`Failed to upload reference file "${ref.filename}": ${refError.message || 'Unknown error'}`)
            }

            // Stop upload process if reference fails
            setIsUploading(false)
            setUploadProgress('')
            return
          }
        }
      }

      setSuccess(`Successfully uploaded ${parsedData.fileCount} file${parsedData.fileCount > 1 ? 's' : ''}!`)
      setUploadProgress('')

      // Notify parent after a short delay to show success message
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete(section, newRecord.id)
        }
        handleClose()
      }, 1500)

    } catch (err) {
      console.error('Upload failed:', err)
      setError(err.message || 'Failed to upload. Please try again.')
      setUploadProgress('')
    } finally {
      setIsUploading(false)
    }
  }

  // Close modal and reset state
  const handleClose = () => {
    setFile(null)
    setFileType(null)
    setParsedData(null)
    setName('')
    setError(null)
    setSuccess(null)
    setIsDragging(false)
    setUploadProgress('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Upload to Supabase</Title>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </Header>

        <Body>
          <FormGroup>
            <Label>Section</Label>
            <Select value={section} onChange={handleSectionChange} disabled={isUploading}>
              <option value="workflows">Workflows</option>
              <option value="skills">Skills</option>
              <option value="mcp">MCP Servers</option>
              <option value="subagents">Subagents</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>File</Label>
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
                  <DropIcon>✓</DropIcon>
                  <DropText>File selected</DropText>
                </>
              ) : (
                <>
                  <DropIcon>📦</DropIcon>
                  <DropText>Drop your file here or click to browse</DropText>
                  <DropSubtext>Supports .md or .zip files with references</DropSubtext>
                </>
              )}
            </DropZone>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.zip"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {file && (
              <FilePreview>
                <FileIcon>{fileType === 'zip' ? '📦' : '📄'}</FileIcon>
                <FileInfo>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                  <FileType>
                    {fileType === 'zip'
                      ? `ZIP archive (${parsedData?.fileCount || 0} files)`
                      : 'Markdown file'}
                  </FileType>
                </FileInfo>
                <RemoveButton onClick={handleRemoveFile} disabled={isUploading}>
                  Remove
                </RemoveButton>
              </FilePreview>
            )}
          </FormGroup>

          {parsedData && (
            <>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for this content"
                  disabled={isUploading}
                />
                <IdHint>
                  This will be the display name in the Docs section
                </IdHint>
              </FormGroup>

              <MetadataPreview>
                <MetadataTitle>Metadata Preview</MetadataTitle>
                <MetadataGrid>
                  {Object.entries(parsedData.mainFile.frontmatter).slice(0, 6).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <MetadataKey>{key}:</MetadataKey>
                      <MetadataValue>
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </MetadataValue>
                    </React.Fragment>
                  ))}
                  {Object.keys(parsedData.mainFile.frontmatter).length > 6 && (
                    <>
                      <MetadataKey>...</MetadataKey>
                      <MetadataValue>
                        {Object.keys(parsedData.mainFile.frontmatter).length - 6} more fields
                      </MetadataValue>
                    </>
                  )}
                </MetadataGrid>

                {parsedData.references.length > 0 && (
                  <>
                    <MetadataTitle style={{ marginTop: 16 }}>
                      Reference Files ({parsedData.references.length})
                    </MetadataTitle>
                    <FileList>
                      {parsedData.references.map((ref, idx) => (
                        <FileListItem key={idx}>
                          <span>{ref.filename}</span>
                          <FileBadge $isMarkdown={ref.isMarkdown}>
                            {ref.isMarkdown ? 'MD' : ref.extension.toUpperCase()}
                          </FileBadge>
                          {!ref.isMarkdown && <FileWarning>Filename only</FileWarning>}
                        </FileListItem>
                      ))}
                    </FileList>
                    {parsedData.hasNonMarkdownFiles && (
                      <InfoMessage>
                        Note: {parsedData.references.filter(r => !r.isMarkdown).length} non-markdown file{parsedData.references.filter(r => !r.isMarkdown).length > 1 ? 's' : ''} will be stored as filename{parsedData.references.filter(r => !r.isMarkdown).length > 1 ? 's' : ''} only (no content).
                      </InfoMessage>
                    )}
                  </>
                )}
              </MetadataPreview>
            </>
          )}

          {uploadProgress && <ProgressMessage>{uploadProgress}</ProgressMessage>}
          {authChecked && !isAuthenticated && !error && (
            <WarningMessage>
              You must be logged in to upload content. Please sign in to continue.
            </WarningMessage>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Body>

        <Footer>
          <CancelButton onClick={handleClose} disabled={isUploading}>
            Cancel
          </CancelButton>
          <UploadButton
            onClick={handleUpload}
            disabled={!file || !name.trim() || isUploading || !isAuthenticated}
            title={!isAuthenticated ? 'Please sign in to upload' : ''}
          >
            {isUploading ? 'Uploading...' : !isAuthenticated ? 'Sign in to Upload' : 'Upload to Supabase'}
          </UploadButton>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  )
}

export default SupabaseUploadModal
