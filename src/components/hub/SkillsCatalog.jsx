import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { carbonColors, carbonSpacing } from '../../styles/carbonTheme';
import CarbonTable from '../carbon/CarbonTable';
import CarbonToolbar from '../carbon/CarbonToolbar';
import CarbonPagination from '../carbon/CarbonPagination';
import CarbonButton from '../carbon/CarbonButton';
import InlineFilterBar from '../carbon/InlineFilterBar';
import { DifficultyBadge } from '../carbon/CarbonTag';

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

const SkillTitle = styled.div`
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const SkillDescription = styled.div`
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
  margin-right: 12px;
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

const TypeBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.$type === 'python') return '#ddf4ff';
    if (props.$type === 'typescript') return '#e0f2fe';
    if (props.$type === 'bash') return '#f0fdf4';
    return '#f6f8fa';
  }};
  color: ${props => {
    if (props.$type === 'python') return '#0969da';
    if (props.$type === 'typescript') return '#0284c7';
    if (props.$type === 'bash') return '#16a34a';
    return '#57606a';
  }};
`;

// ============================================================================
// TABLE COLUMNS CONFIGURATION
// ============================================================================

const getAgentLogo = (agentName) => {
  // Map agent names to their logo image paths
  const agentImages = {
    'Claude Code': '/images/agents/anthropic-logo.png',
    'Claude Desktop': '/images/agents/anthropic-logo.png',
    'ChatGPT': '/images/agents/openai-logo.svg',
    'GPT-4': '/images/agents/openai-logo.svg',
    'Gemini': '/images/agents/google-logo.svg'
  };

  const imagePath = agentImages[agentName];

  // If image exists, use it
  if (imagePath) {
    return (
      <AgentLogo>
        <img src={imagePath} alt={agentName} title={agentName} />
      </AgentLogo>
    );
  }

  // Fallback for unknown agents
  return (
    <AgentLogo>
      <div className="logo-icon" title={agentName}>
        {agentName?.substring(0, 2).toUpperCase() || '??'}
      </div>
    </AgentLogo>
  );
};

const getTableColumns = () => [
  {
    key: 'agent',
    header: 'Agent',
    width: '40px',
    align: 'center',
    sortable: true,
    render: (value) => getAgentLogo(value),
  },
  {
    key: 'skill_name',
    header: 'Skill',
    sortable: true,
    render: (value, row) => (
      <div>
        <SkillTitle>{value}</SkillTitle>
        <SkillDescription>{row.description}</SkillDescription>
      </div>
    ),
  },
  {
    key: 'skill_type',
    header: 'Type',
    width: '85px',
    sortable: true,
    render: (value) => (
      <TypeBadge $type={value}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </TypeBadge>
    ),
  },
  {
    key: 'difficulty',
    header: 'Difficulty',
    width: '85px',
    sortable: true,
    render: (value) => <DifficultyBadge difficulty={value} />,
  },
  {
    key: 'created_by',
    header: 'Author',
    width: '90px',
    sortable: true,
    render: (value) => value || 'Unknown',
  },
  {
    key: 'action',
    header: 'Action',
    width: '90px',
    align: 'center',
    render: (_, row, index, { onSkillView }) => (
      <ActionButtonGroup>
        <CarbonButton
          kind="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Edit skill:', row.skill_id);
            // TODO: Implement edit functionality
          }}
        >
          Edit
        </CarbonButton>
        <CarbonButton
          kind="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSkillView(row);
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

const getFilterGroups = (skills) => {
  // Count skills per filter option
  const typeCounts = {};
  const difficultyCounts = {};

  skills.forEach(skill => {
    typeCounts[skill.skill_type] = (typeCounts[skill.skill_type] || 0) + 1;
    difficultyCounts[skill.difficulty] = (difficultyCounts[skill.difficulty] || 0) + 1;
  });

  return [
    {
      key: 'skill_type',
      title: 'Skill Type',
      options: [
        { label: 'Python', value: 'python', count: typeCounts.python || 0 },
        { label: 'TypeScript', value: 'typescript', count: typeCounts.typescript || 0 },
        { label: 'Bash', value: 'bash', count: typeCounts.bash || 0 },
        { label: 'General', value: 'general', count: typeCounts.general || 0 },
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
// SKILLS CATALOG COMPONENT
// ============================================================================

export default function SkillsCatalog({
  onSkillPreview,
  onSkillView,
  selectedSkillId,
  activeTab,
  onTabChange
}) {
  // State management
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [density, setDensity] = useState('normal');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/v1/skills`, {
        params: {
          limit: 100 // Get all skills
        }
      });

      if (response.data.success) {
        setSkills(response.data.skills);
        console.log('Loaded skills:', response.data.skills.length);
      } else {
        setError('Failed to load skills');
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills from server');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Apply filters, search, and sorting
  const filteredAndSortedSkills = useMemo(() => {
    let skillsData = [...skills];

    // Apply filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        skillsData = skillsData.filter(skill => values.includes(skill[key]));
      }
    });

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      skillsData = skillsData.filter(skill =>
        skill.skill_name?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      skillsData.sort((a, b) => {
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

    return skillsData;
  }, [skills, searchQuery, selectedFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);
  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedSkills.slice(startIndex, endIndex);
  }, [filteredAndSortedSkills, currentPage, itemsPerPage]);

  // Generate active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => {
          chips.push({
            key,
            label: key === 'skill_type' ? 'Type' : 'Difficulty',
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

  const handleRowClick = (rowData) => {
    // Show skill preview when row is clicked
    if (onSkillPreview) {
      onSkillPreview(rowData);
    }
  };

  const columns = getTableColumns();
  const filterGroups = getFilterGroups(skills);

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
          Loading skills...
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
        searchPlaceholder="Search skills..."
        itemCount={filteredAndSortedSkills.length}
        itemLabel="skills"
        showItemCount={false}
        activeFilters={activeFilterChips}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        onOpenFilters={() => setFilterPanelOpen(!filterPanelOpen)}
        onRefresh={fetchSkills}
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
            $isLast
            onClick={() => onTabChange('skills')}
            aria-label="Skills"
            title="Skills"
          >
            Skills
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
            render: col.render ? (value, row, index) => col.render(value, row, index, { onSkillView }) : undefined,
          }))}
          data={paginatedSkills}
          selectable={false}
          expandable={false}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          onRowClick={handleRowClick}
          density={density}
          highlightedRowId={selectedSkillId}
          emptyState={{
            title: 'No skills found',
            description: searchQuery
              ? `No skills match your search "${searchQuery}"`
              : 'Try adjusting your filters to see more skills',
          }}
        />
      </TableSection>

      {/* Pagination */}
      {filteredAndSortedSkills.length > 0 && (
        <CarbonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedSkills.length}
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
