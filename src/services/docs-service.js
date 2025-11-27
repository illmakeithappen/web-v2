/**
 * Docs Content Service
 *
 * Provides API access to documentation content (workflows, skills, tools).
 * Falls back to static files if API is unavailable.
 */

import { supabase } from '../lib/supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class DocsService {
  constructor() {
    this.baseUrl = `${API_BASE}/docs`;
    this.useApi = true; // Can be toggled for static fallback
  }

  // ================================================================
  // READ Operations
  // ================================================================

  /**
   * List all docs in a section
   * @param {string} section - 'workflows' | 'skills' | 'tools'
   * @returns {Promise<{section: string, count: number, items: Array}>}
   */
  async listSection(section) {
    if (this.useApi) {
      try {
        const response = await fetch(`${this.baseUrl}/${section}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn(`API unavailable for ${section}, falling back to static:`, error.message);
        return this._staticListFallback(section);
      }
    }
    return this._staticListFallback(section);
  }

  /**
   * Get a single document with full content
   * @param {string} section - 'workflows' | 'skills' | 'tools'
   * @param {string} docId - Document identifier
   * @returns {Promise<{metadata: Object, frontmatter: Object, content: string, raw: string}>}
   */
  async getDoc(section, docId) {
    if (this.useApi) {
      try {
        const response = await fetch(`${this.baseUrl}/${section}/${docId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Document not found: ${section}/${docId}`);
          }
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (error.message.includes('not found')) {
          throw error;
        }
        console.warn(`API unavailable for ${section}/${docId}, falling back to static:`, error.message);
        return this._staticDocFallback(section, docId);
      }
    }
    return this._staticDocFallback(section, docId);
  }

  /**
   * List files in a doc's subdirectory
   * @param {string} section
   * @param {string} docId
   * @returns {Promise<Array<{name: string, path: string, size: number, is_directory: boolean}>>}
   */
  async listDocFiles(section, docId) {
    const response = await fetch(`${this.baseUrl}/${section}/${docId}/files`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Get content of a subdirectory file
   * @param {string} section
   * @param {string} docId
   * @param {string} filePath - Relative path within doc directory
   * @returns {Promise<{file: Object, content: string}>}
   */
  async getDocFile(section, docId, filePath) {
    const response = await fetch(
      `${this.baseUrl}/${section}/${docId}/files/${encodeURIComponent(filePath)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Download a document as ZIP file
   * @param {string} section - 'workflows' | 'skills' | 'tools'
   * @param {string} docId - Document identifier
   */
  async downloadDocZip(section, docId) {
    const response = await fetch(`${this.baseUrl}/${section}/${docId}/download`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ================================================================
  // WRITE Operations
  // ================================================================

  /**
   * Create a new document
   * @param {string} section
   * @param {Object} data - {id: string, frontmatter: Object, content: string}
   * @returns {Promise<Object>}
   */
  async createDoc(section, data) {
    const response = await fetch(`${this.baseUrl}/${section}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Update an existing document
   * @param {string} section
   * @param {string} docId
   * @param {Object} data - {frontmatter?: Object, content?: string}
   * @returns {Promise<Object>}
   */
  async updateDoc(section, docId, data) {
    const response = await fetch(`${this.baseUrl}/${section}/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Delete a document
   * @param {string} section
   * @param {string} docId
   * @returns {Promise<void>}
   */
  async deleteDoc(section, docId) {
    const response = await fetch(`${this.baseUrl}/${section}/${docId}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  // ================================================================
  // SYNC Operations
  // ================================================================

  /**
   * Sync all sections to frontend/public
   * @returns {Promise<{success: boolean, sections_synced: Array, files_processed: number}>}
   */
  async syncAll() {
    const response = await fetch(`${this.baseUrl}/sync`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Sync a specific section
   * @param {string} section
   * @returns {Promise<Object>}
   */
  async syncSection(section) {
    const response = await fetch(`${this.baseUrl}/sync/${section}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  }

  // ================================================================
  // Static Fallbacks (for when API is unavailable)
  // ================================================================

  async _staticListFallback(section) {
    try {
      const response = await fetch(`/content/${section}/manifest.json`);
      if (!response.ok) throw new Error('Manifest not found');
      const data = await response.json();
      // Handle both {entries: [...]} and [...] formats
      const items = Array.isArray(data) ? data : (data.entries || []);
      return { section, count: items.length, items };
    } catch (error) {
      console.error(`Static fallback failed for ${section}:`, error);
      return { section, count: 0, items: [] };
    }
  }

  async _staticDocFallback(section, docId) {
    const fileMap = {
      workflows: 'WORKFLOW.md',
      skills: 'SKILL.md',
      tools: 'TOOL.md',
      mcp: 'MCP.md',
      subagents: 'SUBAGENT.md'
    };

    const response = await fetch(`/content/${section}/${docId}/${fileMap[section]}`);
    if (!response.ok) throw new Error(`Document not found: ${section}/${docId}`);

    const raw = await response.text();
    const { frontmatter, content } = this._parseFrontmatter(raw);

    return {
      metadata: {
        id: frontmatter.id || frontmatter.workflow_id || frontmatter.skill_id || frontmatter.tool_id || docId,
        name: frontmatter.name || docId,
        description: frontmatter.description || '',
        category: frontmatter.category || 'uncategorized',
        tags: frontmatter.tags || [],
        difficulty: frontmatter.difficulty || null,
        section,
        has_subdirectory: false,
        file_count: 0
      },
      frontmatter,
      content,
      raw
    };
  }

  _parseFrontmatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content };

    const yamlStr = match[1];
    const frontmatter = {};
    let currentKey = null;
    let currentValue = [];
    let inArray = false;

    yamlStr.split('\n').forEach(line => {
      // Check for array item
      if (line.match(/^\s+-\s+/)) {
        if (currentKey && inArray) {
          const value = line.replace(/^\s+-\s+/, '').trim().replace(/['"]/g, '');
          if (!Array.isArray(frontmatter[currentKey])) {
            frontmatter[currentKey] = [];
          }
          frontmatter[currentKey].push(value);
        }
        return;
      }

      // Check for key: value
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0 && !line.startsWith(' ')) {
        currentKey = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Handle inline arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[currentKey] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
          inArray = false;
        } else if (value === '' || value === '|') {
          // Start of array or multiline
          inArray = true;
          frontmatter[currentKey] = [];
        } else {
          frontmatter[currentKey] = value.replace(/['"]/g, '');
          inArray = false;
        }
      }
    });

    return { frontmatter, content: match[2].trim() };
  }

  // ================================================================
  // Utility Methods
  // ================================================================

  /**
   * Toggle between API and static mode
   * @param {boolean} useApi
   */
  setUseApi(useApi) {
    this.useApi = useApi;
  }

  /**
   * Check if API is available
   * @returns {Promise<boolean>}
   */
  async checkApiAvailable() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // ================================================================
  // Doc Overviews (Supabase)
  // ================================================================

  /**
   * Fetch all doc overviews from Supabase
   * Falls back to static files if Supabase fails
   * @returns {Promise<Object>} - Map of slug to content
   */
  async fetchAllOverviews() {
    try {
      const { data, error } = await supabase
        .from('doc_overviews')
        .select('slug, title, content, description')

      if (error) {
        console.warn('Supabase doc_overviews query failed, using static fallback:', error.message)
        return this._staticOverviewsFallback()
      }

      if (!data || data.length === 0) {
        console.warn('No doc_overviews found in Supabase, using static fallback')
        return this._staticOverviewsFallback()
      }

      // Convert array to map by slug
      const overviews = {}
      data.forEach(doc => {
        overviews[doc.slug] = doc.content
      })

      return overviews
    } catch (err) {
      console.warn('Error fetching doc_overviews, using static fallback:', err.message)
      return this._staticOverviewsFallback()
    }
  }

  /**
   * Fetch a single doc overview by slug
   * @param {string} slug - 'welcome' | 'workflows' | 'skills' | 'mcp' | 'subagents'
   * @returns {Promise<string>} - Markdown content
   */
  async fetchOverview(slug) {
    try {
      const { data, error } = await supabase
        .from('doc_overviews')
        .select('content')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        return this._staticOverviewFallback(slug)
      }

      return data.content
    } catch (err) {
      console.warn(`Error fetching overview ${slug}, using static fallback:`, err.message)
      return this._staticOverviewFallback(slug)
    }
  }

  /**
   * Update a doc overview in Supabase
   * @param {string} slug
   * @param {string} content - Full markdown content
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateOverview(slug, content) {
    try {
      const { error } = await supabase
        .from('doc_overviews')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('slug', slug)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Static fallback for all overviews
   * @private
   */
  async _staticOverviewsFallback() {
    const slugs = ['welcome', 'workflows', 'skills', 'mcp', 'subagents']
    const fileNames = {
      welcome: 'welcome.md',
      workflows: 'workflows.md',
      skills: 'skills.md',
      mcp: 'mcp.md',
      subagents: 'subagents.md'
    }

    const results = await Promise.all(
      slugs.map(async slug => {
        try {
          const response = await fetch(`/content/docs/${fileNames[slug]}`)
          if (response.ok) {
            return { slug, content: await response.text() }
          }
        } catch (err) {
          console.warn(`Failed to load static ${slug}:`, err.message)
        }
        return { slug, content: '' }
      })
    )

    const overviews = {}
    results.forEach(({ slug, content }) => {
      overviews[slug] = content
    })

    return overviews
  }

  /**
   * Static fallback for single overview
   * @private
   */
  async _staticOverviewFallback(slug) {
    const fileNames = {
      welcome: 'welcome.md',
      workflows: 'workflows.md',
      skills: 'skills.md',
      mcp: 'mcp.md',
      subagents: 'subagents.md'
    }

    try {
      const response = await fetch(`/content/docs/${fileNames[slug]}`)
      if (response.ok) {
        return await response.text()
      }
    } catch (err) {
      console.warn(`Failed to load static ${slug}:`, err.message)
    }

    return ''
  }
}

// Export singleton instance
export const docsService = new DocsService();
export default docsService;
