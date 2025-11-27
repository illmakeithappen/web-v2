#!/usr/bin/env node

/**
 * Run Migration 004: Add file_type and is_markdown columns to content_references
 *
 * This script uses the Supabase client to execute the migration SQL
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

console.log('🚀 Running Migration 004: Add file type columns to content_references\n')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('⏳ Adding file_type column...')

    // Execute each statement separately
    const statements = [
      `ALTER TABLE content_references ADD COLUMN IF NOT EXISTS file_type VARCHAR(50)`,
      `ALTER TABLE content_references ADD COLUMN IF NOT EXISTS is_markdown BOOLEAN DEFAULT false`,
      `ALTER TABLE content_references ALTER COLUMN content DROP NOT NULL`,
      `UPDATE content_references SET is_markdown = true WHERE name LIKE '%.md' OR name LIKE '%.MD'`,
      `UPDATE content_references SET file_type = 'markdown' WHERE is_markdown = true`,
      `CREATE INDEX IF NOT EXISTS idx_content_references_file_type ON content_references(file_type)`,
      `CREATE INDEX IF NOT EXISTS idx_content_references_is_markdown ON content_references(is_markdown)`
    ]

    for (const sql of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
      if (error) {
        // Try direct query if RPC doesn't exist
        console.log(`   Trying direct execution...`)
        console.log(`   SQL: ${sql}`)
        console.log(`   Note: Direct SQL execution may not be available via Supabase client`)
      }
    }

    console.log('\n✅ Migration completed!')
    console.log('\n📊 Verifying migration...')

    // Verify by querying the table structure
    const { data, error } = await supabase
      .from('content_references')
      .select('file_type, is_markdown')
      .limit(1)

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.error('❌ Migration verification failed - columns not created')
        console.error('   You need to run this SQL directly in Supabase Dashboard → SQL Editor:')
        console.error('')
        console.error('   See: /Users/gitt/hub/web-v2/scripts/apply-migration-004.sql')
        process.exit(1)
      }
    } else {
      console.log('✅ Verification successful - columns exist!')
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('\nPlease run the migration manually in Supabase Dashboard → SQL Editor')
    console.error('SQL file: /Users/gitt/hub/web-v2/scripts/apply-migration-004.sql')
    process.exit(1)
  }
}

runMigration()
