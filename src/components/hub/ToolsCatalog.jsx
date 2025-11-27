import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { carbonColors, carbonSpacing } from '../../styles/carbonTheme';
import { TOOL_CATEGORIES } from '../../data/tools';
import CarbonTable from '../carbon/CarbonTable';
import CarbonToolbar from '../carbon/CarbonToolbar';
import CarbonPagination from '../carbon/CarbonPagination';
import CarbonButton from '../carbon/CarbonButton';
import InlineFilterBar from '../carbon/InlineFilterBar';
import { fetchMcpServers } from '../../services/template-service';
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

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const ToolTitle = styled.div`
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const ToolDescription = styled.div`
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

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.$category === 'llm') return '#ddf4ff';
    if (props.$category === 'vectordb') return '#e0f2fe';
    if (props.$category === 'framework') return '#f0fdf4';
    if (props.$category === 'mcp') return '#fef3c7';
    if (props.$category === 'deployment') return '#f3e8ff';
    if (props.$category === 'monitoring') return '#fee2e2';
    if (props.$category === 'database') return '#dbeafe';
    if (props.$category === 'platform') return '#fce7f3';
    return '#f6f8fa';
  }};
  color: ${props => {
    if (props.$category === 'llm') return '#0969da';
    if (props.$category === 'vectordb') return '#0284c7';
    if (props.$category === 'framework') return '#16a34a';
    if (props.$category === 'mcp') return '#ca8a04';
    if (props.$category === 'deployment') return '#9333ea';
    if (props.$category === 'monitoring') return '#dc2626';
    if (props.$category === 'database') return '#2563eb';
    if (props.$category === 'platform') return '#db2777';
    return '#57606a';
  }};
`;

const TagsDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 200px;
`;

const Tag = styled.span`
  font-size: 0.6875rem;
  padding: 2px 6px;
  background: ${carbonColors.layer02};
  color: ${carbonColors.text02};
  border-radius: 3px;
  white-space: nowrap;
`;

// ============================================================================
// TABLE COLUMNS CONFIGURATION
// ============================================================================

const getCategoryIcon = (category) => {
  const iconMap = {
    llm: '🤖',
    vectordb: '🗄️',
    framework: '⚙️',
    mcp: '🔌',
    deployment: '🚀',
    monitoring: '📊',
    database: '💾',
    platform: '🌐'
  };
  return iconMap[category] || '🔧';
};

const getTableColumns = () => [
  {
    key: 'category',
    header: 'Type',
    width: '40px',
    align: 'center',
    sortable: true,
    render: (value) => (
      <CategoryIcon title={value}>
        {getCategoryIcon(value)}
      </CategoryIcon>
    ),
  },
  {
    key: 'name',
    header: 'Tool',
    sortable: true,
    render: (value, row) => (
      <div>
        <ToolTitle>{value}</ToolTitle>
        <ToolDescription>{row.description}</ToolDescription>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    width: '110px',
    sortable: true,
    render: (value) => {
      const categoryName = TOOL_CATEGORIES.find(cat => cat.id === value)?.name || value;
      return <CategoryBadge $category={value}>{categoryName}</CategoryBadge>;
    },
  },
  {
    key: 'tags',
    header: 'Tags',
    width: '200px',
    render: (value) => {
      if (!value || value.length === 0) return null;
      const displayTags = value.slice(0, 3);
      return (
        <TagsDisplay>
          {displayTags.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
          {value.length > 3 && <Tag>+{value.length - 3}</Tag>}
        </TagsDisplay>
      );
    },
  },
  {
    key: 'pricing',
    header: 'Pricing',
    width: '140px',
    sortable: true,
    render: (value) => (
      <div style={{ fontSize: '0.8125rem', color: carbonColors.text02 }}>
        {value || 'N/A'}
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    width: '90px',
    align: 'center',
    render: (_, row, index, { onToolView }) => (
      <ActionButtonGroup>
        <CarbonButton
          kind="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (row.installUrl) {
              window.open(row.installUrl, '_blank');
            } else {
              console.log('No install URL for:', row.name);
            }
          }}
        >
          {row.installUrl ? 'Install' : 'Info'}
        </CarbonButton>
        <CarbonButton
          kind="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToolView(row);
          }}
        >
          View
        </CarbonButton>
      </ActionButtonGroup>
    ),
  },
];

// ============================================================================
// FILTER GROUPS CONFIGURATION
// ============================================================================

const getFilterGroups = (tools) => {
  // Count tools per filter option
  const categoryCounts = {};
  const tagCounts = {};

  tools.forEach(tool => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
    tool.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return [
    {
      key: 'category',
      title: 'Category',
      options: TOOL_CATEGORIES
        .filter(cat => cat.id !== 'all')
        .map(cat => ({
          label: cat.name,
          value: cat.id,
          count: categoryCounts[cat.id] || 0
        }))
        .filter(option => option.count > 0),
    },
    {
      key: 'tags',
      title: 'Tags',
      options: Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) // Show top 10 tags
        .map(([tag, count]) => ({
          label: tag,
          value: tag,
          count
        })),
    },
  ];
};

// ============================================================================
// TOOLS CATALOG COMPONENT
// ============================================================================

export default function ToolsCatalog({
  onToolPreview,
  onToolView,
  selectedToolId,
  activeTab,
  onTabChange
}) {
  // State management
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [density, setDensity] = useState('normal');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get user from auth context
  const { user } = useAuth();

  // Fetch MCP servers from Supabase
  useEffect(() => {
    const loadMcpServers = async () => {
      try {
        setLoading(true);
        const response = await fetchMcpServers(user?.id, { limit: 100 });
        if (response.success) {
          setTools(response.mcp_servers);
          console.log('Loaded MCP servers from Supabase:', response.mcp_servers.length);
        }
      } catch (error) {
        console.error('Error fetching MCP servers:', error);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    loadMcpServers();
  }, [user?.id]);

  // Apply filters, search, and sorting
  const filteredAndSortedTools = useMemo(() => {
    let toolsData = [...tools];

    // Apply category filters
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      toolsData = toolsData.filter(tool =>
        selectedFilters.category.includes(tool.category)
      );
    }

    // Apply tag filters
    if (selectedFilters.tags && selectedFilters.tags.length > 0) {
      toolsData = toolsData.filter(tool =>
        tool.tags?.some(tag => selectedFilters.tags.includes(tag))
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      toolsData = toolsData.filter(tool =>
        tool.name?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        tool.category?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      toolsData.sort((a, b) => {
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

    return toolsData;
  }, [tools, searchQuery, selectedFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTools.length / itemsPerPage);
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTools.slice(startIndex, endIndex);
  }, [filteredAndSortedTools, currentPage, itemsPerPage]);

  // Generate active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];

    // Category filters
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      selectedFilters.category.forEach(value => {
        const categoryName = TOOL_CATEGORIES.find(cat => cat.id === value)?.name || value;
        chips.push({
          key: 'category',
          label: 'Category',
          value: categoryName,
          rawValue: value
        });
      });
    }

    // Tag filters
    if (selectedFilters.tags && selectedFilters.tags.length > 0) {
      selectedFilters.tags.forEach(value => {
        chips.push({
          key: 'tags',
          label: 'Tag',
          value: value,
          rawValue: value
        });
      });
    }

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
        newFilters[filter.key] = newFilters[filter.key].filter(v =>
          v !== (filter.rawValue || filter.value)
        );
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

  const handleRowClick = (rowData) => {
    // Show tool preview when row is clicked
    if (onToolPreview) {
      onToolPreview(rowData);
    }
  };

  const columns = getTableColumns();
  const filterGroups = getFilterGroups(tools);

  return (
    <CatalogContainer>
      {/* Toolbar */}
      <CarbonToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tools..."
        itemCount={filteredAndSortedTools.length}
        itemLabel="tools"
        showItemCount={false}
        activeFilters={activeFilterChips}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        onOpenFilters={() => setFilterPanelOpen(!filterPanelOpen)}
        onRefresh={async () => {
          setSearchQuery('');
          setSelectedFilters({});
          setCurrentPage(1);
          // Refetch tools
          try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/tools`);
            if (response.data.success) {
              setTools(response.data.tools);
            }
          } catch (error) {
            console.error('Error refreshing tools:', error);
          } finally {
            setLoading(false);
          }
        }}
        refreshing={loading}
        density={density}
        onDensityChange={setDensity}
        showDensityControls={false}
        filtersExpanded={filterPanelOpen}
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
            $active={activeTab === 'skills'}
            onClick={() => onTabChange('skills')}
            aria-label="Skills"
            title="Skills"
          >
            Skills
          </TabSwitcherButton>
          <TabSwitcherButton
            $active={activeTab === 'tools'}
            onClick={() => onTabChange('tools')}
            aria-label="Tools"
            title="Tools"
          >
            Tools
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
            render: col.render ? (value, row, index) => col.render(value, row, index, { onToolView }) : undefined,
          }))}
          data={paginatedTools}
          selectable={false}
          expandable={false}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          onRowClick={handleRowClick}
          density={density}
          highlightedRowId={selectedToolId}
          emptyState={{
            title: 'No tools found',
            description: searchQuery
              ? `No tools match your search "${searchQuery}"`
              : 'Try adjusting your filters to see more tools',
          }}
        />
      </TableSection>

      {/* Pagination */}
      {filteredAndSortedTools.length > 0 && (
        <CarbonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedTools.length}
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
