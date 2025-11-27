import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing } from '../../styles/carbonTheme';
import CarbonTable from '../carbon/CarbonTable';
import CarbonToolbar from '../carbon/CarbonToolbar';
import CarbonPagination from '../carbon/CarbonPagination';
import CarbonButton from '../carbon/CarbonButton';
import {
  getProjects,
  createProject,
  deleteProject,
  duplicateProject
} from '../../services/project-service';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const CatalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
  position: relative;
  overflow: hidden;
  border: 1px solid ${carbonColors.ui04};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const ProjectDescription = styled.div`
  font-size: 0.8125rem;
  color: ${carbonColors.text02};
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing02};
  align-items: stretch;
  justify-content: center;
  width: 100%;
`;

const ManageMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ManageDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  right: 0;
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
`;

const MenuOption = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: ${carbonColors.text01};
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
  }
`;

const TabSwitcherButtonGroup = styled.div`
  display: inline-flex;
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 4px;
  overflow: hidden;
`;

const TabSwitcherButton = styled.button`
  padding: 6px 16px;
  background: ${props => props.$active ? carbonColors.layer02 : 'transparent'};
  border: none;
  border-right: ${props => props.$isLast ? 'none' : `1px solid ${carbonColors.borderSubtle00}`};
  color: ${props => props.$active ? carbonColors.text01 : carbonColors.text02};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? 600 : 400};

  &:hover {
    background: ${carbonColors.hoverUI};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
    z-index: 1;
  }
`;

const ItemCountBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #e0f2fe;
  color: #0284c7;
`;

const ProviderBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${carbonColors.layer02};
  color: ${carbonColors.text02};
  border: 1px solid ${carbonColors.borderSubtle01};
`;

const DateText = styled.div`
  font-size: 0.8125rem;
  color: ${carbonColors.text02};
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${carbonSpacing.spacing09};
  text-align: center;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing03};
`;

const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: ${carbonColors.text02};
  margin-bottom: ${carbonSpacing.spacing05};
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const getItemCount = (project) => {
  return project.nodes?.length || 0;
};

// ============================================================================
// TABLE COLUMNS CONFIGURATION
// ============================================================================

const getTableColumns = () => [
  {
    key: 'provider',
    header: 'Provider',
    width: '100px',
    align: 'center',
    sortable: true,
    render: (value) => (
      <ProviderBadge>
        {value || 'Local'}
      </ProviderBadge>
    ),
  },
  {
    key: 'name',
    header: 'Project',
    sortable: true,
    render: (value, row) => (
      <div>
        <ProjectTitle>{value}</ProjectTitle>
        <ProjectDescription>{row.description || 'No description'}</ProjectDescription>
      </div>
    ),
  },
  {
    key: 'items',
    header: 'Items',
    width: '80px',
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <ItemCountBadge>
        {getItemCount(row)} items
      </ItemCountBadge>
    ),
  },
  {
    key: 'updatedAt',
    header: 'Last Modified',
    width: '120px',
    sortable: true,
    render: (value) => <DateText>{formatDate(value)}</DateText>,
  },
  {
    key: 'action',
    header: 'Action',
    width: '100px',
    align: 'center',
    render: (_, row, index, { onProjectView, onDuplicate, onDelete, openManageMenuId, setOpenManageMenuId }) => (
      <ActionButtonGroup>
        <ManageMenuContainer data-manage-menu>
          <CarbonButton
            kind="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setOpenManageMenuId(openManageMenuId === row.id ? null : row.id);
            }}
          >
            Manage
          </CarbonButton>
          {openManageMenuId === row.id && (
            <ManageDropdown>
              <MenuOption
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenManageMenuId(null);
                  onDuplicate(row.id);
                }}
              >
                Duplicate Project
              </MenuOption>
              <MenuOption
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenManageMenuId(null);
                  onDelete(row.id);
                }}
              >
                Delete Project
              </MenuOption>
            </ManageDropdown>
          )}
        </ManageMenuContainer>
        <CarbonButton
          kind="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onProjectView(row);
          }}
        >
          Open
        </CarbonButton>
      </ActionButtonGroup>
    ),
  },
];

// ============================================================================
// PROJECTS CATALOG COMPONENT
// ============================================================================

export default function ProjectsCatalog({
  onProjectPreview,
  onProjectView,
  onProjectCreate,
  selectedProjectId,
  activeTab,
  onTabChange
}) {
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
  const [density, setDensity] = useState('normal');
  const [openManageMenuId, setOpenManageMenuId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load projects from localStorage
  const loadProjects = () => {
    setLoading(true);
    try {
      const loadedProjects = getProjects();
      setProjects(loadedProjects);
      console.log('Loaded projects:', loadedProjects.length);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Close manage dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openManageMenuId !== null) {
        // Check if click is outside all manage dropdowns
        const isClickInsideDropdown = event.target.closest('[data-manage-menu]');
        if (!isClickInsideDropdown) {
          setOpenManageMenuId(null);
        }
      }
    };

    if (openManageMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openManageMenuId]);

  // Apply search and sorting
  const filteredAndSortedProjects = useMemo(() => {
    let projectsData = [...projects];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      projectsData = projectsData.filter(project =>
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      projectsData.sort((a, b) => {
        let aVal, bVal;

        // Handle special cases
        if (sortConfig.key === 'items') {
          aVal = getItemCount(a);
          bVal = getItemCount(b);
        } else {
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
        }

        // Handle different data types
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else if (aVal instanceof Date || sortConfig.key.includes('At')) {
          const dateA = new Date(aVal);
          const dateB = new Date(bVal);
          return sortConfig.direction === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        } else {
          return sortConfig.direction === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }
      });
    }

    return projectsData;
  }, [projects, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProjects.slice(startIndex, endIndex);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  // Event handlers
  const handleRowClick = (rowData) => {
    if (onProjectPreview) {
      onProjectPreview(rowData);
    }
  };

  const handleCreateProject = () => {
    const newProject = createProject({
      name: 'New Project',
      description: 'A new project for organizing workflows, skills, and tools'
    });
    loadProjects(); // Refresh list
    if (onProjectView) {
      onProjectView(newProject); // Open the new project immediately
    }
  };

  const handleDuplicateProject = (projectId) => {
    const duplicated = duplicateProject(projectId);
    if (duplicated) {
      loadProjects(); // Refresh list
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      loadProjects(); // Refresh list
    }
  };

  const columns = getTableColumns();

  // Show loading state
  if (loading) {
    return (
      <CatalogContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: carbonColors.text02
        }}>
          Loading projects...
        </div>
      </CatalogContainer>
    );
  }

  // Show empty state when no projects exist
  if (projects.length === 0) {
    return (
      <CatalogContainer>
        {/* Toolbar */}
        <CarbonToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search projects..."
          itemCount={0}
          itemLabel="projects"
          showItemCount={false}
          onRefresh={loadProjects}
          refreshing={loading}
          density={density}
          onDensityChange={setDensity}
          showDensityControls={false}
        >
          {/* Tab Switcher */}
          <TabSwitcherButtonGroup>
            <TabSwitcherButton
              $active={activeTab === 'workflows'}
              onClick={() => onTabChange('workflows')}
              aria-label="Workflows"
              title="Workflows"
            >
              Workflows
            </TabSwitcherButton>
            <TabSwitcherButton
              $active={activeTab === 'projects'}
              $isLast
              onClick={() => onTabChange('projects')}
              aria-label="Projects"
              title="Projects"
            >
              Projects
            </TabSwitcherButton>
          </TabSwitcherButtonGroup>
        </CarbonToolbar>

        <EmptyStateContainer>
          <EmptyStateTitle>No projects yet</EmptyStateTitle>
          <EmptyStateDescription>
            Create your first project to organize workflows, skills, and tools with a visual canvas.
          </EmptyStateDescription>
          <CarbonButton kind="primary" onClick={handleCreateProject}>
            Create Project
          </CarbonButton>
        </EmptyStateContainer>
      </CatalogContainer>
    );
  }

  return (
    <CatalogContainer>
      {/* Toolbar */}
      <CarbonToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects..."
        itemCount={filteredAndSortedProjects.length}
        itemLabel="projects"
        showItemCount={false}
        onRefresh={loadProjects}
        refreshing={loading}
        density={density}
        onDensityChange={setDensity}
        showDensityControls={false}
        primaryAction={{
          label: 'New Project',
          onClick: handleCreateProject
        }}
      >
        {/* Tab Switcher */}
        <TabSwitcherButtonGroup>
          <TabSwitcherButton
            $active={activeTab === 'workflows'}
            onClick={() => onTabChange('workflows')}
            aria-label="Workflows"
            title="Workflows"
          >
            Workflows
          </TabSwitcherButton>
          <TabSwitcherButton
            $active={activeTab === 'projects'}
            $isLast
            onClick={() => onTabChange('projects')}
            aria-label="Projects"
            title="Projects"
          >
            Projects
          </TabSwitcherButton>
        </TabSwitcherButtonGroup>
      </CarbonToolbar>

      {/* Data Table */}
      <TableSection>
        <CarbonTable
          columns={columns.map(col => ({
            ...col,
            render: col.render ? (value, row, index) => col.render(value, row, index, {
              onProjectView,
              onDuplicate: handleDuplicateProject,
              onDelete: handleDeleteProject,
              openManageMenuId,
              setOpenManageMenuId
            }) : undefined,
          }))}
          data={paginatedProjects}
          selectable={false}
          expandable={false}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          onRowClick={handleRowClick}
          density={density}
          highlightedRowId={selectedProjectId}
          emptyState={{
            title: 'No projects found',
            description: searchQuery
              ? `No projects match your search "${searchQuery}"`
              : 'Try creating a new project',
          }}
        />
      </TableSection>

      {/* Pagination */}
      {filteredAndSortedProjects.length > 0 && (
        <CarbonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedProjects.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
          itemsPerPageOptions={[10, 20, 30, 50]}
        />
      )}
    </CatalogContainer>
  );
}
