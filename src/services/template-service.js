import { supabase } from '../lib/supabase';
import { parseWorkflowSteps } from '../utils/workflow-parser';

/**
 * Template Service
 * Handles fetching public templates and user instances from Supabase
 */

/**
 * Helper function to extract step titles from workflow
 * @param {Object} workflow - Workflow object with frontmatter and content fields
 * @returns {Array} Array of step title strings
 */
function extractStepTitles(workflow) {
  if (!workflow) return [];

  // Priority 1: Use frontmatter.steps array if available (from YAML frontmatter)
  if (workflow.frontmatter?.steps && Array.isArray(workflow.frontmatter.steps)) {
    return workflow.frontmatter.steps;
  }

  // Priority 2: Parse from content if available
  if (workflow.content) {
    try {
      const parsedSteps = parseWorkflowSteps(workflow.content);
      if (parsedSteps.length > 0) {
        return parsedSteps.map(s => s.title || `Step ${s.step_number}`);
      }
    } catch (error) {
      console.warn('Error parsing workflow steps:', error);
    }
  }

  return [];
}

// Fetch all workflows (templates + user instances)
export async function fetchWorkflows(userId = null, options = {}) {
  const { templatesOnly = false, limit = 100 } = options;

  try {
    let query = supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (templatesOnly) {
      // Only fetch public templates
      query = query.eq('is_template', true).is('user_id', null);
    } else if (userId) {
      // Fetch templates OR user's own workflows
      query = query.or(`is_template.eq.true,user_id.eq.${userId}`);
    } else {
      // Only templates (for non-authenticated users)
      query = query.eq('is_template', true).is('user_id', null);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Parse steps from content for each workflow
    const workflowsWithSteps = (data || []).map(workflow => ({
      ...workflow,
      steps: extractStepTitles(workflow)
    }));

    return {
      success: true,
      workflows: workflowsWithSteps,
      count: workflowsWithSteps.length
    };
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return {
      success: false,
      error: error.message,
      workflows: [],
      count: 0
    };
  }
}

// Fetch all skills (templates + user instances)
export async function fetchSkills(userId = null, options = {}) {
  const { templatesOnly = false, limit = 100 } = options;

  try {
    let query = supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false });

    if (templatesOnly) {
      query = query.eq('is_template', true).is('user_id', null);
    } else if (userId) {
      query = query.or(`is_template.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq('is_template', true).is('user_id', null);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      skills: data || [],
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching skills:', error);
    return {
      success: false,
      error: error.message,
      skills: [],
      count: 0
    };
  }
}

// Fetch all MCP servers (templates + user instances)
export async function fetchMcpServers(userId = null, options = {}) {
  const { templatesOnly = false, limit = 100 } = options;

  try {
    let query = supabase
      .from('mcp_servers')
      .select('*')
      .order('created_at', { ascending: false });

    if (templatesOnly) {
      query = query.eq('is_template', true).is('user_id', null);
    } else if (userId) {
      query = query.or(`is_template.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq('is_template', true).is('user_id', null);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      mcp_servers: data || [],
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    return {
      success: false,
      error: error.message,
      mcp_servers: [],
      count: 0
    };
  }
}

// Fetch all subagents (templates + user instances)
export async function fetchSubagents(userId = null, options = {}) {
  const { templatesOnly = false, limit = 100 } = options;

  try {
    let query = supabase
      .from('subagents')
      .select('*')
      .order('created_at', { ascending: false });

    if (templatesOnly) {
      query = query.eq('is_template', true).is('user_id', null);
    } else if (userId) {
      query = query.or(`is_template.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq('is_template', true).is('user_id', null);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      subagents: data || [],
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching subagents:', error);
    return {
      success: false,
      error: error.message,
      subagents: [],
      count: 0
    };
  }
}

// Fetch single workflow by ID with markdown content
export async function fetchWorkflowById(id) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Content is now stored directly in the database
    // For backwards compatibility, if content doesn't exist, try fetching from file
    let content = data.content || '';
    let rawContent = data.raw_content || '';
    let frontmatter = data.frontmatter || {};

    // Fallback to file fetching if database content is not available
    if (!content && data.metadata?.content_path) {
      try {
        const response = await fetch(data.metadata.content_path);
        if (response.ok) {
          rawContent = await response.text();

          // Parse frontmatter from markdown
          const frontmatterMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
          if (frontmatterMatch) {
            const yamlStr = frontmatterMatch[1];
            content = frontmatterMatch[2];

            // Simple YAML parsing
            yamlStr.split('\n').forEach(line => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > 0 && !line.startsWith(' ')) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();
                value = value.replace(/^["']|["']$/g, '');
                frontmatter[key] = value;
              }
            });
          } else {
            content = rawContent;
          }
        }
      } catch (fetchError) {
        console.warn('Failed to fetch markdown content from file:', fetchError);
      }
    }

    // Parse steps from frontmatter (preferred) or content
    const steps = extractStepTitles({ content, frontmatter });

    return {
      success: true,
      workflow: {
        ...data,
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        steps: steps
      }
    };
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return {
      success: false,
      error: error.message,
      workflow: null
    };
  }
}

// Fetch single skill by ID
export async function fetchSkillById(id) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Content is now stored directly in the database
    const content = data.content || '';
    const rawContent = data.raw_content || '';
    const frontmatter = data.frontmatter || {};

    return {
      success: true,
      skill: {
        ...data,
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter
      }
    };
  } catch (error) {
    console.error('Error fetching skill:', error);
    return {
      success: false,
      error: error.message,
      skill: null
    };
  }
}

// Fetch single MCP server by ID with content and references
export async function fetchMcpServerById(id) {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch references if they exist
    const { data: references, error: refError } = await supabase
      .from('content_references')
      .select('*')
      .eq('parent_type', 'mcp_server')
      .eq('parent_id', id)
      .order('order_index', { ascending: true });

    if (refError) {
      console.warn('Error fetching MCP server references:', refError);
    }

    return {
      success: true,
      mcp_server: {
        ...data,
        content: data.content || '',
        raw_content: data.raw_content || '',
        frontmatter: data.frontmatter || {},
        references: references || []
      }
    };
  } catch (error) {
    console.error('Error fetching MCP server:', error);
    return {
      success: false,
      error: error.message,
      mcp_server: null
    };
  }
}

// Fetch single subagent by ID with content and references
export async function fetchSubagentById(id) {
  try {
    const { data, error } = await supabase
      .from('subagents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch references if they exist
    const { data: references, error: refError } = await supabase
      .from('content_references')
      .select('*')
      .eq('parent_type', 'subagent')
      .eq('parent_id', id)
      .order('order_index', { ascending: true });

    if (refError) {
      console.warn('Error fetching subagent references:', refError);
    }

    return {
      success: true,
      subagent: {
        ...data,
        content: data.content || '',
        raw_content: data.raw_content || '',
        frontmatter: data.frontmatter || {},
        references: references || []
      }
    };
  } catch (error) {
    console.error('Error fetching subagent:', error);
    return {
      success: false,
      error: error.message,
      subagent: null
    };
  }
}

// Clone a template to create user instance
export async function cloneTemplate(templateId, templateType, userId, customizations = {}) {
  try {
    // Fetch the template
    const table = `${templateType}s`; // workflows, skills, mcp_servers, subagents
    const { data: template, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', templateId)
      .single();

    if (fetchError) throw fetchError;

    // Create user instance from template
    const userInstance = {
      ...template,
      id: undefined, // Let Supabase generate new UUID
      is_template: false,
      template_id: templateId,
      user_id: userId,
      name: customizations.name || `${template.name} (Copy)`,
      ...customizations,
      created_at: undefined, // Will be set by database
      updated_at: undefined
    };

    const { data: newInstance, error: createError } = await supabase
      .from(table)
      .insert(userInstance)
      .select()
      .single();

    if (createError) throw createError;

    return {
      success: true,
      instance: newInstance
    };
  } catch (error) {
    console.error('Error cloning template:', error);
    return {
      success: false,
      error: error.message,
      instance: null
    };
  }
}

export default {
  fetchWorkflows,
  fetchSkills,
  fetchMcpServers,
  fetchSubagents,
  fetchWorkflowById,
  fetchSkillById,
  fetchMcpServerById,
  fetchSubagentById,
  cloneTemplate
};
