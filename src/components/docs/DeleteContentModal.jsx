import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { supabase } from '../../lib/supabase'

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
  max-width: 500px;
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
  color: #c62828;
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

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
`

const ItemRow = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fff8e1;
  }

  ${props => props.$selected && `
    background: #ffebee;
    &:hover {
      background: #ffcdd2;
    }
  `}
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #c62828;
`

const ItemName = styled.span`
  flex: 1;
  font-size: 0.9rem;
  color: #333;
`

const ItemMeta = styled.span`
  font-size: 0.75rem;
  color: #888;
`

const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SelectedCount = styled.span`
  font-size: 0.875rem;
  color: #666;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #333;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`

const DeleteButton = styled(Button)`
  background: #c62828;
  color: white;

  &:hover:not(:disabled) {
    background: #b71c1c;
  }
`

const WarningText = styled.p`
  font-size: 0.875rem;
  color: #c62828;
  background: #ffebee;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
`

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #888;
`

export default function DeleteContentModal({
  isOpen,
  onClose,
  contentType, // 'skill', 'workflow', 'mcp_server', 'subagent'
  items = [],
  onDeleteComplete
}) {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set())
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map(item => item.id)))
    }
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return

    setIsDeleting(true)
    setError(null)

    try {
      const idsToDelete = Array.from(selectedIds)

      // Get the table name based on content type
      const tableMap = {
        skill: 'skills',
        workflow: 'workflows',
        mcp_server: 'mcp_servers',
        subagent: 'subagents'
      }
      const tableName = tableMap[contentType]

      if (!tableName) {
        throw new Error(`Unknown content type: ${contentType}`)
      }

      // Delete content_references for these items first
      const { error: refError } = await supabase
        .from('content_references')
        .delete()
        .eq('parent_type', contentType)
        .in('parent_id', idsToDelete)

      if (refError) {
        console.warn('Error deleting references:', refError)
        // Continue even if references fail to delete
      }

      // Delete the main records
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .in('id', idsToDelete)

      if (deleteError) {
        throw deleteError
      }

      // Verify which items were actually deleted (RLS may have prevented some)
      const { data: remainingItems } = await supabase
        .from(tableName)
        .select('id')
        .in('id', idsToDelete)

      const remainingIds = new Set(remainingItems?.map(item => item.id) || [])
      const succeeded = idsToDelete.filter(id => !remainingIds.has(id)).map(id => ({ id }))
      const failed = idsToDelete.filter(id => remainingIds.has(id)).map(id => ({ id }))

      if (failed.length > 0) {
        console.warn('Some deletions failed:', failed)
        if (succeeded.length === 0) {
          throw new Error(`Failed to delete items. They may be protected templates or owned by another user.`)
        }
        setError(`Deleted ${succeeded.length} items. ${failed.length} items could not be deleted (protected templates or insufficient permissions).`)
      }

      // Notify parent with successfully deleted IDs
      const succeededIds = succeeded.map(r => r.id)
      if (succeededIds.length > 0) {
        onDeleteComplete?.(succeededIds)
      }

      // Close modal only if all deletions succeeded
      if (failed.length === 0) {
        onClose()
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError(err.message || 'Failed to delete items')
    } finally {
      setIsDeleting(false)
    }
  }

  const contentTypeLabel = {
    skill: 'Skill',
    workflow: 'Workflow',
    mcp_server: 'MCP Server',
    subagent: 'Subagent'
  }[contentType] || 'Item'

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <Header>
          <Title>Delete {contentTypeLabel}s</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Body>
          <WarningText>
            Warning: This action cannot be undone. Selected items and their references will be permanently deleted.
          </WarningText>

          {error && (
            <WarningText style={{ background: '#fff3e0', color: '#e65100' }}>
              Error: {error}
            </WarningText>
          )}

          {items.length === 0 ? (
            <EmptyState>No {contentTypeLabel.toLowerCase()}s available to delete.</EmptyState>
          ) : (
            <ItemList>
              <ItemRow
                $selected={selectedIds.size === items.length}
                onClick={toggleAll}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.size === items.length}
                  onChange={toggleAll}
                />
                <ItemName style={{ fontWeight: 600 }}>Select All</ItemName>
                <ItemMeta>{items.length} items</ItemMeta>
              </ItemRow>
              {items.map(item => (
                <ItemRow
                  key={item.id}
                  $selected={selectedIds.has(item.id)}
                  onClick={() => toggleSelection(item.id)}
                >
                  <Checkbox
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                  <ItemName>{item.name || item.title || item.id}</ItemName>
                  {item.is_template && (
                    <ItemMeta style={{ color: '#e65100', background: '#fff3e0', padding: '2px 6px', borderRadius: '4px' }}>
                      Protected Template
                    </ItemMeta>
                  )}
                </ItemRow>
              ))}
            </ItemList>
          )}
        </Body>

        <Footer>
          <SelectedCount>
            {selectedIds.size} of {items.length} selected
          </SelectedCount>
          <ButtonGroup>
            <CancelButton onClick={onClose} disabled={isDeleting}>
              Cancel
            </CancelButton>
            <DeleteButton
              onClick={handleDelete}
              disabled={selectedIds.size === 0 || isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
            </DeleteButton>
          </ButtonGroup>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  )
}
