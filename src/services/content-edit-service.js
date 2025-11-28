import { supabase } from '../lib/supabase';

/**
 * Content Edit Service
 * Handles updating content (workflows, skills, MCP servers, subagents)
 * and their references in the Supabase database
 */

// Update workflow content
export async function updateWorkflowContent(id, content, rawContent, frontmatter) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .update({
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      workflow: data
    };
  } catch (error) {
    console.error('Error updating workflow content:', error);
    return {
      success: false,
      error: error.message,
      workflow: null
    };
  }
}

// Update skill content
export async function updateSkillContent(id, content, rawContent, frontmatter) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .update({
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      skill: data
    };
  } catch (error) {
    console.error('Error updating skill content:', error);
    return {
      success: false,
      error: error.message,
      skill: null
    };
  }
}

// Update MCP server content
export async function updateMcpServerContent(id, content, rawContent, frontmatter) {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .update({
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      mcp_server: data
    };
  } catch (error) {
    console.error('Error updating MCP server content:', error);
    return {
      success: false,
      error: error.message,
      mcp_server: null
    };
  }
}

// Update subagent content
export async function updateSubagentContent(id, content, rawContent, frontmatter) {
  try {
    const { data, error } = await supabase
      .from('subagents')
      .update({
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      subagent: data
    };
  } catch (error) {
    console.error('Error updating subagent content:', error);
    return {
      success: false,
      error: error.message,
      subagent: null
    };
  }
}

// Update content reference (reference documentation file)
export async function updateContentReference(referenceId, content, rawContent, frontmatter) {
  try {
    const { data, error } = await supabase
      .from('content_references')
      .update({
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter,
        title: frontmatter.title || null,
        description: frontmatter.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', referenceId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      reference: data
    };
  } catch (error) {
    console.error('Error updating content reference:', error);
    return {
      success: false,
      error: error.message,
      reference: null
    };
  }
}

// Create new content reference
export async function createContentReference(parentType, parentId, name, content, rawContent, frontmatter) {
  try {
    // Get current max order_index for this parent
    const { data: existing } = await supabase
      .from('content_references')
      .select('order_index')
      .eq('parent_type', parentType)
      .eq('parent_id', parentId)
      .order('order_index', { ascending: false })
      .limit(1);

    const orderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0;

    const { data, error } = await supabase
      .from('content_references')
      .insert({
        parent_type: parentType,
        parent_id: parentId,
        name: name,
        title: frontmatter.title || name.replace('.md', ''),
        description: frontmatter.description || null,
        order_index: orderIndex,
        content: content,
        raw_content: rawContent,
        frontmatter: frontmatter
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      reference: data
    };
  } catch (error) {
    console.error('Error creating content reference:', error);
    return {
      success: false,
      error: error.message,
      reference: null
    };
  }
}

// Delete content reference
export async function deleteContentReference(referenceId) {
  try {
    const { error } = await supabase
      .from('content_references')
      .delete()
      .eq('id', referenceId);

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting content reference:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generic update function that routes to specific content type
export async function updateContent(contentType, id, content, rawContent, frontmatter) {
  switch (contentType) {
    case 'workflow':
      return updateWorkflowContent(id, content, rawContent, frontmatter);
    case 'skill':
      return updateSkillContent(id, content, rawContent, frontmatter);
    case 'mcp_server':
      return updateMcpServerContent(id, content, rawContent, frontmatter);
    case 'subagent':
      return updateSubagentContent(id, content, rawContent, frontmatter);
    default:
      return {
        success: false,
        error: `Unknown content type: ${contentType}`
      };
  }
}

// Parse frontmatter from raw markdown
export function parseFrontmatter(rawMarkdown) {
  const frontmatterMatch = rawMarkdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return {
      frontmatter: {},
      content: rawMarkdown
    };
  }

  const yamlStr = frontmatterMatch[1];
  const content = frontmatterMatch[2].trim();
  const frontmatter = {};
  let currentKey = null;
  let inArray = false;

  // YAML parser that handles arrays and basic key: value pairs
  yamlStr.split('\n').forEach(line => {
    // Check for array item (starts with -)
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && inArray) {
        const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(value);
      }
      return;
    }

    // Check for key: value
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0 && !line.startsWith(' ') && !line.startsWith('#')) {
      currentKey = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle inline arrays [item1, item2, ...]
      if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[currentKey] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        inArray = false;
      } else if (value === '' || value === '|' || value === '>') {
        // Start of array or multiline - initialize as array
        inArray = true;
        frontmatter[currentKey] = [];
      } else {
        // Remove quotes
        value = value.replace(/^["']|["']$/g, '');

        // Try to parse as number
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }

        frontmatter[currentKey] = value;
        inArray = false;
      }
    }
  });

  return { frontmatter, content };
}

// Serialize frontmatter and content back to raw markdown
export function serializeMarkdown(frontmatter, content) {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return content;
  }

  let yamlStr = '---\n';
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle arrays - use YAML list format
      yamlStr += `${key}:\n`;
      value.forEach(item => {
        yamlStr += `  - ${item}\n`;
      });
    } else {
      // Quote string values
      const quotedValue = typeof value === 'string' ? `"${value}"` : value;
      yamlStr += `${key}: ${quotedValue}\n`;
    }
  });
  yamlStr += '---\n\n';

  return yamlStr + content;
}

export default {
  updateWorkflowContent,
  updateSkillContent,
  updateMcpServerContent,
  updateSubagentContent,
  updateContentReference,
  createContentReference,
  deleteContentReference,
  updateContent,
  parseFrontmatter,
  serializeMarkdown
};
