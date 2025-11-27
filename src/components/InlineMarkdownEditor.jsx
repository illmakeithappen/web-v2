import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const OverlayContainer = styled.div`
  position: absolute;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  min-height: ${props => props.$height}px;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid #FFA500;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MarkdownTextarea = styled.textarea`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #24292f;
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  width: 100%;
  min-height: ${props => props.$minHeight}px;
  max-height: 600px;
  padding: 0;
  margin: 0;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  /* Match paragraph styling */
  &::placeholder {
    color: #6e7781;
    opacity: 0.6;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`

const Button = styled.button`
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const SaveButton = styled(Button)`
  background: #FFA500;
  border-color: #FFA500;
  color: white;

  &:hover:not(:disabled) {
    background: #ff8c00;
    border-color: #ff8c00;
  }
`

const CancelButton = styled(Button)`
  background: white;
  border-color: #d0d7de;
  color: #24292f;

  &:hover:not(:disabled) {
    background: #f6f8fa;
    border-color: #8c959f;
  }
`

const KeyboardHint = styled.div`
  font-size: 0.75rem;
  color: #6e7781;
  padding: 4px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
`

/**
 * InlineMarkdownEditor - Overlay editor for paragraph-level markdown editing
 *
 * Props:
 * - content: Initial markdown content to edit
 * - position: { top, left, width, height } - Position for overlay
 * - onChange: Callback when content changes
 * - onSave: Callback when user saves (receives new content)
 * - onCancel: Callback when user cancels
 * - isSaving: Boolean indicating save in progress
 */
const InlineMarkdownEditor = ({
  content = '',
  position = { top: 0, left: 0, width: 600, height: 100 },
  onChange,
  onSave,
  onCancel,
  isSaving = false
}) => {
  const [localContent, setLocalContent] = useState(content)
  const textareaRef = useRef(null)

  // Sync local content when prop changes
  useEffect(() => {
    setLocalContent(content)
  }, [content])

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      // Place cursor at end
      const len = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Esc to cancel
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }

      // Ctrl/Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [localContent])

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    if (onChange) {
      onChange(newContent)
    }
  }

  const handleSave = () => {
    if (onSave && !isSaving) {
      onSave(localContent)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  // Detect platform for keyboard hint
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <OverlayContainer
      $top={position.top}
      $left={position.left}
      $width={position.width}
      $height={position.height}
    >
      <MarkdownTextarea
        ref={textareaRef}
        value={localContent}
        onChange={handleContentChange}
        $minHeight={position.height - 24}
        placeholder="Enter markdown content..."
        disabled={isSaving}
      />

      <KeyboardHint>
        {modKey}+S to save • Esc to cancel
      </KeyboardHint>

      <ButtonContainer>
        <CancelButton
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </CancelButton>
        <SaveButton
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </SaveButton>
      </ButtonContainer>
    </OverlayContainer>
  )
}

export default InlineMarkdownEditor
