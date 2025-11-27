import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

// Styled Components
const PanelContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 12px;
  margin: 4px 8px 8px 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  padding-right: 28px;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: white;
  margin-bottom: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FFA500;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`

const SearchInputWrapper = styled.div`
  position: relative;
`

const SearchIcon = styled.span`
  position: absolute;
  right: 8px;
  top: 6px;
  font-size: 0.85rem;
  color: #999;
  pointer-events: none;
`

const Dropdown = styled.select`
  width: 100%;
  padding: 6px 8px;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: white;
  margin-bottom: 8px;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FFA500;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }

  option {
    padding: 4px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
`

const Button = styled.button`
  flex: 1;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: ${props => props.$primary
    ? 'linear-gradient(to bottom, rgba(255, 165, 0, 0.9), rgba(255, 140, 0, 1))'
    : 'linear-gradient(to bottom, rgba(240, 240, 240, 1), rgba(220, 220, 220, 1))'};
  color: ${props => props.$primary ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.$primary
      ? 'linear-gradient(to bottom, rgba(255, 165, 0, 1), rgba(255, 120, 0, 1))'
      : 'linear-gradient(to bottom, rgba(250, 250, 250, 1), rgba(230, 230, 230, 1))'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
`

function FileTreeSearchPanel({ entries, selectedEntries = [], onSelect, onClose, type = 'item' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const panelRef = useRef(null)
  const searchInputRef = useRef(null)

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [onClose])

  const handleShowSelected = () => {
    if (selectedId) {
      onSelect(selectedId)
      setSearchQuery('')
      setSelectedId('')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && selectedId) {
      handleShowSelected()
    }
  }

  return (
    <PanelContainer ref={panelRef}>
      <SearchInputWrapper>
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder={`Search ${type}s...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchIcon>🔍</SearchIcon>
      </SearchInputWrapper>

      {filteredEntries.length > 0 ? (
        <Dropdown
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          onKeyPress={handleKeyPress}
          size="5"
        >
          <option value="">-- Select a {type} --</option>
          {filteredEntries.map(entry => {
            const isSelected = selectedEntries.includes(entry.id)
            return (
              <option
                key={entry.id}
                value={entry.id}
                disabled={isSelected}
              >
                {entry.name} {isSelected ? '(already selected)' : ''}
              </option>
            )
          })}
        </Dropdown>
      ) : (
        <NoResults>No {type}s found matching "{searchQuery}"</NoResults>
      )}

      <ButtonContainer>
        <Button
          onClick={handleShowSelected}
          disabled={!selectedId}
          $primary
        >
          Show Selected
        </Button>
      </ButtonContainer>
    </PanelContainer>
  )
}

export default FileTreeSearchPanel
