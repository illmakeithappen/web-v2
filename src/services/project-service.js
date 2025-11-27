/**
 * Project Service - LocalStorage CRUD operations for projects
 *
 * Projects are stored in localStorage with the following structure:
 * - gitthub_projects: Array of project objects
 * - gitthub_projects_history_{id}: Undo/redo history for each project
 */

const STORAGE_KEY = 'gitthub_projects';
const HISTORY_PREFIX = 'gitthub_projects_history_';
const MAX_HISTORY_SIZE = 50;

/**
 * Generate a unique ID for projects
 */
const generateId = () => {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all projects from localStorage
 * @returns {Array} Array of project objects
 */
export const getProjects = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading projects from localStorage:', error);
    return [];
  }
};

/**
 * Get a single project by ID
 * @param {string} id - Project ID
 * @returns {Object|null} Project object or null if not found
 */
export const getProject = (id) => {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
};

/**
 * Create a new project
 * @param {Object} projectData - Project data (name, description optional)
 * @returns {Object} Created project object
 */
export const createProject = (projectData = {}) => {
  const projects = getProjects();

  const newProject = {
    id: generateId(),
    name: projectData.name || 'Untitled Project',
    description: projectData.description || '',
    provider: projectData.provider || 'Local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: projectData.nodes || [],
    edges: projectData.edges || [],
    viewport: projectData.viewport || { x: 0, y: 0, zoom: 1 }
  };

  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  // Initialize empty history for the new project
  localStorage.setItem(`${HISTORY_PREFIX}${newProject.id}`, JSON.stringify({
    past: [],
    future: []
  }));

  return newProject;
};

/**
 * Save/update a project
 * @param {Object} project - Project object with id
 * @returns {Object} Updated project object
 */
export const saveProject = (project) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);

  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return updatedProject;
};

/**
 * Delete a project by ID
 * @param {string} id - Project ID
 * @returns {boolean} Success status
 */
export const deleteProject = (id) => {
  try {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Clean up history
    localStorage.removeItem(`${HISTORY_PREFIX}${id}`);

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

/**
 * Duplicate a project
 * @param {string} id - Project ID to duplicate
 * @returns {Object|null} New project object or null if source not found
 */
export const duplicateProject = (id) => {
  const source = getProject(id);
  if (!source) return null;

  return createProject({
    name: `${source.name} (Copy)`,
    description: source.description,
    nodes: JSON.parse(JSON.stringify(source.nodes)), // Deep clone
    edges: JSON.parse(JSON.stringify(source.edges)),
    viewport: { ...source.viewport }
  });
};

/**
 * Export a project to JSON string
 * @param {string} id - Project ID
 * @returns {string|null} JSON string or null if not found
 */
export const exportProject = (id) => {
  const project = getProject(id);
  if (!project) return null;

  return JSON.stringify(project, null, 2);
};

/**
 * Import a project from JSON string
 * @param {string} jsonString - JSON string of project data
 * @returns {Object|null} Imported project or null on error
 */
export const importProject = (jsonString) => {
  try {
    const projectData = JSON.parse(jsonString);

    // Create a new project with imported data but new ID
    return createProject({
      name: projectData.name || 'Imported Project',
      description: projectData.description || '',
      nodes: projectData.nodes || [],
      edges: projectData.edges || [],
      viewport: projectData.viewport || { x: 0, y: 0, zoom: 1 }
    });
  } catch (error) {
    console.error('Error importing project:', error);
    return null;
  }
};

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

/**
 * Get project count statistics
 * @returns {Object} { total, recentCount }
 */
export const getProjectStats = () => {
  const projects = getProjects();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentCount = projects.filter(p =>
    new Date(p.updatedAt) > oneWeekAgo
  ).length;

  return {
    total: projects.length,
    recentCount
  };
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
