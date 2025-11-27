/**
 * Check Supabase Data Script
 * Displays current state of workflows, skills, MCP servers, and subagents
 *
 * Usage: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run check-db
 * Or set in .env.local and Vite will load them
 */

import { createClient } from '@supabase/supabase-js'

// For Vite projects, environment variables are loaded automatically
// Just use the same keys that the frontend uses
const supabaseUrl = 'https://zurnxrcxeawgfgrpcmmu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cm54cmN4ZWF3Z2ZncnBjbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDE2MjUsImV4cCI6MjA3OTgxNzYyNX0.75FDLqMZAKusdPdtNtPKu_UYcjc91ZmReakVzZ5ALGw'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
  console.error('   Check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('🔍 Checking Supabase Data...\n')

  try {
    // Check workflows
    const { data: workflows, error: wError } = await supabase
      .from('workflows')
      .select('id, name, description, content, raw_content, frontmatter, is_template, user_id')
      .order('created_at', { ascending: false })

    if (wError) throw wError

    console.log('📋 Workflows:')
    console.log(`   Total: ${workflows?.length || 0}`)
    console.log(`   With content: ${workflows?.filter(w => w.content).length || 0}`)
    console.log(`   Templates: ${workflows?.filter(w => w.is_template).length || 0}`)
    if (workflows && workflows.length > 0) {
      console.log('\n   Sample workflows:')
      workflows.slice(0, 3).forEach(w => {
        console.log(`   - ${w.name}`)
        console.log(`     ID: ${w.id}`)
        console.log(`     Has content: ${!!w.content}`)
        console.log(`     Has raw_content: ${!!w.raw_content}`)
        console.log(`     Has frontmatter: ${!!w.frontmatter && Object.keys(w.frontmatter).length > 0}`)
        console.log(`     Is template: ${w.is_template}`)
        console.log()
      })
    }
    console.log()

    // Check skills
    const { data: skills, error: sError } = await supabase
      .from('skills')
      .select('id, name, description, content, raw_content, frontmatter, is_template')
      .order('created_at', { ascending: false })

    if (sError) throw sError

    console.log('🎯 Skills:')
    console.log(`   Total: ${skills?.length || 0}`)
    console.log(`   With content: ${skills?.filter(s => s.content).length || 0}`)
    console.log(`   Templates: ${skills?.filter(s => s.is_template).length || 0}`)
    console.log()

    // Check MCP servers
    const { data: mcpServers, error: mError } = await supabase
      .from('mcp_servers')
      .select('id, name, description, content, raw_content, frontmatter, is_template')
      .order('created_at', { ascending: false })

    if (mError) throw mError

    console.log('🔌 MCP Servers:')
    console.log(`   Total: ${mcpServers?.length || 0}`)
    console.log(`   With content: ${mcpServers?.filter(m => m.content).length || 0}`)
    console.log(`   Templates: ${mcpServers?.filter(m => m.is_template).length || 0}`)
    console.log()

    // Check subagents
    const { data: subagents, error: saError } = await supabase
      .from('subagents')
      .select('id, name, description, content, raw_content, frontmatter, is_template')
      .order('created_at', { ascending: false })

    if (saError) throw saError

    console.log('🤖 Subagents:')
    console.log(`   Total: ${subagents?.length || 0}`)
    console.log(`   With content: ${subagents?.filter(s => s.content).length || 0}`)
    console.log(`   Templates: ${subagents?.filter(s => s.is_template).length || 0}`)
    console.log()

    // Check content_references
    const { data: references, error: rError } = await supabase
      .from('content_references')
      .select('id, parent_type, parent_id, name, title')
      .order('created_at', { ascending: false })

    if (rError) {
      console.log('⚠️  Content References table not found (run migration 003 first)')
    } else {
      console.log('📚 Content References:')
      console.log(`   Total: ${references?.length || 0}`)
      if (references && references.length > 0) {
        const byType = references.reduce((acc, ref) => {
          acc[ref.parent_type] = (acc[ref.parent_type] || 0) + 1
          return acc
        }, {})
        Object.entries(byType).forEach(([type, count]) => {
          console.log(`   ${type}: ${count}`)
        })
      }
      console.log()
    }

    // Summary
    console.log('📊 Summary:')
    console.log('   ✅ Database connection: OK')
    console.log(`   ✅ Total records: ${(workflows?.length || 0) + (skills?.length || 0) + (mcpServers?.length || 0) + (subagents?.length || 0)}`)
    console.log(`   ${workflows?.filter(w => w.content).length > 0 ? '✅' : '⚠️ '} Workflows have content`)
    console.log(`   ${skills?.filter(s => s.content).length > 0 ? '✅' : '⚠️ '} Skills have content`)
    console.log(`   ${mcpServers?.filter(m => m.content).length > 0 ? '✅' : '⚠️ '} MCP servers have content`)
    console.log(`   ${subagents?.filter(s => s.content).length > 0 ? '✅' : '⚠️ '} Subagents have content`)

  } catch (error) {
    console.error('❌ Error checking data:', error.message)
    process.exit(1)
  }
}

checkData()
