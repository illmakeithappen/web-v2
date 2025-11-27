import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing } from '../../styles/carbonTheme';
import CarbonTable from '../carbon/CarbonTable';
import CarbonToolbar from '../carbon/CarbonToolbar';
import CarbonPagination from '../carbon/CarbonPagination';
import CarbonButton from '../carbon/CarbonButton';
import InlineFilterBar from '../carbon/InlineFilterBar';
import { DifficultyBadge } from '../carbon/CarbonTag';
import { fetchWorkflows } from '../../services/template-service';
import { useAuth } from '../../contexts/AuthContext';

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

const AgentLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .openai-logo {
    background: #10A37F;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .google-logo {
    background: #4285F4;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const WorkflowTitle = styled.div`
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const WorkflowDescription = styled.div`
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

const ManageMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ManageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.borderSubtle01};
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
`;

const MenuOption = styled.button`
  width: 100%;
  padding: 12px 16px;
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

// ============================================================================
// TABLE COLUMNS CONFIGURATION
// ============================================================================

const getProviderLogo = (agentName) => {
  // Determine provider based on agent name
  const isClaude = agentName?.includes('Claude');
  const isOpenAI = agentName?.includes('GPT') || agentName?.includes('ChatGPT');
  const isGoogle = agentName?.includes('Gemini');

  // Render Anthropic "A" logo for Claude agents
  if (isClaude) {
    return (
      <AgentLogo>
        <img src="/images/agents/anthropic-logo-icon.svg" alt="Anthropic" title="Anthropic" />
      </AgentLogo>
    );
  }

  // Render OpenAI logo
  if (isOpenAI) {
    return (
      <AgentLogo>
        <img src="/images/agents/openai-logo.svg" alt="OpenAI" title="OpenAI" />
      </AgentLogo>
    );
  }

  // Render Google logo
  if (isGoogle) {
    return (
      <AgentLogo>
        <img src="/images/agents/google-logo.svg" alt="Google" title="Google" />
      </AgentLogo>
    );
  }

  // Fallback for unknown providers
  return (
    <AgentLogo>
      <div className="logo-icon" title="Unknown Provider">
        ??
      </div>
    </AgentLogo>
  );
};

const getTableColumns = (handleDownloadSkills, handleUploadSkills, openManageMenu, setOpenManageMenu) => [
  {
    key: 'provider',
    header: 'Provider',
    width: '40px',
    align: 'center',
    sortable: false,
    render: (value, row) => getProviderLogo(row.agent),
  },
  {
    key: 'agent',
    header: 'Agent',
    width: '100px',
    sortable: true,
  },
  {
    key: 'title',
    header: 'Workflow',
    sortable: true,
    render: (value, row) => (
      <div>
        <WorkflowTitle>{value}</WorkflowTitle>
        <WorkflowDescription>{row.description}</WorkflowDescription>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    width: '55px',
    sortable: true,
    render: (value) => {
      const typeMap = {
        'navigate': 'Navigate',
        'educate': 'Educate',
        'deploy': 'Deploy'
      };
      return typeMap[value] || value;
    },
  },
  {
    key: 'difficulty',
    header: 'Difficulty',
    width: '85px',
    sortable: true,
    render: (value) => <DifficultyBadge difficulty={value} />,
  },
  {
    key: 'duration',
    header: 'Duration',
    width: '75px',
    sortable: true,
  },
  {
    key: 'action',
    header: 'Action',
    width: '90px',
    align: 'center',
    render: (_, row, index, { onWorkflowSelect, onWorkflowView, onWorkflowEdit }) => (
      <ActionButtonGroup>
        <ManageMenuContainer className="manage-menu-container">
          <CarbonButton
            kind="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setOpenManageMenu(openManageMenu === row.workflow_id ? null : row.workflow_id);
            }}
          >
            Manage
          </CarbonButton>
          {openManageMenu === row.workflow_id && (
            <ManageDropdown>
              <MenuOption
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadSkills(row);
                  setOpenManageMenu(null);
                }}
              >
                Download Skills & Tools
              </MenuOption>
              <MenuOption
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadSkills(row);
                  setOpenManageMenu(null);
                }}
              >
                Upload New Version
              </MenuOption>
            </ManageDropdown>
          )}
        </ManageMenuContainer>
        <CarbonButton
          kind="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onWorkflowView(row);
          }}
        >
          Start
        </CarbonButton>
      </ActionButtonGroup>
    ),
  },
];

// ============================================================================
// FILTER GROUPS CONFIGURATION
// ============================================================================

const getFilterGroups = (workflows) => {
  // Count workflows per filter option
  const typeCounts = {};
  const difficultyCounts = {};

  workflows.forEach(workflow => {
    typeCounts[workflow.type] = (typeCounts[workflow.type] || 0) + 1;
    difficultyCounts[workflow.difficulty] = (difficultyCounts[workflow.difficulty] || 0) + 1;
  });

  return [
    {
      key: 'type',
      title: 'Workflow Type',
      options: [
        { label: 'Navigate', value: 'navigate', count: typeCounts.navigate || 0 },
        { label: 'Educate', value: 'educate', count: typeCounts.educate || 0 },
        { label: 'Deploy', value: 'deploy', count: typeCounts.deploy || 0 },
      ],
    },
    {
      key: 'difficulty',
      title: 'Difficulty Level',
      options: [
        { label: 'Beginner', value: 'beginner', count: difficultyCounts.beginner || 0 },
        { label: 'Intermediate', value: 'intermediate', count: difficultyCounts.intermediate || 0 },
        { label: 'Advanced', value: 'advanced', count: difficultyCounts.advanced || 0 },
      ],
    },
  ];
};

// ============================================================================
// WORKFLOW CATALOG COMPONENT
// ============================================================================

export default function WorkflowCatalog({
  onWorkflowSelect,
  onWorkflowPreview,
  onWorkflowView,
  onWorkflowEdit,
  viewMode = 'table',
  onViewModeChange,
  onDetailView,
  selectedWorkflowId,
  activeTab,
  onTabChange
}) {
  // State management
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [density, setDensity] = useState('normal');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [openManageMenu, setOpenManageMenu] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch content for skills/tools tabs via docs-service
  const fetchSection = async (section) => {
    try {
      setLoading(true);
      const data = await docsService.listSection(section);

      // Transform from docs format to display format
      const transformedItems = (data.items || []).map(item => ({
        workflow_id: item.id,
        title: item.name,
        description: item.description || '',
        type: item.category || section,
        difficulty: item.difficulty || 'intermediate',
        duration: item.estimated_time || 'Not specified',
        agent: item.agent || 'Claude Code',
        tags: item.tags || [],
        created: item.created_date,
        steps: item.steps || [],
        status: item.status || 'active'
      }));

      setWorkflows(transformedItems);
      console.log(`Loaded ${section} via docs-service:`, transformedItems.length);
    } catch (err) {
      console.error(`Error fetching ${section}:`, err);
      setError(`Failed to load ${section}`);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  // Get user from auth context
  const { user } = useAuth();

  // Fetch workflows from Supabase
  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetchWorkflows(user?.id, { limit: 100 });

      if (response.success) {
        // Transform Supabase format to match expected workflow format
        const transformedWorkflows = response.workflows.map((workflow) => ({
          workflow_id: workflow.id,
          title: workflow.name,
          description: workflow.description || '',
          type: workflow.category || 'workflow',
          difficulty: workflow.metadata?.difficulty || workflow.tags?.find(t => ['beginner', 'intermediate', 'advanced'].includes(t)) || 'intermediate',
          duration: workflow.metadata?.estimated_time || 'Not specified',
          agent: workflow.metadata?.agent || 'Claude Code',
          tags: workflow.tags || [],
          created: workflow.metadata?.created_date || workflow.created_at,
          steps: workflow.nodes || [],
          status: workflow.metadata?.status || 'active',
          is_template: workflow.is_template,
          content_path: workflow.metadata?.content_path
        }));

        setWorkflows(transformedWorkflows);
        console.log('Loaded workflows from Supabase:', transformedWorkflows.length);
      } else {
        setError('Failed to load workflows');
        setWorkflows([]);
      }
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows from database');
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle download of skills and tools
  const handleDownloadSkills = (workflow) => {
    try {
      // Create download data
      const downloadData = {
        workflow_id: workflow.workflow_id,
        workflow_title: workflow.title,
        skills: workflow.skills || [],
        tools: workflow.tools || [],
        exported_at: new Date().toISOString()
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(downloadData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.workflow_id}_skills_tools.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Downloaded skills and tools for:', workflow.title);
    } catch (error) {
      console.error('Error downloading skills:', error);
      alert('Failed to download skills and tools');
    }
  };

  // Handle upload of skills and tools
  const handleUploadSkills = (workflow) => {
    try {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const uploadedData = JSON.parse(event.target.result);

            // Validate the uploaded data
            if (!uploadedData.skills || !uploadedData.tools) {
              alert('Invalid file format. Must contain skills and tools.');
              return;
            }

            // TODO: Send to backend API to update workflow
            console.log('Uploading skills and tools for:', workflow.title);
            console.log('New data:', uploadedData);

            alert('Upload feature will be implemented with backend API');
          } catch (error) {
            console.error('Error parsing uploaded file:', error);
            alert('Failed to parse uploaded file. Must be valid JSON.');
          }
        };

        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      console.error('Error uploading skills:', error);
      alert('Failed to upload skills and tools');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openManageMenu !== null && !event.target.closest('.manage-menu-container')) {
        setOpenManageMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openManageMenu]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'workflows') {
      loadWorkflows();
    } else if (activeTab === 'skills') {
      fetchSection('skills');
    } else if (activeTab === 'tools') {
      fetchSection('tools');
    } else if (activeTab === 'projects') {
      // Projects tab - show empty for now (no docs section for projects)
      setWorkflows([]);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.id]);

  // Apply filters, search, and sorting
  const filteredAndSortedWorkflows = useMemo(() => {
    let workflowsData = [...workflows];

    // Apply filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        workflowsData = workflowsData.filter(workflow => values.includes(workflow[key]));
      }
    });

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      workflowsData = workflowsData.filter(workflow =>
        workflow.title?.toLowerCase().includes(query) ||
        workflow.description?.toLowerCase().includes(query) ||
        workflow.agent?.toLowerCase().includes(query) ||
        workflow.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      workflowsData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle different data types
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }
      });
    }

    return workflowsData;
  }, [workflows, searchQuery, selectedFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedWorkflows.length / itemsPerPage);
  const paginatedWorkflows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedWorkflows.slice(startIndex, endIndex);
  }, [filteredAndSortedWorkflows, currentPage, itemsPerPage]);

  // Generate active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => {
          chips.push({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: value.charAt(0).toUpperCase() + value.slice(1),
          });
        });
      }
    });
    return chips;
  }, [selectedFilters]);

  // Event handlers
  const handleFilterChange = (key, values) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: values.length > 0 ? values : undefined,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filter.key]) {
        newFilters[filter.key] = newFilters[filter.key].filter(v => v !== filter.value.toLowerCase());
        if (newFilters[filter.key].length === 0) {
          delete newFilters[filter.key];
        }
      }
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const handleRowSelect = (rowData, rowIndex, checked) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(rowIndex);
      } else {
        newSet.delete(rowIndex);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(paginatedWorkflows.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowClick = (rowData) => {
    // Show workflow preview when row is clicked
    if (onWorkflowPreview) {
      onWorkflowPreview(rowData);
    }
  };

  // Batch actions for selected rows
  const batchActions = [
    {
      label: 'Export Selected',
      onClick: () => {
        const selectedWorkflows = Array.from(selectedRows).map(index => paginatedWorkflows[index]);
        console.log('Export:', selectedWorkflows);
        // TODO: Implement export functionality
      },
    },
    {
      label: 'Compare',
      onClick: () => {
        const selectedWorkflows = Array.from(selectedRows).map(index => paginatedWorkflows[index]);
        console.log('Compare:', selectedWorkflows);
        // TODO: Implement compare functionality
      },
      disabled: selectedRows.size < 2,
    },
  ];

  const columns = getTableColumns(handleDownloadSkills, handleUploadSkills, openManageMenu, setOpenManageMenu);
  const filterGroups = getFilterGroups(workflows);

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
          Loading deployment manuals...
        </div>
      </CatalogContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <CatalogContainer>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: carbonColors.text02,
          gap: carbonSpacing.spacing03
        }}>
          <div>{error}</div>
        </div>
      </CatalogContainer>
    );
  }

  return (
    <CatalogContainer>
      {/* Toolbar */}
      <CarbonToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search workflows..."
        itemCount={filteredAndSortedWorkflows.length}
        itemLabel="workflows"
        showItemCount={false}
        activeFilters={activeFilterChips}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        onOpenFilters={() => setFilterPanelOpen(!filterPanelOpen)}
        onRefresh={fetchWorkflows}
        refreshing={loading}
        density={density}
        onDensityChange={setDensity}
        showDensityControls={false}
        filtersExpanded={filterPanelOpen}
      >
        {/* Tab Switcher - only for authenticated users */}
        {onTabChange && user && (
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
        )}
      </CarbonToolbar>

      {/* Inline Filter Bar */}
      <InlineFilterBar
        isOpen={filterPanelOpen}
        filterGroups={filterGroups}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onApply={() => setFilterPanelOpen(false)}
        onReset={handleClearAllFilters}
      />

      {/* Data Table */}
      <TableSection>
        <CarbonTable
          columns={columns.map(col => ({
            ...col,
            render: col.render ? (value, row, index) => col.render(value, row, index, { onWorkflowSelect, onWorkflowView, onWorkflowEdit }) : undefined,
          }))}
          data={paginatedWorkflows}
          selectable={false}
          expandable={false}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          onRowClick={handleRowClick}
          density={density}
          highlightedRowId={selectedWorkflowId}
          emptyState={{
            title: 'No workflows found',
            description: searchQuery
              ? `No workflows match your search "${searchQuery}"`
              : 'Try adjusting your filters to see more workflows',
          }}
        />
      </TableSection>

      {/* Pagination */}
      {filteredAndSortedWorkflows.length > 0 && (
        <CarbonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedWorkflows.length}
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
