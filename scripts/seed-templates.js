import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Content directories
const CONTENT_BASE = path.join(__dirname, '../public/content');
const CONTENT_TYPES = {
  workflows: 'WORKFLOW.md',
  skills: 'SKILL.md',
  mcp: 'MCP.md',
  subagents: 'SUBAGENT.md'
};

// Helper function to read manifest
function readManifest(contentType) {
  const manifestPath = path.join(CONTENT_BASE, contentType, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.warn(`⚠️  Manifest not found: ${manifestPath}`);
    return { entries: [] };
  }
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content);
}

// Helper function to find directory by ID prefix (for workflows with full names)
function findDirectoryByPrefix(contentType, entryId) {
  const typeDir = path.join(CONTENT_BASE, contentType);
  if (!fs.existsSync(typeDir)) {
    return null;
  }

  const entries = fs.readdirSync(typeDir);
  const match = entries.find(entry => {
    const fullPath = path.join(typeDir, entry);
    return fs.statSync(fullPath).isDirectory() && entry.startsWith(entryId);
  });

  return match || entryId; // fallback to exact match
}

// Helper function to read markdown file and extract frontmatter
function readMarkdownFile(contentType, entryId, filename) {
  // For workflows, find directory by prefix (e.g., workflow_20251115_008 -> workflow_20251115_008_deploy_...)
  const actualDir = contentType === 'workflows' ? findDirectoryByPrefix(contentType, entryId) : entryId;

  const filePath = path.join(CONTENT_BASE, contentType, actualDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(fileContent);

  return {
    frontmatter,
    content: markdownContent,
    relativePath: `/content/${contentType}/${actualDir}/${filename}`
  };
}

// Seed workflows
async function seedWorkflows() {
  console.log('\n📝 Seeding workflows...');
  const manifest = readManifest('workflows');

  for (const entry of manifest.entries) {
    const markdownData = readMarkdownFile('workflows', entry.id, CONTENT_TYPES.workflows);

    if (!markdownData) {
      console.warn(`⚠️  Skipping workflow ${entry.id} - file not found`);
      continue;
    }

    const workflowData = {
      is_template: true,
      user_id: null,
      name: entry.name,
      description: entry.description,
      category: entry.category,
      tags: entry.tags || [],
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      version_name: markdownData.frontmatter.version || 'v1.0',
      metadata: {
        ...markdownData.frontmatter,
        content_path: markdownData.relativePath,
        difficulty: entry.difficulty,
        original_id: entry.id
      }
    };

    const { data, error } = await supabase
      .from('workflows')
      .insert(workflowData)
      .select();

    if (error) {
      console.error(`❌ Error seeding workflow ${entry.id}:`, error.message);
    } else {
      console.log(`✅ Seeded workflow: ${entry.name}`);
    }
  }
}

// Seed skills
async function seedSkills() {
  console.log('\n🎯 Seeding skills...');
  const manifest = readManifest('skills');

  for (const entry of manifest.entries) {
    const markdownData = readMarkdownFile('skills', entry.id, CONTENT_TYPES.skills);

    if (!markdownData) {
      console.warn(`⚠️  Skipping skill ${entry.id} - file not found`);
      continue;
    }

    const skillData = {
      is_template: true,
      user_id: null,
      name: entry.name,
      description: entry.description,
      category: entry.category,
      tags: entry.tags || [],
      metadata: {
        ...markdownData.frontmatter,
        content_path: markdownData.relativePath,
        difficulty: entry.difficulty,
        original_id: entry.id,
        prompt_content: markdownData.content
      }
    };

    const { data, error} = await supabase
      .from('skills')
      .insert(skillData)
      .select();

    if (error) {
      console.error(`❌ Error seeding skill ${entry.id}:`, error.message);
    } else {
      console.log(`✅ Seeded skill: ${entry.name}`);
    }
  }
}

// Seed MCP servers
async function seedMcpServers() {
  console.log('\n🔌 Seeding MCP servers...');
  const manifest = readManifest('mcp');

  for (const entry of manifest.entries) {
    const markdownData = readMarkdownFile('mcp', entry.id, CONTENT_TYPES.mcp);

    if (!markdownData) {
      console.warn(`⚠️  Skipping MCP server ${entry.id} - file not found`);
      continue;
    }

    // For MCP servers, prefer manifest data over frontmatter (frontmatter is mock)
    const mcpData = {
      is_template: true,
      user_id: null,
      name: entry.name,
      description: entry.description,
      category: entry.category || 'uncategorized',
      tags: entry.tags || [],
      metadata: {
        content_path: markdownData.relativePath,
        difficulty: entry.difficulty,
        original_id: entry.id,
        installation_guide: markdownData.content,
        // Store frontmatter as reference only, not authoritative
        frontmatter_reference: markdownData.frontmatter
      }
    };

    const { data, error } = await supabase
      .from('mcp_servers')
      .insert(mcpData)
      .select();

    if (error) {
      console.error(`❌ Error seeding MCP server ${entry.id}:`, error.message);
    } else {
      console.log(`✅ Seeded MCP server: ${entry.name}`);
    }
  }
}

// Seed subagents
async function seedSubagents() {
  console.log('\n🤖 Seeding subagents...');
  const manifest = readManifest('subagents');

  for (const entry of manifest.entries) {
    const markdownData = readMarkdownFile('subagents', entry.id, CONTENT_TYPES.subagents);

    if (!markdownData) {
      console.warn(`⚠️  Skipping subagent ${entry.id} - file not found`);
      continue;
    }

    // For subagents, prefer manifest/schema structure over frontmatter (frontmatter is mock)
    const subagentData = {
      is_template: true,
      user_id: null,
      name: entry.name,
      description: entry.description,
      agent_type: 'specialist', // Default from schema, frontmatter not authoritative
      category: entry.category || 'general',
      tags: entry.tags || [],
      metadata: {
        content_path: markdownData.relativePath,
        difficulty: entry.difficulty,
        original_id: entry.id,
        system_prompt_content: markdownData.content,
        // Store frontmatter as reference only, not authoritative
        frontmatter_reference: markdownData.frontmatter
      }
    };

    const { data, error } = await supabase
      .from('subagents')
      .insert(subagentData)
      .select();

    if (error) {
      console.error(`❌ Error seeding subagent ${entry.id}:`, error.message);
    } else {
      console.log(`✅ Seeded subagent: ${entry.name}`);
    }
  }
}

// Main execution
async function main() {
  console.log('🌱 Starting template seeding process...');
  console.log('📍 Content base directory:', CONTENT_BASE);

  try {
    await seedWorkflows();
    await seedSkills();
    await seedMcpServers();
    await seedSubagents();

    console.log('\n✨ Template seeding complete!');
    console.log('\n📊 Verify your data in Supabase Dashboard:');
    console.log('   - Table Editor → workflows, skills, mcp_servers, subagents');
    console.log('   - Filter by: is_template = true');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
