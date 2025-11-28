import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import docsService from '../services/docs-service';
import { fetchWorkflowById } from '../services/template-service';
import { carbonColors, carbonSpacing, carbonTypography } from '../styles/carbonTheme';
import WorkflowCatalog from '../components/hub/WorkflowCatalog';
import SkillsCatalog from '../components/hub/SkillsCatalog';
import SkillContent from '../components/hub/SkillContent';
import ToolContent from '../components/hub/ToolContent';
import WorkflowContent from '../components/hub/WorkflowContent';
import ToolsCatalog from '../components/hub/ToolsCatalog';
import ProjectsCatalog from '../components/hub/ProjectsCatalog';
import ProjectContent from '../components/hub/ProjectContent';
import WorkflowPreviewModal from '../components/hub/WorkflowPreviewModal';
import ProjectPreviewModal from '../components/hub/ProjectPreviewModal';
import { duplicateProject, deleteProject } from '../services/project-service';

const HubContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${carbonColors.ui01};
  overflow: hidden;
`;

const HubContent = styled.div`
  flex: 1;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default function Hub() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load saved state from localStorage
  const getSavedHubState = () => {
    try {
      const saved = localStorage.getItem('hubPageState');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading saved hub state:', e);
      return null;
    }
  };
  const savedHubState = getSavedHubState();

  // State with localStorage restoration
  const [activeSection, setActiveSection] = useState(savedHubState?.activeSection || 'dashboard');
  const [activeTab, setActiveTab] = useState(savedHubState?.activeTab || 'workflows');
  const [pageMode, setPageMode] = useState(savedHubState?.pageMode || 'catalog');
  const [previewWorkflow, setPreviewWorkflow] = useState(savedHubState?.previewWorkflow || null);
  const [previewSkill, setPreviewSkill] = useState(savedHubState?.previewSkill || null);
  const [previewTool, setPreviewTool] = useState(savedHubState?.previewTool || null);
  const [previewProject, setPreviewProject] = useState(savedHubState?.previewProject || null);
  const [selectedSkill, setSelectedSkill] = useState(savedHubState?.selectedSkill || null);
  const [selectedTool, setSelectedTool] = useState(savedHubState?.selectedTool || null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(savedHubState?.selectedWorkflow || null);
  const [selectedProject, setSelectedProject] = useState(savedHubState?.selectedProject || null);
  const [selectedItem, setSelectedItem] = useState(savedHubState?.selectedItem || null);
  const [workflowViewMode, setWorkflowViewMode] = useState(savedHubState?.workflowViewMode || 'steps');
  const [workflowPreviewModal, setWorkflowPreviewModal] = useState({
    isOpen: false,
    workflow: null
  });
  const [projectPreviewModal, setProjectPreviewModal] = useState({
    isOpen: false,
    project: null
  });

  console.log('Hub render - activeSection:', activeSection, 'activeTab:', activeTab, 'pageMode:', pageMode);

  // Save state to localStorage when key selections change
  useEffect(() => {
    const stateToSave = {
      activeSection,
      activeTab,
      pageMode,
      previewWorkflow,
      previewSkill,
      previewTool,
      previewProject,
      selectedWorkflow,
      selectedSkill,
      selectedTool,
      selectedProject,
      selectedItem,
      workflowViewMode
    };
    try {
      localStorage.setItem('hubPageState', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving hub state:', e);
    }
  }, [activeSection, activeTab, pageMode, previewWorkflow, previewSkill, previewTool, previewProject, selectedWorkflow, selectedSkill, selectedTool, selectedProject, selectedItem, workflowViewMode]);

  // Scroll to top on mount (only if not restoring state)
  useEffect(() => {
    if (!savedHubState?.selectedWorkflow && !savedHubState?.selectedSkill) {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleSectionChange = (section) => {
    console.log('Section changed to:', section);

    // Map section to activeTab
    const sectionToTabMap = {
      'dashboard': 'dashboard',
      'workflows': 'workflows',
      'skills': 'skills',
      'tools': 'tools',
      'projects': 'projects'
    };

    let newTab = sectionToTabMap[section] || 'workflows';

    // If clicking dashboard, determine which tab to show based on current context
    if (section === 'dashboard') {
      // If viewing a workflow, return to workflows tab
      if (pageMode === 'workflow' || selectedWorkflow) {
        newTab = 'workflows';
      }
      // If viewing a skill, return to skills tab
      else if (pageMode === 'skill' || selectedSkill) {
        newTab = 'skills';
      }
      // If a tool is selected/previewed, return to tools tab
      else if (previewTool) {
        newTab = 'tools';
      }
      // If a project is selected/previewed, return to projects tab
      else if (pageMode === 'project' || selectedProject || previewProject) {
        newTab = 'projects';
      }
      // Otherwise, keep current tab or default to workflows
      else if (activeTab !== 'dashboard') {
        newTab = activeTab;
      } else {
        newTab = 'workflows';
      }
    }

    setActiveSection('dashboard'); // Always keep activeSection as dashboard
    setActiveTab(newTab);

    // Reset states when changing sections - return to catalog view
    setPageMode('catalog');
    setSelectedSkill(null);
    setSelectedWorkflow(null);
    setSelectedProject(null);
    setSelectedItem(null);

    // Don't clear preview states - keep them for the navigation pane
    // setPreviewWorkflow(null);
    // setPreviewSkill(null);
    // setPreviewTool(null);
  };

  const handleItemSelect = async (type, item) => {
    console.log('Item selected:', type, item);
    setSelectedItem(item);

    // Handle different item types
    if (type === 'workflows') {
      await handleWorkflowView(item, 'steps');
    } else if (type === 'skills') {
      await handleSkillView(item);
    } else if (type === 'tools') {
      handleToolPreview(item);
    }
  };

  const handleWorkflowPreview = (workflow) => {
    console.log('Preview workflow clicked:', workflow);
    setWorkflowPreviewModal({
      isOpen: true,
      workflow: workflow
    });
    setPreviewWorkflow(workflow); // Keep for navigation pane
  };

  const handleClosePreviewModal = () => {
    setWorkflowPreviewModal({
      isOpen: false,
      workflow: null
    });
  };

  const handlePreviewEdit = (workflow) => {
    // Navigate to docs page with workflow opened for editing
    window.location.href = `/doc?section=workflows&id=${workflow.course_id}&mode=edit`;
    handleClosePreviewModal();
  };

  const handlePreviewStart = async (workflow) => {
    // Same as current "View" button - load full workflow
    handleClosePreviewModal();
    await handleWorkflowView(workflow, 'steps');
  };

  const handleSkillPreview = (skill) => {
    console.log('Preview skill clicked:', skill);
    setPreviewSkill(skill);
  };

  const handleToolPreview = (tool) => {
    console.log('Preview tool clicked:', tool);
    setPreviewTool(tool);
  };

  const handleToolView = async (tool) => {
    console.log('View tool full page:', tool);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/v1/tools/${tool.tool_id}`);

      if (response.data.success) {
        const fullTool = response.data.tool;
        setSelectedTool(fullTool);
        setPageMode('tool');
      }
    } catch (error) {
      console.error('Error loading tool:', error);
      alert('Failed to load tool content. Please try again.');
    }
  };

  const handleBackToTools = () => {
    setPageMode('catalog');
    setSelectedTool(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear preview states when switching tabs
    if (tab === 'workflows') {
      setPreviewProject(null);
      setSelectedProject(null);
    } else if (tab === 'projects') {
      setPreviewWorkflow(null);
      setSelectedWorkflow(null);
    }
    // Reset to catalog view when switching tabs
    setPageMode('catalog');
  };

  const handleSkillView = async (skill) => {
    console.log('View skill full page:', skill);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/v1/skills/${skill.skill_id}`);

      if (response.data.success) {
        const fullSkill = response.data.skill;
        setSelectedSkill(fullSkill);
        setPageMode('skill');
      }
    } catch (error) {
      console.error('Error loading skill:', error);
      alert('Failed to load skill content. Please try again.');
    }
  };

  const handleBackToSkills = () => {
    setPageMode('catalog');
    setSelectedSkill(null);
  };

  const handleWorkflowView = async (workflow, viewMode = 'steps') => {
    console.log('View workflow full page:', workflow);
    try {
      // Use template-service to get workflow with full content from Supabase and markdown file
      const response = await fetchWorkflowById(workflow.workflow_id);

      if (!response.success || !response.workflow) {
        throw new Error('Failed to load workflow');
      }

      const data = response.workflow;

      const transformedWorkflow = {
        workflow_id: data.id,
        title: data.name,
        description: data.description,
        type: data.category,
        difficulty: data.metadata?.difficulty || 'intermediate',
        agent: data.metadata?.agent || 'Claude Code',
        created: data.metadata?.created_date || data.created_at,
        content: data.content,
        raw: data.raw,
        frontmatter: data.frontmatter,
        steps: data.metadata?.steps || [],
        estimated_time: data.metadata?.estimated_time,
        tools: data.metadata?.tools_required || [],
        skills: data.metadata?.prerequisites || []
      };

      setPreviewWorkflow(transformedWorkflow);
      setSelectedWorkflow(transformedWorkflow);
      setWorkflowViewMode(viewMode);
      setPageMode('workflow');
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert('Failed to load workflow content. Please try again.');
    }
  };

  const handleBackToWorkflows = () => {
    setPageMode('catalog');
    setSelectedWorkflow(null);
    setWorkflowViewMode('steps');
  };

  const handleWorkflowEdit = async (workflow) => {
    console.log('Edit workflow:', workflow);
    await handleWorkflowView(workflow, 'edit');
  };

  const handleWorkflowDelete = (workflowId) => {
    console.log('Workflow deleted:', workflowId);
  };

  const handleProjectPreview = (project) => {
    console.log('Preview project clicked:', project);
    setProjectPreviewModal({
      isOpen: true,
      project: project
    });
    setPreviewProject(project); // Keep for navigation pane
  };

  const handleProjectView = (project) => {
    console.log('View project full page:', project);
    setSelectedProject(project);
    setPageMode('project');
  };

  const handleBackToProjects = () => {
    setPageMode('catalog');
    setSelectedProject(null);
  };

  const handleProjectCreate = () => {
    // Will be handled by ProjectsCatalog
    console.log('Create new project');
  };

  const handleProjectDelete = (projectId) => {
    console.log('Project deleted:', projectId);
  };

  const handleCloseProjectModal = () => {
    setProjectPreviewModal({
      isOpen: false,
      project: null
    });
  };

  const handleProjectOpen = (project) => {
    handleCloseProjectModal();
    handleProjectView(project);
  };

  const handleProjectDuplicate = async (projectId) => {
    const duplicated = await duplicateProject(projectId);
    if (duplicated) {
      console.log('Project duplicated:', duplicated.name);
    }
  };

  const handleProjectExport = (projectId) => {
    // Export logic handled in modal component
    console.log('Project exported:', projectId);
  };

  const handleProjectDeleteFromModal = async (projectId) => {
    const success = await deleteProject(projectId);
    if (success) {
      console.log('Project deleted:', projectId);
      handleCloseProjectModal();
    } else {
      alert('Failed to delete project');
    }
  };

  // Render the main content based on page mode and active tab
  const renderContent = () => {
    // Full-page views (skill/workflow content)
    if (pageMode === 'skill') {
      return (
        <SkillContent
          skill={selectedSkill}
          onBack={handleBackToSkills}
        />
      );
    }

    if (pageMode === 'workflow') {
      return (
        <WorkflowContent
          workflow={selectedWorkflow}
          onBack={handleBackToWorkflows}
          onDelete={handleWorkflowDelete}
          initialViewMode={workflowViewMode}
        />
      );
    }

    if (pageMode === 'tool') {
      return (
        <ToolContent
          tool={selectedTool}
          onBack={handleBackToTools}
        />
      );
    }

    if (pageMode === 'project') {
      return (
        <ProjectContent
          project={selectedProject}
          onBack={handleBackToProjects}
          onDelete={handleProjectDelete}
        />
      );
    }

    // Catalog views based on activeTab
    if (activeTab === 'workflows') {
      return (
        <WorkflowCatalog
          onWorkflowPreview={handleWorkflowPreview}
          onWorkflowView={handleWorkflowView}
          onWorkflowEdit={handleWorkflowEdit}
          viewMode="table"
          onViewModeChange={() => {}}
          selectedWorkflowId={previewWorkflow?.workflow_id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      );
    }

    if (activeTab === 'projects') {
      return (
        <ProjectsCatalog
          onProjectPreview={handleProjectPreview}
          onProjectView={handleProjectView}
          onProjectCreate={handleProjectCreate}
          selectedProjectId={previewProject?.id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      );
    }

    return null;
  };

  return (
    <HubContainer>
      <HubContent>
        {renderContent()}
      </HubContent>

      {/* Workflow Preview Modal */}
      <WorkflowPreviewModal
        workflow={workflowPreviewModal.workflow}
        isOpen={workflowPreviewModal.isOpen}
        onClose={handleClosePreviewModal}
        onEdit={handlePreviewEdit}
        onStart={handlePreviewStart}
      />

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={projectPreviewModal.project}
        isOpen={projectPreviewModal.isOpen}
        onClose={handleCloseProjectModal}
        onOpen={handleProjectOpen}
        onDuplicate={handleProjectDuplicate}
        onDelete={handleProjectDeleteFromModal}
      />
    </HubContainer>
  );
}
