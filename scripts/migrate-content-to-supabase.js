/**
 * Content Migration Script
 *
 * Migrates markdown content from /public/content/ to Supabase database
 *
 * Usage:
 *   node scripts/migrate-content-to-supabase.js
 *
 * This script:
 * 1. Reads all markdown files from /public/content/
 * 2. Parses frontmatter and content
 * 3. Matches to existing database records
 * 4. Updates records with content
 * 5. Migrates reference files to content_references table
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase client (using environment variables)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
  console.error('   Create a .env file with these variables or export them')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Parse frontmatter from markdown
function parseFrontmatter(markdown) {
  const frontmatterMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)

  if (!frontmatterMatch) {
    return { frontmatter: {}, content: markdown, raw: markdown }
  }

  const yamlStr = frontmatterMatch[1]
  const content = frontmatterMatch[2].trim()
  const frontmatter = {}

  // Simple YAML parser (handles basic key: value pairs)
  yamlStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0 && !line.startsWith(' ') && !line.startsWith('#')) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '')

      // Try to parse as number
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value)
      }

      frontmatter[key] = value
    }
  })

  return { frontmatter, content, raw: markdown }
}

// Migrate workflows
async function migrateWorkflows() {
  console.log('\n📁 Migrating Workflows...')
  const contentDir = path.join(__dirname, '../public/content')
  const workflowsDir = path.join(contentDir, 'workflows')

  try {
    const workflowDirs = await fs.readdir(workflowsDir)
    let successCount = 0
    let errorCount = 0

    for (const dir of workflowDirs) {
      const workflowFile = path.join(workflowsDir, dir, 'WORKFLOW.md')

      try {
        // Check if file exists
        await fs.access(workflowFile)

        const markdown = await fs.readFile(workflowFile, 'utf-8')
        const { frontmatter, content, raw } = parseFrontmatter(markdown)

        // Find workflow in database by matching name or directory
        const { data: existingWorkflows } = await supabase
          .from('workflows')
          .select('id, name')
          .or(`name.ilike.%${dir}%,id.eq.${dir}`)
          .limit(1)

        if (!existingWorkflows || existingWorkflows.length === 0) {
          console.log(`  ⚠️  No matching workflow found for: ${dir}`)
          errorCount++
          continue
        }

        const workflowId = existingWorkflows[0].id

        // Update workflow with content
        const { error } = await supabase
          .from('workflows')
          .update({
            content: content,
            raw_content: raw,
            frontmatter: frontmatter,
            updated_at: new Date().toISOString()
          })
          .eq('id', workflowId)

        if (error) {
          console.error(`  ❌ Failed to migrate workflow ${dir}:`, error.message)
          errorCount++
        } else {
          console.log(`  ✓ Migrated workflow: ${existingWorkflows[0].name}`)
          successCount++
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`  ⚠️  File not found: ${workflowFile}`)
        } else {
          console.error(`  ❌ Error processing ${dir}:`, err.message)
        }
        errorCount++
      }
    }

    console.log(`\n  Summary: ${successCount} successful, ${errorCount} errors`)
    return { success: successCount, errors: errorCount }
  } catch (error) {
    console.error('  ❌ Error reading workflows directory:', error.message)
    return { success: 0, errors: 1 }
  }
}

// Migrate reference files for a parent entity
async function migrateReferences(parentType, parentId, referencesDir, parentName) {
  try {
    // Check if references directory exists
    await fs.access(referencesDir)
    const refFiles = await fs.readdir(referencesDir)
    const markdownFiles = refFiles.filter(f => f.endsWith('.md'))

    if (markdownFiles.length === 0) {
      return { success: 0, errors: 0 }
    }

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < markdownFiles.length; i++) {
      const file = markdownFiles[i]
      const filePath = path.join(referencesDir, file)

      try {
        const markdown = await fs.readFile(filePath, 'utf-8')
        const { frontmatter, content, raw } = parseFrontmatter(markdown)

        const { error } = await supabase
          .from('content_references')
          .upsert({
            parent_type: parentType,
            parent_id: parentId,
            name: file,
            title: frontmatter.title || file.replace('.md', ''),
            description: frontmatter.description || null,
            order_index: i,
            content: content,
            raw_content: raw,
            frontmatter: frontmatter
          }, {
            onConflict: 'parent_type,parent_id,name'
          })

        if (error) {
          console.error(`    ❌ Failed to migrate reference ${file}:`, error.message)
          errorCount++
        } else {
          console.log(`    ✓ Reference: ${file}`)
          successCount++
        }
      } catch (err) {
        console.error(`    ❌ Error reading ${file}:`, err.message)
        errorCount++
      }
    }

    return { success: successCount, errors: errorCount }
  } catch (error) {
    // References directory doesn't exist, which is fine
    return { success: 0, errors: 0 }
  }
}

// Migrate MCP servers
async function migrateMcpServers() {
  console.log('\n📁 Migrating MCP Servers...')
  const contentDir = path.join(__dirname, '../public/content')
  const mcpDir = path.join(contentDir, 'mcp')

  try {
    const mcpDirs = await fs.readdir(mcpDir)
    let successCount = 0
    let errorCount = 0
    let refSuccess = 0
    let refErrors = 0

    for (const dir of mcpDirs) {
      const mcpFile = path.join(mcpDir, dir, 'MCP.md')

      try {
        await fs.access(mcpFile)

        const markdown = await fs.readFile(mcpFile, 'utf-8')
        const { frontmatter, content, raw } = parseFrontmatter(markdown)

        // Find MCP server in database
        const { data: existingServers } = await supabase
          .from('mcp_servers')
          .select('id, name')
          .or(`name.ilike.%${dir}%,id.eq.${dir}`)
          .limit(1)

        if (!existingServers || existingServers.length === 0) {
          console.log(`  ⚠️  No matching MCP server found for: ${dir}`)
          errorCount++
          continue
        }

        const serverId = existingServers[0].id

        // Update MCP server with content
        const { error } = await supabase
          .from('mcp_servers')
          .update({
            content: content,
            raw_content: raw,
            frontmatter: frontmatter,
            updated_at: new Date().toISOString()
          })
          .eq('id', serverId)

        if (error) {
          console.error(`  ❌ Failed to migrate MCP server ${dir}:`, error.message)
          errorCount++
        } else {
          console.log(`  ✓ Migrated MCP server: ${existingServers[0].name}`)
          successCount++

          // Migrate references if they exist
          const referencesDir = path.join(mcpDir, dir, 'references')
          const refResult = await migrateReferences('mcp_server', serverId, referencesDir, existingServers[0].name)
          refSuccess += refResult.success
          refErrors += refResult.errors
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`  ⚠️  File not found: ${mcpFile}`)
        } else {
          console.error(`  ❌ Error processing ${dir}:`, err.message)
        }
        errorCount++
      }
    }

    console.log(`\n  Summary: ${successCount} successful, ${errorCount} errors`)
    if (refSuccess > 0 || refErrors > 0) {
      console.log(`  References: ${refSuccess} successful, ${refErrors} errors`)
    }
    return { success: successCount, errors: errorCount }
  } catch (error) {
    console.error('  ❌ Error reading mcp directory:', error.message)
    return { success: 0, errors: 1 }
  }
}

// Migrate subagents
async function migrateSubagents() {
  console.log('\n📁 Migrating Subagents...')
  const contentDir = path.join(__dirname, '../public/content')
  const subagentsDir = path.join(contentDir, 'subagents')

  try {
    const subagentDirs = await fs.readdir(subagentsDir)
    let successCount = 0
    let errorCount = 0
    let refSuccess = 0
    let refErrors = 0

    for (const dir of subagentDirs) {
      const subagentFile = path.join(subagentsDir, dir, 'SUBAGENT.md')

      try {
        await fs.access(subagentFile)

        const markdown = await fs.readFile(subagentFile, 'utf-8')
        const { frontmatter, content, raw } = parseFrontmatter(markdown)

        // Find subagent in database
        const { data: existingSubagents } = await supabase
          .from('subagents')
          .select('id, name')
          .or(`name.ilike.%${dir}%,id.eq.${dir}`)
          .limit(1)

        if (!existingSubagents || existingSubagents.length === 0) {
          console.log(`  ⚠️  No matching subagent found for: ${dir}`)
          errorCount++
          continue
        }

        const subagentId = existingSubagents[0].id

        // Update subagent with content
        const { error } = await supabase
          .from('subagents')
          .update({
            content: content,
            raw_content: raw,
            frontmatter: frontmatter,
            updated_at: new Date().toISOString()
          })
          .eq('id', subagentId)

        if (error) {
          console.error(`  ❌ Failed to migrate subagent ${dir}:`, error.message)
          errorCount++
        } else {
          console.log(`  ✓ Migrated subagent: ${existingSubagents[0].name}`)
          successCount++

          // Migrate references if they exist
          const referencesDir = path.join(subagentsDir, dir, 'references')
          const refResult = await migrateReferences('subagent', subagentId, referencesDir, existingSubagents[0].name)
          refSuccess += refResult.success
          refErrors += refResult.errors
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`  ⚠️  File not found: ${subagentFile}`)
        } else {
          console.error(`  ❌ Error processing ${dir}:`, err.message)
        }
        errorCount++
      }
    }

    console.log(`\n  Summary: ${successCount} successful, ${errorCount} errors`)
    if (refSuccess > 0 || refErrors > 0) {
      console.log(`  References: ${refSuccess} successful, ${refErrors} errors`)
    }
    return { success: successCount, errors: errorCount }
  } catch (error) {
    console.error('  ❌ Error reading subagents directory:', error.message)
    return { success: 0, errors: 1 }
  }
}

// Main migration function
async function main() {
  console.log('🚀 Starting Content Migration to Supabase')
  console.log('=========================================\n')

  const results = {
    workflows: { success: 0, errors: 0 },
    mcpServers: { success: 0, errors: 0 },
    subagents: { success: 0, errors: 0 }
  }

  // Run migrations
  results.workflows = await migrateWorkflows()
  results.mcpServers = await migrateMcpServers()
  results.subagents = await migrateSubagents()

  // Print final summary
  console.log('\n\n✨ Migration Complete!')
  console.log('====================')
  console.log(`Workflows:    ${results.workflows.success} successful, ${results.workflows.errors} errors`)
  console.log(`MCP Servers:  ${results.mcpServers.success} successful, ${results.mcpServers.errors} errors`)
  console.log(`Subagents:    ${results.subagents.success} successful, ${results.subagents.errors} errors`)

  const totalSuccess = results.workflows.success + results.mcpServers.success + results.subagents.success
  const totalErrors = results.workflows.errors + results.mcpServers.errors + results.subagents.errors

  console.log(`\nTotal:        ${totalSuccess} successful, ${totalErrors} errors\n`)

  if (totalErrors === 0) {
    console.log('✅ All content migrated successfully!')
  } else {
    console.log('⚠️  Some content failed to migrate. Review errors above.')
  }
}

// Run migration
main().catch(error => {
  console.error('\n❌ Fatal error during migration:', error)
  process.exit(1)
})
