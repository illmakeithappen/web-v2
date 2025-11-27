#!/usr/bin/env node

/**
 * Content Addition Pipeline
 * Automates the process of adding workflows, skills, and tools to gitthub.org
 *
 * Usage:
 *   node scripts/add-content.js workflow path/to/workflow.md
 *   node scripts/add-content.js skill path/to/skill.md
 *   node scripts/add-content.js tool path/to/tool.md
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_BASE = path.join(__dirname, '../frontend/public/content');
const CONTENT_TYPES = {
  workflow: {
    dir: 'workflows',
    filename: 'WORKFLOW.md',
    manifestPath: path.join(CONTENT_BASE, 'workflows/manifest.json'),
    requiredFields: ['title', 'description', 'type', 'difficulty']
  },
  skill: {
    dir: 'skills',
    filename: 'SKILL.md',
    manifestPath: path.join(CONTENT_BASE, 'skills/manifest.json'),
    requiredFields: ['title', 'description', 'category']
  },
  tool: {
    dir: 'tools',
    filename: 'TOOL.md',
    manifestPath: path.join(CONTENT_BASE, 'tools/manifest.json'),
    requiredFields: ['title', 'description', 'category']
  }
};

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: content };
  }

  const frontmatterText = match[1];
  const body = content.slice(match[0].length).trim();

  // Parse YAML-like frontmatter
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentArray = null;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Handle array items
    if (line.startsWith('- ')) {
      if (currentArray) {
        currentArray.push(line.slice(2).replace(/^["']|["']$/g, ''));
      }
      return;
    }

    // Handle key-value pairs
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      // Check if this starts an array
      if (value === '' || value === '[]') {
        currentArray = [];
        frontmatter[currentKey] = currentArray;
      } else {
        frontmatter[currentKey] = value;
        currentArray = null;
      }
    }
  });

  return { frontmatter, body };
}

/**
 * Generate workflow ID from title and date
 */
function generateWorkflowId(title, existingIds = []) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

  // Find next available number for this date
  let counter = 1;
  const prefix = `workflow_${dateStr}`;

  while (existingIds.includes(`${prefix}_${String(counter).padStart(3, '0')}`)) {
    counter++;
  }

  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50);

  return `${prefix}_${String(counter).padStart(3, '0')}_${slug}`;
}

/**
 * Generate skill/tool ID from name
 */
function generateId(name, type, existingIds = []) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let id = slug;
  let counter = 1;

  while (existingIds.includes(id)) {
    id = `${slug}-${counter}`;
    counter++;
  }

  return id;
}

/**
 * Validate frontmatter fields
 */
function validateFrontmatter(frontmatter, requiredFields, contentType) {
  const errors = [];

  if (!frontmatter) {
    errors.push('No frontmatter found. Frontmatter must be enclosed in --- markers.');
    return errors;
  }

  requiredFields.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return errors;
}

/**
 * Create manifest entry from frontmatter
 */
function createManifestEntry(frontmatter, id, contentType) {
  const entry = { id };

  // Map frontmatter to manifest fields based on content type
  if (contentType === 'workflow') {
    entry.name = frontmatter.title;
    entry.description = frontmatter.description;
    entry.type = frontmatter.type || 'deploy';
    entry.difficulty = frontmatter.difficulty;
    entry.category = frontmatter.category || 'workflow';

    if (frontmatter.estimated_time) {
      entry.estimated_time = frontmatter.estimated_time;
    }

    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      entry.tags = frontmatter.tags;
    }
  } else if (contentType === 'skill') {
    entry.name = frontmatter.title;
    entry.description = frontmatter.description || '';
    entry.category = frontmatter.category || 'skill';
    entry.difficulty = frontmatter.difficulty || 'intermediate';
    entry.skill_type = frontmatter.skill_type || frontmatter.category;

    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      entry.tags = frontmatter.tags;
    }
  } else if (contentType === 'tool') {
    entry.name = frontmatter.title;
    entry.description = frontmatter.description || '';
    entry.category = frontmatter.category || 'tool';

    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      entry.tags = frontmatter.tags;
    }
  }

  return entry;
}

/**
 * Update manifest.json with new entry
 */
function updateManifest(manifestPath, newEntry) {
  let manifest = { entries: [] };

  // Read existing manifest if it exists
  if (fs.existsSync(manifestPath)) {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(manifestContent);
  }

  // Check if entry already exists
  const existingIndex = manifest.entries.findIndex(e => e.id === newEntry.id);

  if (existingIndex >= 0) {
    console.log(`  ⚠️  Entry "${newEntry.id}" already exists. Updating...`);
    manifest.entries[existingIndex] = newEntry;
  } else {
    console.log(`  ✅ Adding new entry to manifest`);
    manifest.entries.unshift(newEntry); // Add to beginning
  }

  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  return existingIndex >= 0 ? 'updated' : 'added';
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('❌ Usage: node scripts/add-content.js <type> <file>');
    console.error('   Types: workflow, skill, tool');
    console.error('   Example: node scripts/add-content.js workflow my-workflow.md');
    process.exit(1);
  }

  const contentType = args[0].toLowerCase();
  const sourceFile = args[1];

  // Validate content type
  if (!CONTENT_TYPES[contentType]) {
    console.error(`❌ Invalid content type: ${contentType}`);
    console.error(`   Valid types: ${Object.keys(CONTENT_TYPES).join(', ')}`);
    process.exit(1);
  }

  const config = CONTENT_TYPES[contentType];

  // Validate source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ File not found: ${sourceFile}`);
    process.exit(1);
  }

  console.log(`\n📝 Processing ${contentType}: ${path.basename(sourceFile)}\n`);

  // Read and parse file
  const content = fs.readFileSync(sourceFile, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  // Validate frontmatter
  const errors = validateFrontmatter(frontmatter, config.requiredFields, contentType);

  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }

  console.log('✅ Frontmatter validation passed');

  // Load existing manifest to get existing IDs
  let manifest = { entries: [] };
  if (fs.existsSync(config.manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(config.manifestPath, 'utf8'));
  }
  const existingIds = manifest.entries.map(e => e.id);

  // Generate or use existing ID
  let id;
  if (contentType === 'workflow') {
    id = frontmatter.workflow_id || generateWorkflowId(frontmatter.title, existingIds);
  } else {
    id = generateId(frontmatter.title, contentType, existingIds);
  }

  console.log(`📌 ID: ${id}`);

  // Create directory and copy file
  const targetDir = path.join(CONTENT_BASE, config.dir, id);
  const targetFile = path.join(targetDir, config.filename);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`✅ Created directory: ${path.relative(process.cwd(), targetDir)}`);
  }

  // Update frontmatter with ID if workflow
  let finalContent = content;
  if (contentType === 'workflow' && !frontmatter.workflow_id) {
    // Add workflow_id to frontmatter
    const frontmatterLines = content.match(/^---\n([\s\S]*?)\n---/)[1].split('\n');
    frontmatterLines.push(`workflow_id: "${id}"`);
    finalContent = content.replace(
      /^---\n[\s\S]*?\n---/,
      `---\n${frontmatterLines.join('\n')}\n---`
    );
  }

  fs.writeFileSync(targetFile, finalContent);
  console.log(`✅ Copied file to: ${path.relative(process.cwd(), targetFile)}`);

  // Create manifest entry
  const manifestEntry = createManifestEntry(frontmatter, id, contentType);

  // Update manifest
  const action = updateManifest(config.manifestPath, manifestEntry);

  console.log(`\n✨ ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${action} successfully!\n`);
  console.log(`   ID: ${id}`);
  console.log(`   Location: ${path.relative(process.cwd(), targetFile)}`);
  console.log(`   Manifest: ${path.relative(process.cwd(), config.manifestPath)}`);
  console.log('\n🎉 Content is now available in both Docs and Hub pages!\n');
}

// Run the script
try {
  main();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
