/**
 * Project Service - Supabase CRUD operations for projects
 *
 * Projects are stored in Supabase with user association.
 * Undo/redo history is stored in localStorage (session-based).
 */

import { supabase } from '../lib/supabase';

const HISTORY_PREFIX = 'gitthub_projects_history_';
const MAX_HISTORY_SIZE = 50;

// ============================================================================
// READ Operations
// ============================================================================

/**
 * Get all projects for the current user from Supabase
 * @returns {Promise<Array>} Array of project objects
 */
export const getProjects = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('No authenticated user - returning empty projects');
      return [];
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

/**
 * Get a single project by ID
 * @param {string} id - Project ID (UUID)
 * @returns {Promise<Object|null>} Project object or null if not found
 */
export const getProject = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProject:', error);
    return null;
  }
};

// ============================================================================
// WRITE Operations
// ============================================================================

/**
 * Create a new project
 * @param {Object} projectData - Project data (name, description optional)
 * @returns {Promise<Object|null>} Created project object or null on error
 */
export const createProject = async (projectData = {}) => {
  try {
    console.log('createProject: Starting...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('createProject: Auth error:', authError);
      return null;
    }

    if (!user) {
      console.error('createProject: No authenticated user - cannot create project');
      return null;
    }

    console.log('createProject: User found:', user.id);

    const newProject = {
      user_id: user.id,
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      platform: projectData.platform || 'Local',
      nodes: projectData.nodes || [],
      edges: projectData.edges || [],
      viewport: projectData.viewport || { x: 0, y: 0, zoom: 1 }
    };

    console.log('createProject: Inserting project:', newProject.name);

    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.error('createProject: Insert error:', error.message, error.details, error.hint);
      return null;
    }

    console.log('createProject: Success, project id:', data.id);

    // Initialize empty history for the new project
    localStorage.setItem(`${HISTORY_PREFIX}${data.id}`, JSON.stringify({
      past: [],
      future: []
    }));

    return data;
  } catch (error) {
    console.error('createProject: Exception:', error);
    return null;
  }
};

/**
 * Save/update a project
 * @param {Object} project - Project object with id
 * @returns {Promise<Object|null>} Updated project object or null on error
 */
export const saveProject = async (project) => {
  try {
    if (!project?.id) {
      console.error('Cannot save project without ID');
      return null;
    }

    const updateData = {
      name: project.name,
      description: project.description,
      platform: project.platform || 'Local',
      nodes: project.nodes || [],
      edges: project.edges || [],
      viewport: project.viewport || { x: 0, y: 0, zoom: 1 }
    };

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      console.error('Error saving project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveProject:', error);
    return null;
  }
};

/**
 * Delete a project by ID
 * @param {string} id - Project ID (UUID)
 * @returns {Promise<boolean>} Success status
 */
export const deleteProject = async (id) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    // Clean up history
    localStorage.removeItem(`${HISTORY_PREFIX}${id}`);

    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return false;
  }
};

/**
 * Duplicate a project
 * @param {string} id - Project ID to duplicate
 * @returns {Promise<Object|null>} New project object or null if source not found
 */
export const duplicateProject = async (id) => {
  try {
    const source = await getProject(id);
    if (!source) return null;

    return await createProject({
      name: `${source.name} (Copy)`,
      description: source.description,
      platform: source.platform || 'Local',
      nodes: JSON.parse(JSON.stringify(source.nodes || [])),
      edges: JSON.parse(JSON.stringify(source.edges || [])),
      viewport: { ...(source.viewport || { x: 0, y: 0, zoom: 1 }) }
    });
  } catch (error) {
    console.error('Error in duplicateProject:', error);
    return null;
  }
};

// ============================================================================
// EXPORT/IMPORT Operations
// ============================================================================

/**
 * Export a project to JSON string
 * @param {string} id - Project ID
 * @returns {Promise<string|null>} JSON string or null if not found
 */
export const exportProject = async (id) => {
  const project = await getProject(id);
  if (!project) return null;

  // Remove sensitive/internal fields for export
  const exportData = {
    name: project.name,
    description: project.description,
    platform: project.platform,
    nodes: project.nodes,
    edges: project.edges,
    viewport: project.viewport,
    exportedAt: new Date().toISOString()
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import a project from JSON string
 * @param {string} jsonString - JSON string of project data
 * @returns {Promise<Object|null>} Imported project or null on error
 */
export const importProject = async (jsonString) => {
  try {
    const projectData = JSON.parse(jsonString);

    // Create a new project with imported data
    return await createProject({
      name: projectData.name || 'Imported Project',
      description: projectData.description || '',
      platform: projectData.platform || 'Local',
      nodes: projectData.nodes || [],
      edges: projectData.edges || [],
      viewport: projectData.viewport || { x: 0, y: 0, zoom: 1 }
    });
  } catch (error) {
    console.error('Error importing project:', error);
    return null;
  }
};

// ============================================================================
// HISTORY Operations (localStorage - session-based)
// ============================================================================

/**
 * Save history state for undo/redo
 * @param {string} projectId - Project ID
 * @param {Object} state - Current state { nodes, edges }
 */
export const saveHistoryState = (projectId, state) => {
  try {
    const historyKey = `${HISTORY_PREFIX}${projectId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '{"past":[],"future":[]}');

    // Add current state to past, clear future
    history.past.push(JSON.parse(JSON.stringify(state)));
    history.future = [];

    // Limit history size
    if (history.past.length > MAX_HISTORY_SIZE) {
      history.past = history.past.slice(-MAX_HISTORY_SIZE);
    }

    localStorage.setItem(historyKey, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history state:', error);
  }
};

/**
 * Undo last action
 * @param {string} projectId - Project ID
 * @param {Object} currentState - Current state { nodes, edges }
 * @returns {Object|null} Previous state or null if no history
 */
export const undo = (projectId, currentState) => {
  try {
    const historyKey = `${HISTORY_PREFIX}${projectId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '{"past":[],"future":[]}');

    if (history.past.length === 0) return null;

    // Pop last state from past
    const previousState = history.past.pop();

    // Push current state to future
    history.future.push(JSON.parse(JSON.stringify(currentState)));

    localStorage.setItem(historyKey, JSON.stringify(history));
    return previousState;
  } catch (error) {
    console.error('Error during undo:', error);
    return null;
  }
};

/**
 * Redo last undone action
 * @param {string} projectId - Project ID
 * @param {Object} currentState - Current state { nodes, edges }
 * @returns {Object|null} Next state or null if no future
 */
export const redo = (projectId, currentState) => {
  try {
    const historyKey = `${HISTORY_PREFIX}${projectId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '{"past":[],"future":[]}');

    if (history.future.length === 0) return null;

    // Pop next state from future
    const nextState = history.future.pop();

    // Push current state to past
    history.past.push(JSON.parse(JSON.stringify(currentState)));

    localStorage.setItem(historyKey, JSON.stringify(history));
    return nextState;
  } catch (error) {
    console.error('Error during redo:', error);
    return null;
  }
};

/**
 * Check if undo is available
 * @param {string} projectId - Project ID
 * @returns {boolean}
 */
export const canUndo = (projectId) => {
  try {
    const historyKey = `${HISTORY_PREFIX}${projectId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '{"past":[],"future":[]}');
    return history.past.length > 0;
  } catch {
    return false;
  }
};

/**
 * Check if redo is available
 * @param {string} projectId - Project ID
 * @returns {boolean}
 */
export const canRedo = (projectId) => {
  try {
    const historyKey = `${HISTORY_PREFIX}${projectId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '{"past":[],"future":[]}');
    return history.future.length > 0;
  } catch {
    return false;
  }
};

// ============================================================================
// UTILITY Functions
// ============================================================================

/**
 * Get project count statistics
 * @returns {Promise<Object>} { total, recentCount }
 */
export const getProjectStats = async () => {
  try {
    const projects = await getProjects();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCount = projects.filter(p =>
      new Date(p.updated_at) > oneWeekAgo
    ).length;

    return {
      total: projects.length,
      recentCount
    };
  } catch (error) {
    console.error('Error in getProjectStats:', error);
    return { total: 0, recentCount: 0 };
  }
};

export default {
  getProjects,
  getProject,
  createProject,
  saveProject,
  deleteProject,
  duplicateProject,
  exportProject,
  importProject,
  saveHistoryState,
  undo,
  redo,
  canUndo,
  canRedo,
  getProjectStats
};
